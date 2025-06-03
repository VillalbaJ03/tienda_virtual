import { AppDataSource } from '../config/data-source';

async function limpiarHistorial() {
  await AppDataSource.initialize();
  // 1. Eliminar primero los items de carritos completados
  await AppDataSource.query(`DELETE FROM carrito_items WHERE carrito_id IN (SELECT id FROM carritos WHERE estado = 'completado')`);
  // 2. Eliminar carritos completados
  await AppDataSource.query("DELETE FROM carritos WHERE estado = 'completado'");
  // 3. Eliminar ventas
  await AppDataSource.query('DELETE FROM ventas');
  console.log('Historial de compras limpiado correctamente.');
  process.exit(0);
}

limpiarHistorial();
