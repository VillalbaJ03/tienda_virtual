import { Router } from 'express';
import { AppDataSource } from '../config/data-source';
import { Cliente } from '../models/Cliente';
import { ItemCarrito } from '../models/ItemCarrito';
import { Producto } from '../models/Producto';
import { authenticate } from '../middlewares/authMiddleware';
import { authorizeAdmin } from '../middlewares/authorizeAdmin';
import adminProductoRoutes from './admin/productoRoutes';
import { crearUsuario, actualizarUsuario, eliminarUsuario } from '../controllers/usuarioController';

const router = Router();

// Middleware: solo admin
router.use(authenticate, authorizeAdmin);

// Rutas anidadas para productos admin
router.use('/productos', adminProductoRoutes);

// CRUD Usuarios (Clientes)
router.get('/usuarios', async (_req, res) => {
  const usuarios = await AppDataSource.getRepository(Cliente).find();
  res.json(usuarios);
});

// Crear usuario (solo admin)
router.post('/usuarios', authenticate, authorizeAdmin, crearUsuario);
// Actualizar usuario (solo admin)
router.put('/usuarios/:id', authenticate, authorizeAdmin, actualizarUsuario);
// Eliminar usuario (solo admin)
router.delete('/usuarios/:id', authenticate, authorizeAdmin, eliminarUsuario);

// Reportes (placeholder)
router.get('/reportes/ventas', async (_req, res) => {
  res.json({ mensaje: 'Endpoint de reportes de ventas (por implementar)' });
});

// Reporte: productos más vendidos
router.get('/reportes/productos-mas-vendidos', async (_req, res) => {
  const result = await AppDataSource.getRepository(ItemCarrito)
    .createQueryBuilder('item')
    .select('item.producto_id', 'productoId')
    .addSelect('SUM(item.cantidad)', 'totalVendidas')
    .groupBy('item.producto_id')
    .orderBy('"totalVendidas"', 'DESC') // Corrección: alias entre comillas dobles
    .limit(10)
    .getRawMany();

  // Obtener nombres de productos
  const productosRepo = AppDataSource.getRepository(Producto);
  const productos = await productosRepo.findByIds(result.map(r => r.productoId));
  const data = result.map(r => {
    const prod = productos.find(p => p.id === Number(r.productoId));
    return {
      nombre: prod ? prod.nombre : 'Producto',
      totalVendidas: Number(r.totalVendidas)
    };
  });
  res.json(data);
});

// Endpoint de estadísticas para el panel de administración
router.get('/stats', async (_req, res) => {
  // Total de productos
  const totalProductos = await AppDataSource.getRepository(Producto).count();
  // Total de usuarios (clientes y admins)
  const totalUsuarios = await AppDataSource.getRepository(Cliente).count();
  // Stock crítico: productos con stock <= 5
  const stockCritico = await AppDataSource.getRepository(Producto).count({ where: { stock: 5 } })
    + await AppDataSource.getRepository(Producto).count({ where: { stock: 4 } })
    + await AppDataSource.getRepository(Producto).count({ where: { stock: 3 } })
    + await AppDataSource.getRepository(Producto).count({ where: { stock: 2 } })
    + await AppDataSource.getRepository(Producto).count({ where: { stock: 1 } })
    + await AppDataSource.getRepository(Producto).count({ where: { stock: 0 } });

  // Ventas de hoy
  // Se asume que existe el modelo Venta con columna 'fecha' tipo Date
  let ventasHoy = 0;
  try {
    const { Venta } = require('../models/Venta');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    ventasHoy = await AppDataSource.getRepository(Venta).count({
      where: {
        fecha: {
          $gte: hoy,
          $lt: manana
        }
      }
    });
  } catch (e) {
    ventasHoy = 0;
  }

  res.json({
    totalProductos,
    totalUsuarios,
    ventasHoy,
    stockCritico
  });
});

export default router;
