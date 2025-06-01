import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { authorizeAdmin } from '../middlewares/authorizeAdmin';
import { listarClientes, actualizarCliente } from '../controllers/clienteController';

const router = Router();

router.get('/', authenticate, authorizeAdmin, listarClientes);
router.put('/:id', authenticate, authorizeAdmin, actualizarCliente);

export default router;
