import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Producto } from '../models/Producto';

export const getProductos = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const productoRepo = AppDataSource.getRepository(Producto);
  const [productos, total] = await productoRepo.findAndCount({
    skip,
    take: limit,
    order: { id: 'ASC' }
  });

  res.json({
    data: productos,
    meta: {
      total,
      page,
      last_page: Math.ceil(total / limit)
    }
  });
};

export const createProducto = async (req: Request, res: Response) => {
  const productoRepo = AppDataSource.getRepository(Producto);
  const producto = productoRepo.create(req.body);
  await productoRepo.save(producto);
  res.status(201).json(producto);
};

export const updateProducto = async (req: Request, res: Response): Promise<void> => {
  const productoRepo = AppDataSource.getRepository(Producto);
  const producto = await productoRepo.findOneBy({ id: Number(req.params.id) });
  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  productoRepo.merge(producto, req.body);
  await productoRepo.save(producto);
  res.json(producto);
};

export const deleteProducto = async (req: Request, res: Response): Promise<void> => {
  const productoRepo = AppDataSource.getRepository(Producto);
  const producto = await productoRepo.findOneBy({ id: Number(req.params.id) });
  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  await productoRepo.remove(producto);
  res.status(204).send();
};
