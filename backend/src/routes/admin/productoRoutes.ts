import { Router } from 'express';
import { authenticate } from '../../middlewares/authMiddleware';
import { authorizeAdmin } from '../../middlewares/authorizeAdmin';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '../../controllers/productoController';

const router = Router();

// CRUD Productos con middlewares en cada ruta
router.get('/', authenticate, authorizeAdmin, getProductos);
router.post('/', authenticate, authorizeAdmin, createProducto);
router.put('/:id', authenticate, authorizeAdmin, updateProducto);
router.delete('/:id', authenticate, authorizeAdmin, deleteProducto);

export default router;
