import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductosPage from './pages/ProductosPage';
import ProductoDetallePage from './pages/ProductoDetallePage';
import CarritoPage from './pages/CarritoPage';
import CheckoutPage from './pages/CheckoutPage';
import HistorialPage from './pages/HistorialPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import CuentaPage from './pages/CuentaPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import FacturaPage from './pages/FacturaPage';
import ProductoFormPage from './pages/admin/ProductoFormPage';
import ContactoPage from './pages/ContactoPage';
import PreguntasPage from './pages/PreguntasPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/ofertas" element={<ProductosPage ofertasOnly={true} />} />
        <Route path="/producto/:id" element={<ProductoDetallePage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/cuenta" element={<CuentaPage />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/factura/:id" element={<FacturaPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/preguntas" element={<PreguntasPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Layout>
  );
}

export default App;
