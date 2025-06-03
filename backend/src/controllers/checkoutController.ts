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
  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4',
    bufferPages: true,
    info: {
      Title: `Factura ${venta.id} - VillalbaStore`,
      Author: 'VillalbaStore',
      Creator: 'VillalbaStore E-commerce'
    }
  });

  // Configuración de directorio de facturas
  const facturasDir = path.resolve(__dirname, '../../facturas');
  if (!fs.existsSync(facturasDir)) {
    fs.mkdirSync(facturasDir, { recursive: true });
  }
  const facturaPath = path.join(facturasDir, `${venta.id}.pdf`);
  doc.pipe(fs.createWriteStream(facturaPath));

  // Estilos reutilizables
  const styles = {
    header1: { fontSize: 24, color: '#1e3a8a', bold: true },
    header2: { fontSize: 16, color: '#1e40af' },
    normal: { fontSize: 12, color: '#374151' },
    small: { fontSize: 10, color: '#6b7280' },
    tableHeader: { fontSize: 12, color: '#ffffff', bold: true },
    totalLabel: { fontSize: 12, color: '#1e3a8a', bold: true },
    totalValue: { fontSize: 14, color: '#1e3a8a', bold: true },
    footer: { fontSize: 10, color: '#9ca3af' }
  };

  // --- Encabezado ---
  // Logo y datos de la empresa
  const logoPath = path.resolve(__dirname, '../public/logo-villalba.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 50, { width: 120 });
  } else {
    doc.fontSize(styles.header1.fontSize)
       .fillColor(styles.header1.color)
       .text('VillalbaStore', 50, 60);
  }

  // Datos de la empresa alineados a la derecha
  doc.fontSize(styles.small.fontSize)
     .fillColor(styles.small.color)
     .text('VillalbaStore S.A.', doc.page.width - 200, 60, { width: 150, align: 'right' })
     .text('CUIT: 30-12345678-9', doc.page.width - 200, 75, { width: 150, align: 'right' })
     .text('Av. Siempreviva 742', doc.page.width - 200, 90, { width: 150, align: 'right' })
     .text('Córdoba, Argentina', doc.page.width - 200, 105, { width: 150, align: 'right' })
     .text('Tel: +54 351 123-4567', doc.page.width - 200, 120, { width: 150, align: 'right' });

  // Título de factura
  doc.fontSize(styles.header1.fontSize)
     .fillColor(styles.header1.color)
     .text('FACTURA', 50, 150)
     .moveDown(0.5);

  // Línea decorativa
  doc.fillColor('#1e40af')
     .rect(50, 180, doc.page.width - 100, 2)
     .fill();

  // --- Datos de la factura y cliente ---
  const datosFacturaTop = 200;
  
  // Columna izquierda: Datos de factura
  doc.fontSize(styles.header2.fontSize)
     .fillColor(styles.header2.color)
     .text('Datos de la Factura', 50, datosFacturaTop)
     .moveDown(0.3);
  
  doc.fontSize(styles.normal.fontSize)
     .fillColor(styles.normal.color)
     .text(`N° Factura: ${venta.id}`, 50, doc.y)
     .text(`Fecha: ${venta.fecha.toLocaleDateString('es-AR')}`, 50, doc.y + 20)
     .text(`Forma de Pago: Tarjeta de Crédito`, 50, doc.y + 20);

  // Columna derecha: Datos del cliente
  const clienteX = doc.page.width / 2;
  
  doc.fontSize(styles.header2.fontSize)
     .fillColor(styles.header2.color)
     .text('Datos del Cliente', clienteX, datosFacturaTop)
     .moveDown(0.3);
  
  doc.fontSize(styles.normal.fontSize)
     .fillColor(styles.normal.color)
     .text(`${carrito.cliente.nombre}`, clienteX, doc.y)
     .text(`${carrito.cliente.email}`, clienteX, doc.y + 20);
  
  if (carrito.cliente.direccion) {
    doc.text(`Dirección: ${carrito.cliente.direccion}`, clienteX, doc.y + 20);
  }
  
  if (carrito.cliente.telefono) {
    doc.text(`Teléfono: ${carrito.cliente.telefono}`, clienteX, doc.y + 20);
  }

  // --- Tabla de productos ---
  const tableTop = 320;
  const columnWidths = {
    producto: 220,
    cantidad: 60,
    precio: 80,
    descuento: 60,
    subtotal: 80
  };

  // Cabecera de la tabla con fondo azul
  doc.fillColor('#1e40af')
     .rect(50, tableTop, doc.page.width - 100, 25)
     .fill();
  
  doc.fontSize(styles.tableHeader.fontSize)
     .fillColor(styles.tableHeader.color)
     .text('Producto', 55, tableTop + 7)
     .text('Cantidad', 50 + columnWidths.producto, tableTop + 7, { width: columnWidths.cantidad, align: 'right' })
     .text('P. Unitario', 50 + columnWidths.producto + columnWidths.cantidad, tableTop + 7, { width: columnWidths.precio, align: 'right' })
     .text('Desc.', 50 + columnWidths.producto + columnWidths.cantidad + columnWidths.precio, tableTop + 7, { width: columnWidths.descuento, align: 'right' })
     .text('Subtotal', 50 + columnWidths.producto + columnWidths.cantidad + columnWidths.precio + columnWidths.descuento, tableTop + 7, { width: columnWidths.subtotal, align: 'right' });

  // Filas de productos
  let y = tableTop + 30;
  doc.fontSize(styles.normal.fontSize)
     .fillColor(styles.normal.color);
  
  carrito.items.forEach((item, index) => {
    const precio = Number(item.producto.precio);
    const desc = Number(item.producto.descuento) || 0;
    const subtotal = precio * item.cantidad * (1 - desc / 100);
    
    // Alternar color de fondo para filas
    if (index % 2 === 0) {
      doc.fillColor('#f8fafc')
         .rect(50, y - 5, doc.page.width - 100, 25)
         .fill();
    }
    
    doc.fillColor(styles.normal.color)
       .text(item.producto.nombre, 55, y, { width: columnWidths.producto - 10 })
       .text(item.cantidad.toString(), 50 + columnWidths.producto, y, { width: columnWidths.cantidad, align: 'right' })
       .text(`$${precio.toFixed(2)}`, 50 + columnWidths.producto + columnWidths.cantidad, y, { width: columnWidths.precio, align: 'right' })
       .text(`${desc}%`, 50 + columnWidths.producto + columnWidths.cantidad + columnWidths.precio, y, { width: columnWidths.descuento, align: 'right' })
       .text(`$${subtotal.toFixed(2)}`, 50 + columnWidths.producto + columnWidths.cantidad + columnWidths.precio + columnWidths.descuento, y, { width: columnWidths.subtotal, align: 'right' });
    
    y += 25;
  });

  // --- Totales ---
  const totalsTop = y + 20;
  
  doc.fontSize(styles.totalLabel.fontSize)
     .fillColor(styles.totalLabel.color)
     .text('Subtotal:', doc.page.width - 200, totalsTop, { width: 100, align: 'right' })
     .text(`$${venta.subtotal.toFixed(2)}`, doc.page.width - 90, totalsTop, { width: 80, align: 'right' })
     .text('IVA (16%):', doc.page.width - 200, totalsTop + 25, { width: 100, align: 'right' })
     .text(`$${venta.impuestos.toFixed(2)}`, doc.page.width - 90, totalsTop + 25, { width: 80, align: 'right' });
  
  // Línea decorativa sobre total
  doc.fillColor('#1e40af')
     .rect(doc.page.width - 200, totalsTop + 50, 150, 1)
     .fill();
  
  doc.fontSize(styles.totalValue.fontSize)
     .fillColor(styles.totalValue.color)
     .text('TOTAL:', doc.page.width - 200, totalsTop + 55, { width: 100, align: 'right' })
     .text(`$${venta.total.toFixed(2)}`, doc.page.width - 90, totalsTop + 55, { width: 80, align: 'right' });

  // --- Pie de página ---
  // Solo una línea de agradecimiento, sin textos adicionales ni marca de agua
  const footerY = doc.page.height - 70;
  const footerWidth = doc.page.width - 100;

  doc.fontSize(styles.footer.fontSize)
     .fillColor(styles.footer.color)
     .text('Gracias por su compra en VillalbaStore', 50, footerY, { align: 'center', width: footerWidth });

  doc.end();
  return facturaPath;
}