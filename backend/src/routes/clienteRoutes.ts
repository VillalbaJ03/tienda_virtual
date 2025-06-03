import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { authorizeAdmin } from '../middlewares/authorizeAdmin';
import { listarClientes, actualizarCliente } from '../controllers/clienteController';

const router = Router();

router.get('/', authenticate, authorizeAdmin, listarClientes);
router.put('/:id', authenticate, authorizeAdmin, actualizarCliente);
// GET /api/clientes/me - Devuelve los datos del usuario autenticado
router.get('/me', authenticate, async (req: any, res: any) => {
  const userId = req.user.id;
  const usuarioRepo = require('../config/data-source').AppDataSource.getRepository(require('../models/Cliente').Cliente);
  const user = await usuarioRepo.findOne({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
    direccion: user.direccion,
    telefono: user.telefono
  });
});

export default router;
