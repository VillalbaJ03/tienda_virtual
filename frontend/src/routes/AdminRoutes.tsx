import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ProductosAdminPage from '../pages/admin/ProductosAdminPage';
import ProductoFormPage from '../pages/admin/ProductoFormPage';
import EditarProductoPage from '../pages/admin/EditarProductoPage';
import EditarUsuarioPage from '../pages/admin/EditarUsuarioPage';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/productos" element={
        <ProtectedRoute requiredRole="admin">
          <ProductosAdminPage />
        </ProtectedRoute>
      } />
      <Route path="/productos/nuevo" element={
        <ProtectedRoute requiredRole="admin">
          <ProductoFormPage />
        </ProtectedRoute>
      } />
      <Route path="/productos/editar/:id" element={
        <ProtectedRoute requiredRole="admin">
          <EditarProductoPage />
        </ProtectedRoute>
      } />
      <Route path="/usuarios/editar/:id" element={
        <ProtectedRoute requiredRole="admin">
          <EditarUsuarioPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
