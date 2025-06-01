const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { AppDataSource } from '../config/data-source';
import { Cliente } from '../models/Cliente';

const router = express.Router();

// Registro
router.post('/registro', async (req: any, res: any) => {
  try {
    console.log('Registro recibido:', req.body);
    const { email, password, nombre, direccion, telefono } = req.body;
    const usuarioRepo = AppDataSource.getRepository(Cliente);
    const existe = await usuarioRepo.findOne({ where: { email } });
    if (existe) {
      console.log('Intento de registro con email ya existente:', email);
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = usuarioRepo.create({
      email,
      password: hashedPassword,
      nombre,
      direccion,
      telefono,
      rol: 'cliente' // Siempre asignar rol por defecto
    });
    await usuarioRepo.save(nuevoUsuario);
    console.log('Usuario registrado correctamente:', nuevoUsuario);
    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error interno en el registro' });
  }
});

// Login
router.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  const usuarioRepo = AppDataSource.getRepository(Cliente);
  const usuario = await usuarioRepo.findOne({ where: { email } });
  if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
  res.json({ token, rol: usuario.rol });
});

export default router;
