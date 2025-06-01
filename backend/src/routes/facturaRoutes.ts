import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

// Servir archivos PDF de facturas
router.get('/:id.pdf', (req: Request, res: Response) => {
  const facturaPath = path.resolve(process.cwd(), 'facturas', `${req.params.id}.pdf`);
  res.sendFile(facturaPath, {
    headers: {
      'Content-Type': 'application/pdf'
    }
  }, (err) => {
    if (err) {
      res.status(404).json({ error: 'Factura no encontrada' });
    }
  });
});

export default router;
