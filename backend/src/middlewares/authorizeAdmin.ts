import { Request, Response, NextFunction } from 'express';

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // @ts-ignore
  if (req.user && req.user.rol === 'admin') {
    next();
    return;
  }
  res.status(403).json({ error: 'Acceso solo para administradores' });
};
