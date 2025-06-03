import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Carrito } from "../models/Carrito";

export const obtenerCarrito = async (req: Request, res: Response): Promise<void> => {
    // @ts-ignore
    const usuarioId = req.user.id;
    const carritoRepo = AppDataSource.getRepository(Carrito);
    const carrito = await carritoRepo.findOne({
        where: { cliente: { id: usuarioId }, estado: 'activo' },
        relations: ['items', 'items.producto']
    });
    if (!carrito) {
        res.json({ id: null, estado: 'activo', items: [] });
        return;
    }
    res.json(carrito);
};
