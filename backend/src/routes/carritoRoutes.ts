const express = require("express");
import { authenticate } from '../middlewares/authMiddleware';
import * as carritoController from '../controllers/CarritoController';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/', authenticate, carritoController.crearCarrito);
router.post('/:carritoId/items', authenticate, carritoController.agregarItem);
// Compatibilidad: permite POST /api/carrito/items (sin carritoId)
router.post('/items', authenticate, async (req: Request, res: Response) => {
  // @ts-ignore
  const usuarioId = req.user.id;
  const { getRepository } = require('typeorm');
  const { Carrito } = require('../models/Carrito');
  try {
    const carrito = await getRepository(Carrito).findOne({ where: { cliente: { id: usuarioId }, estado: 'activo' } });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
    req.params.carritoId = carrito.id;
    // Llama a agregarItem con req y res solamente
    return carritoController.agregarItem(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Error interno al agregar item al carrito' });
  }
});

export default router;
