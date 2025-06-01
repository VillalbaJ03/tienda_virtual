import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navegación */}
      <header className="bg-white shadow sticky top-0 z-40">
        <nav className="container mx-auto flex items-center justify-between py-4 px-4">
          <Link to="/" className="text-2xl font-bold text-blue-700">Tienda Virtual</Link>
          <div className="flex items-center gap-6">
            <Link to="/productos" className={location.pathname.startsWith('/productos') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}>Productos</Link>
            {user && <Link to="/historial" className={location.pathname.startsWith('/historial') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}>Mis Compras</Link>}
            <Link to="/carrito" className="relative group">
              <ShoppingCartIcon className="h-6 w-6 inline-block" />
            </Link>
            {user ? (
              <Link to="/cuenta" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                <UserCircleIcon className="h-6 w-6" />
                <span className="hidden md:inline">Cuenta</span>
              </Link>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Iniciar sesión</Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} Tienda Virtual. Todos los derechos reservados.
      </footer>
    </div>
  );
}
