import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Cliente } from '../models/Cliente';
import bcrypt from 'bcrypt';

export const crearUsuario = async (req: Request, res: Response) => {
  console.log('LOG CREAR USUARIO ADMIN BODY:', req.body); // <-- Log explícito
  const { email, password, rol, direccion, telefono } = req.body;

  // Validaciones básicas
  if (!['admin', 'cliente'].includes(rol)) {
    res.status(400).json({ error: 'Rol inválido' });
    return;
  }

  const usuarioRepo = AppDataSource.getRepository(Cliente);

  // Verificar si el usuario ya existe
  const existe = await usuarioRepo.findOne({ where: { email } });
  if (existe) {
    res.status(400).json({ error: 'El usuario ya existe' });
    return;
  }

  // Crear usuario
  const hashedPassword = await bcrypt.hash(password, 10);
  const usuario = usuarioRepo.create({
    email,
    password: hashedPassword,
    rol,
    direccion,
    telefono
  });

  await usuarioRepo.save(usuario);
  res.status(201).json({ id: usuario.id, email: usuario.email, rol: usuario.rol });
};

export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  const { email, password, rol, direccion, telefono } = req.body;
  const usuarioRepo = AppDataSource.getRepository(Cliente);
  const usuario = await usuarioRepo.findOne({ where: { id: Number(req.params.id) } });
  if (!usuario) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }
  if (email) usuario.email = email;
  if (rol && ['admin', 'cliente'].includes(rol)) usuario.rol = rol;
  if (direccion) usuario.direccion = direccion;
  if (telefono) usuario.telefono = telefono;
  if (password) {
    usuario.password = await bcrypt.hash(password, 10);
  }
  await usuarioRepo.save(usuario);
  res.json({
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
    direccion: usuario.direccion,
    telefono: usuario.telefono
  });
};
