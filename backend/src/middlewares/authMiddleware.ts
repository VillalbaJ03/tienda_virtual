import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  console.log('🔑 [authMiddleware] Inicia autenticación');
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('🔑 [authMiddleware] Token recibido:', token);
  if (!token) {
    console.log('⛔ [authMiddleware] No se recibió token');
    res.status(401).json({ error: 'Acceso no autorizado' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('🔑 [authMiddleware] Token decodificado:', decoded);
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    console.log('⛔ [authMiddleware] Token inválido:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};
