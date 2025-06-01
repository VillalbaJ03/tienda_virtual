import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Carrito } from "../models/Carrito";

export const obtenerCarrito = async (req: Request, res: Response) => {
    // @ts-ignore
    const usuarioId = req.user.id;
    const carritoRepo = getRepository(Carrito);
    const carrito = await carritoRepo.findOne({
        where: { cliente: { id: usuarioId }, estado: 'activo' },
        relations: ['items', 'items.producto']
    });
    if (!carrito) {
        return res.json({ id: null, estado: 'activo', items: [] });
    }
    res.json(carrito);
};
