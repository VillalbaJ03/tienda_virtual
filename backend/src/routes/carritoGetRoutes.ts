const express = require("express");
import { authenticate } from '../middlewares/authMiddleware';
import { obtenerCarrito } from '../controllers/obtenerCarritoController';

const router = express.Router();

router.get('/', authenticate, obtenerCarrito);

export default router;
