import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Venta } from '../models/Venta';

export const obtenerVentasUsuario = async (req: Request, res: Response) => {
  // @ts-ignore
  const usuarioId = req.user.id;
  try {
    const ventas = await AppDataSource.getRepository(Venta).find({
      where: { usuario: { id: usuarioId } },
      order: { fecha: 'DESC' },
      relations: ['carrito', 'carrito.items', 'carrito.items.producto']
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial de compras' });
  }
};
