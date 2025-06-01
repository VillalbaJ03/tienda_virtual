import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { obtenerVentasUsuario } from '../controllers/ventasController';

const router = Router();

// Historial de compras del usuario autenticado
router.get('/', authenticate, obtenerVentasUsuario);

export default router;
