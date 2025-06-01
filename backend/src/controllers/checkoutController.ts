import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Carrito } from '../models/Carrito';
import { Producto } from '../models/Producto';
import { Venta } from '../models/Venta';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const procesarCheckout = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const usuarioId = req.user.id;
  const carritoRepo = AppDataSource.getRepository(Carrito);
  const productoRepo = AppDataSource.getRepository(Producto);
  const ventaRepo = AppDataSource.getRepository(Venta);

  // Obtener carrito activo
  const carrito = await carritoRepo.findOne({
    where: { cliente: { id: usuarioId }, estado: 'activo' },
    relations: ['items', 'items.producto', 'cliente']
  });

  if (!carrito || carrito.items.length === 0) {
    res.status(400).json({ error: 'Carrito vacío' });
    return;
  }

  // Calcular totales
  let subtotal = 0;
  for (const item of carrito.items) {
    const precioConDescuento = item.producto.precio * (1 - (item.producto.descuento || 0) / 100);
    subtotal += precioConDescuento * item.cantidad;
  }

  const impuestos = subtotal * 0.16; // 16% de IVA
  const total = subtotal + impuestos;

  // Verificar stock y actualizar inventario
  for (const item of carrito.items) {
    const producto = await productoRepo.findOneBy({ id: item.producto.id });
    if (!producto || producto.stock < item.cantidad) {
      res.status(400).json({ 
        error: `Stock insuficiente para ${item.producto.nombre}`
      });
      return;
    }
    producto.stock -= item.cantidad;
    await productoRepo.save(producto);
  }

  // Crear venta
  const venta = ventaRepo.create({
    carrito: carrito,
    usuario: carrito.cliente,
    subtotal,
    impuestos,
    total
  });
  await ventaRepo.save(venta);

  // Actualizar estado del carrito
  carrito.estado = 'completado';
  await carritoRepo.save(carrito);

  // Generar factura PDF
  await generarFactura(venta, carrito);

  res.json({
    mensaje: 'Compra realizada con éxito',
    venta,
    facturaUrl: `/facturas/${venta.id}.pdf`
  });
};

async function generarFactura(venta: Venta, carrito: Carrito) {
  const doc = new PDFDocument();
  const facturasDir = path.resolve(__dirname, '../../facturas');
  if (!fs.existsSync(facturasDir)) {
    fs.mkdirSync(facturasDir);
  }
  const facturaPath = path.join(facturasDir, `${venta.id}.pdf`);
  doc.pipe(fs.createWriteStream(facturaPath));

  // Encabezado
  doc.fontSize(20).text('Factura de Compra', { align: 'center' });
  doc.moveDown();

  // Detalles de la venta
  doc.fontSize(14).text(`Número de Factura: ${venta.id}`);
  doc.text(`Fecha: ${venta.fecha.toLocaleDateString()}`);
  doc.moveDown();

  // Items
  doc.fontSize(12).text('Productos:', { underline: true });
  carrito.items.forEach(item => {
    doc.text(
      `${item.producto.nombre} - ${item.cantidad} x $${item.producto.precio} (Descuento: ${(item.producto.descuento || 0)}%)`
    );
  });

  // Totales
  doc.moveDown();
  doc.text(`Subtotal: $${venta.subtotal.toFixed(2)}`);
  doc.text(`Impuestos: $${venta.impuestos.toFixed(2)}`);
  doc.font('Helvetica-Bold').text(`Total: $${venta.total.toFixed(2)}`);

  doc.end();
  return facturaPath;
}
