import { Router } from 'express';
import { crearUsuario } from '../controllers/usuarioController';

const router = Router();

// Crear usuario (solo admin, autenticación y autorización se aplican en el router principal)
router.post('/', crearUsuario);

export default router;
