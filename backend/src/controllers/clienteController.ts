import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Cliente } from '../models/Cliente';

export const listarClientes = async (_req: Request, res: Response): Promise<void> => {
  const usuarioRepo = AppDataSource.getRepository(Cliente);
  const clientes = await usuarioRepo.find({
    where: { rol: 'cliente' },
    select: ['id', 'email', 'direccion', 'telefono']
  });
  res.json(clientes);
};

export const actualizarCliente = async (req: Request, res: Response): Promise<void> => {
  const { direccion, telefono } = req.body;
  const usuarioRepo = AppDataSource.getRepository(Cliente);
  const cliente = await usuarioRepo.findOne({
    where: { id: Number(req.params.id), rol: 'cliente' }
  });
  if (!cliente) {
    res.status(404).json({ error: 'Cliente no encontrado' });
    return;
  }
  // Validar teléfono (ejemplo básico)
  if (telefono && !/^[0-9]{10,15}$/.test(telefono)) {
    res.status(400).json({ error: 'Teléfono inválido' });
    return;
  }
  // Validar dirección
  if (direccion && direccion.length > 200) {
    res.status(400).json({ error: 'Dirección demasiado larga' });
    return;
  }
  usuarioRepo.merge(cliente, { direccion, telefono });
  await usuarioRepo.save(cliente);
  res.json({
    id: cliente.id,
    email: cliente.email,
    direccion: cliente.direccion,
    telefono: cliente.telefono
  });
};
