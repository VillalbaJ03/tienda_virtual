import { Router } from 'express';
import usuarioRoutes from './routes/usuarioRoutes';
import clienteRoutes from './routes/clienteRoutes';
import { authenticate } from './middlewares/authMiddleware';
import { authorizeAdmin } from './middlewares/authorizeAdmin';
import * as authController from './controllers/authController';

const router = Router();

// Rutas públicas
router.post('/registro', authController.registro);
router.post('/login', authController.login);

// Rutas protegidas
router.use('/admin/usuarios', authenticate, authorizeAdmin, usuarioRoutes);
router.use('/clientes', authenticate, clienteRoutes);

export default router;
