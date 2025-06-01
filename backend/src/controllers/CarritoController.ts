import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Carrito } from "../models/Carrito";
import { Producto } from "../models/Producto";
import { ItemCarrito } from "../models/ItemCarrito";
import { Cliente } from "../models/Cliente";

export const agregarItem = async (req: Request, res: Response) => {
    const { productoId, cantidad } = req.body;
    // @ts-ignore
    const usuarioId = req.user.id;

    const productoRepo = getRepository(Producto);
    const producto = await productoRepo.findOne(productoId);
    if (!producto || producto.stock < cantidad) {
        return res.status(400).json({ error: 'Producto no disponible' });
    }

    const carritoRepo = getRepository(Carrito);
    let carrito = await carritoRepo.findOne({
        where: { cliente: { id: usuarioId }, estado: 'activo' },
        relations: ['items', 'cliente']
    });
    if (!carrito) {
        const clienteRepo = getRepository(Cliente);
        const cliente = await clienteRepo.findOne({ where: { id: usuarioId } });
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        carrito = carritoRepo.create({ cliente, estado: 'activo' });
        await carritoRepo.save(carrito);
    }

    const itemCarritoRepo = getRepository(ItemCarrito);
    // Buscar si ya existe el producto en el carrito
    let item = await itemCarritoRepo.findOne({ where: { carrito: carrito, producto: producto } });
    if (item) {
        // Si ya existe, solo aumentar la cantidad
        item.cantidad += cantidad;
        await itemCarritoRepo.save(item);
        return res.status(200).json(item);
    } else {
        // Si no existe, crear nuevo ítem
        item = itemCarritoRepo.create({
            carrito: carrito,
            producto: producto,
            cantidad: cantidad
        });
        await itemCarritoRepo.save(item);
        return res.status(201).json(item);
    }
};

export const crearCarrito = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const clienteRepo = getRepository(Cliente);
        const carritoRepo = getRepository(Carrito);
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
