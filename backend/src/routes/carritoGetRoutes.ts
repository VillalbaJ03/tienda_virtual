import express from "express";
import { authenticate } from '../middlewares/authMiddleware';
import { obtenerCarrito } from '../controllers/obtenerCarritoController';

const router = express.Router();

console.log('🟢 carritoGetRoutes cargado');

router.get('/test', (_req, res) => {
  res.json({ ok: true, msg: 'Ruta de test de carritoGetRoutes activa' });
});

router.get('/', authenticate, obtenerCarrito);

export default router;
