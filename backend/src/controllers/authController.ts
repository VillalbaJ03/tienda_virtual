import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Cliente } from '../models/Cliente';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registro = async (req: Request, res: Response) => {
  console.log('LOG REGISTRO BODY:', req.body); // <-- Log explícito
  const { email, password, nombre, direccion, telefono } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña requeridos' });
    return;
  }
  const usuarioRepo = AppDataSource.getRepository(Cliente);
  const existe = await usuarioRepo.findOne({ where: { email } });
  if (existe) {
    res.status(400).json({ error: 'El usuario ya existe' });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const usuario = usuarioRepo.create({
    email,
    password: hashedPassword,
    nombre,
    direccion,
    telefono,
    rol: 'cliente'
  });
  await usuarioRepo.save(usuario);
  res.status(201).json({ id: usuario.id, email: usuario.email });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const usuarioRepo = AppDataSource.getRepository(Cliente);
  const usuario = await usuarioRepo.findOne({ where: { email } });
  if (!usuario) {
    res.status(400).json({ error: 'Credenciales inválidas' });
    return;
  }
  const valid = await bcrypt.compare(password, usuario.password);
  if (!valid) {
    res.status(400).json({ error: 'Credenciales inválidas' });
    return;
  }
  const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token, rol: usuario.rol });
};
