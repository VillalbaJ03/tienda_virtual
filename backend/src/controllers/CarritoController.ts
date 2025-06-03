import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Carrito } from "../models/Carrito";
import { Producto } from "../models/Producto";
import { ItemCarrito } from "../models/ItemCarrito";
import { Cliente } from "../models/Cliente";

export const agregarItem = async (req: Request, res: Response) => {
    console.log('➡️ Inicia agregarItem');
    try {
        const { productoId, cantidad } = req.body;
        console.log('➡️ Body recibido:', { productoId, cantidad });
        // @ts-ignore
        const usuarioId = req.user.id;
        console.log('➡️ Usuario ID:', usuarioId);

        const productoRepo = AppDataSource.getRepository(Producto);
        const producto = await productoRepo.findOne({ where: { id: productoId } });
        console.log('➡️ Producto encontrado:', producto);
        if (!producto || producto.stock < cantidad) {
            console.log('⛔ Producto no disponible:', { producto, cantidad });
            return res.status(400).json({ error: 'Producto no disponible' });
        }

        const carritoRepo = AppDataSource.getRepository(Carrito);
        let carrito = await carritoRepo.findOne({
            where: { cliente: { id: usuarioId }, estado: 'activo' },
            relations: ['items', 'cliente']
        });
        console.log('➡️ Carrito encontrado:', carrito);
        if (!carrito) {
            const clienteRepo = AppDataSource.getRepository(Cliente);
            const cliente = await clienteRepo.findOne({ where: { id: usuarioId } });
            console.log('➡️ Cliente encontrado:', cliente);
            if (!cliente) {
                console.log('⛔ Cliente no encontrado:', usuarioId);
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            carrito = carritoRepo.create({ cliente, estado: 'activo' });
            await carritoRepo.save(carrito);
            console.log('➡️ Carrito creado:', carrito);
        }

        const itemCarritoRepo = AppDataSource.getRepository(ItemCarrito);
        let item = await itemCarritoRepo.findOne({ where: { carrito: { id: carrito.id }, producto: { id: producto.id } } });
        console.log('➡️ Item en carrito:', item);
        if (item) {
            item.cantidad += cantidad;
            await itemCarritoRepo.save(item);
            console.log('➡️ Item actualizado:', item);
            return res.status(200).json(item);
        } else {
            item = itemCarritoRepo.create({
                carrito: carrito,
                producto: producto,
                cantidad: cantidad,
                precio_unitario: producto.precio // Asigna el precio unitario
            });
            await itemCarritoRepo.save(item);
            console.log('➡️ Nuevo item creado:', item);
            return res.status(201).json(item);
        }
    } catch (error: any) {
        console.error('Error en POST /api/carrito/items:', error);
        try {
            console.error('Error (stringify):', JSON.stringify(error));
        } catch (e) {
            console.error('No se pudo serializar el error');
        }
        if (error instanceof Error) {
            console.error('Stack:', error.stack);
            console.log('⛔ Error.message:', error.message);
            return res.status(500).json({ error: error.message });
        }
        console.log('⛔ Error (raw):', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const crearCarrito = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const clienteRepo = AppDataSource.getRepository(Cliente);
        const carritoRepo = AppDataSource.getRepository(Carrito);
        const cliente = await clienteRepo.findOne({ where: { id: userId } });
        if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        const nuevoCarrito = carritoRepo.create({ cliente, estado: "activo" });
        await carritoRepo.save(nuevoCarrito);
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ error: "Error al crear carrito" });
    }
};

export const eliminarItem = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const usuarioId = req.user.id;
        const itemId = parseInt(req.params.itemId, 10);
        if (!itemId) return res.status(400).json({ error: 'ID de item inválido' });
        const itemCarritoRepo = AppDataSource.getRepository(ItemCarrito);
        const carritoRepo = AppDataSource.getRepository(Carrito);
        // Buscar el item y verificar que pertenezca al carrito activo del usuario
        const carrito = await carritoRepo.findOne({
            where: { cliente: { id: usuarioId }, estado: 'activo' },
            relations: ['items']
        });
        if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
        const item = await itemCarritoRepo.findOne({ where: { id: itemId, carrito: { id: carrito.id } } });
        if (!item) return res.status(404).json({ error: 'Item no encontrado en tu carrito' });
        await itemCarritoRepo.remove(item);
        res.json({ ok: true, mensaje: 'Item eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar item del carrito' });
    }
};

// PUT /api/carrito/items/:itemId - Actualizar cantidad de un item del carrito
export const actualizarCantidadItem = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const usuarioId = req.user.id;
        const itemId = parseInt(req.params.itemId, 10);
        const { cantidad } = req.body;
        if (!itemId || typeof cantidad !== 'number' || cantidad < 1) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }
        const itemCarritoRepo = AppDataSource.getRepository(ItemCarrito);
        const carritoRepo = AppDataSource.getRepository(Carrito);
        const productoRepo = AppDataSource.getRepository(Producto);
        // Buscar el item y verificar que pertenezca al carrito activo del usuario
        const carrito = await carritoRepo.findOne({
            where: { cliente: { id: usuarioId }, estado: 'activo' },
            relations: ['items']
        });
        if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
        const item = await itemCarritoRepo.findOne({ where: { id: itemId, carrito: { id: carrito.id } }, relations: ['producto'] });
        if (!item) return res.status(404).json({ error: 'Item no encontrado en tu carrito' });
        // Verificar stock
        const producto = await productoRepo.findOneBy({ id: item.producto.id });
        if (!producto || producto.stock < cantidad) {
            return res.status(400).json({ error: 'Stock insuficiente para este producto' });
        }
        item.cantidad = cantidad;
        await itemCarritoRepo.save(item);
        res.json({ ok: true, mensaje: 'Cantidad actualizada', item });
    } catch (error) {
        console.error('Error actualizando cantidad de item:', error);
        res.status(500).json({ error: 'Error al actualizar cantidad del item' });
    }
};
