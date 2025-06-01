import express from 'express';
import { procesarCheckout } from '../controllers/checkoutController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, procesarCheckout);

export default router;
