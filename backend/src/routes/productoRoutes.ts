const express = require("express");
import { ProductoRepository } from "../repositories/ProductoRepository";
import { Request, Response } from "express";
import { Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";

const router = express.Router();
const productoRepo = new ProductoRepository();

router.get("/", async (req: Request, res: Response) => {
    try {
        // Filtros y paginación
        const { categoria, temporada, precioMin, precioMax, pagina = 1, limite = 12 } = req.query;
        let whereTypeORM: any = {};
        if (categoria) whereTypeORM.categoria = categoria;
        if (temporada) whereTypeORM.temporada = temporada;
        if (precioMin && precioMax) whereTypeORM.precio = Between(Number(precioMin), Number(precioMax));
        else if (precioMin) whereTypeORM.precio = MoreThanOrEqual(Number(precioMin));
        else if (precioMax) whereTypeORM.precio = LessThanOrEqual(Number(precioMax));

        const page = Number(pagina) || 1;
        const limit = Number(limite) || 12;
        // Usar el repo público de ProductoRepository
        const repo = productoRepo["repo"];
        const [productos, total] = await repo.findAndCount({
            where: whereTypeORM,
            skip: (page - 1) * limit,
            take: limit
        });

        // Solo los campos relevantes para la tienda
        const productosTienda = productos.map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            categoria: p.categoria,
            precio: p.precio,
            descuento: p.descuento,
            stock: p.stock,
            temporada: p.temporada,
            estado: p.estado,
            imagenUrl: p.imagenUrl // <-- AGREGADO
        }));

        res.json({ productos: productosTienda, total });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Obtener un producto por id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ error: 'ID inválido' });
        const repo = productoRepo["repo"];
        const producto = await repo.findOneBy({ id });
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

export default router;
