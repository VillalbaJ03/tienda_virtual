import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductosPage />} />
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
        <Route path="*" element={<HomePage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </Layout>
  );
}

export default App;
