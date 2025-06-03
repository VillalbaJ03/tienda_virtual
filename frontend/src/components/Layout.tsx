import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  UserCircleIcon, 
  HomeIcon, 
  ListBulletIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  TrophyIcon,
  HeartIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/solid';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && user.rol === 'admin';
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const confirmAndLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Premium */}
      <div className="bg-gray-900 text-white text-xs py-1 px-4 text-center">
        Envíos gratis en compras superiores a $100.000 | 3 cuotas sin interés
      </div>

      {!isAdmin ? (
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo y marca */}
              <Link 
                to="/" 
                className="flex items-center group"
              >
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-2 rounded-lg mr-3 group-hover:rotate-6 transition-transform">
                  <TrophyIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">
                  <span className="text-amber-600">Villalba</span>Store
                </span>
              </Link>

              {/* Navegación principal */}
              <div className="hidden lg:flex items-center space-x-1 ml-10">
                <Link 
                  to="/productos" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                    location.pathname.startsWith('/productos') 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5 mr-2" />
                  Catálogo
                </Link>
                
                <Link 
                  to="/ofertas" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                    location.pathname.startsWith('/ofertas') 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <span className="relative">
                    <HeartIcon className="h-5 w-5 mr-2" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      !
                    </span>
                  </span>
                  Ofertas
                </Link>

                {user && (
                  <Link 
                    to="/historial" 
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                      location.pathname.startsWith('/historial') 
                        ? 'text-amber-600 bg-amber-50' 
                        : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    <ListBulletIcon className="h-5 w-5 mr-2" />
                    Mis Pedidos
                  </Link>
                )}
              </div>

              {/* Acciones de usuario */}
              <div className="flex items-center space-x-3">
                <Link 
                  to="/carrito" 
                  className="relative p-2 rounded-full text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Link>

                {user ? (
                  <div className="relative group ml-2">
                    <button className="flex items-center space-x-1 text-sm rounded-full focus:outline-none">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-medium">
                        {user.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:inline text-gray-700">{user.nombre.split(' ')[0]}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                      <Link 
                        to="/cuenta" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 flex items-center border-b border-gray-100"
                      >
                        <UserCircleIcon className="h-4 w-4 mr-3 text-amber-600" />
                        Mi cuenta
                      </Link>
                      <button
                        onClick={confirmAndLogout}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 flex items-center"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-amber-600" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link 
                      to="/login" 
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors hidden sm:block"
                    >
                      Ingresar
                    </Link>
                    <Link 
                      to="/registro" 
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      ) : (
        <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link 
                  to="/admin" 
                  className="flex items-center text-xl font-bold text-white"
                >
                  <div className="bg-amber-600 p-1 rounded mr-3">
                    <Cog6ToothIcon className="h-5 w-5 text-white" />
                  </div>
                  VillalbaStore Admin
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {/* Enlace a Dashboard oculto para admin */}
                {/*
                <Link 
                  to="/admin/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    location.pathname === '/admin/dashboard'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                */}
                <button
                  onClick={confirmAndLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Salir
                </button>
              </div>
            </div>
          </nav>
        </header>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer Premium */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <TrophyIcon className="h-5 w-5 mr-2 text-amber-400" />
                VillalbaStore
              </h3>
              <p className="text-gray-400 text-sm">
                La mejor selección de productos con calidad Villalba. Desde 2023 brindando la mejor experiencia de compra.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Comprar</h4>
              <ul className="space-y-2">
                <li><Link to="/productos" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Productos</Link></li>
                <li><Link to="/ofertas" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Ofertas</Link></li>
                <li><Link to="/nuevos" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Nuevos ingresos</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Ayuda</h4>
              <ul className="space-y-2">
                <li><Link to="/contacto" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Contacto</Link></li>
                <li><Link to="/preguntas" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Preguntas frecuentes</Link></li>
                <li><Link to="/envios" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Envíos y devoluciones</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terminos" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Términos y condiciones</Link></li>
                <li><Link to="/privacidad" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Política de privacidad</Link></li>
                <li><Link to="/garantias" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Garantías</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} VillalbaStore. Todos los derechos reservados.
            </div>
            <div className="flex space-x-4">
              <Link to="/preguntas" className="text-gray-400 hover:text-amber-400 transition-colors">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </Link>
              {/* Aquí podrías añadir íconos de redes sociales */}
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de confirmación de cierre de sesión */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <svg className="h-12 w-12 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <h2 className="text-lg font-bold mb-2 text-gray-800">¿Cerrar sesión?</h2>
            <p className="text-gray-600 mb-6 text-center">¿Está seguro que desea cerrar sesión?</p>
            <div className="flex gap-4 w-full">
              <button onClick={handleCancelLogout} className="flex-1 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition">Cancelar</button>
              <button onClick={handleConfirmLogout} className="flex-1 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition">Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}