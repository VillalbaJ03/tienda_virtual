const express = require("express");
import { authenticate } from '../middlewares/authMiddleware';
import * as carritoController from '../controllers/CarritoController';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/', authenticate, carritoController.crearCarrito);
router.post('/:carritoId/items', authenticate, carritoController.agregarItem);
// Compatibilidad: permite POST /api/carrito/items (sin carritoId)
router.post('/items', authenticate, carritoController.agregarItem);
router.delete('/items/:itemId', authenticate, carritoController.eliminarItem);
router.put('/items/:itemId', authenticate, carritoController.actualizarCantidadItem);

export default router;
