import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  ArrowTopRightOnSquareIcon,
  ShoppingBagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
// Spinner simple en línea para mostrar carga
function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Cargando"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function HistorialPage() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoading(true);
        setError('');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const token = user?.token || '';
        const response = await axios.get('/api/ventas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Adaptar estructura: obtener productos, dirección y seguimiento desde carrito
        const comprasAdaptadas = (response.data || []).map((venta: any) => {
          const carrito = venta.carrito || {};
          return {
            ...venta,
            items: (carrito.items || []).map((item: any) => ({
              ...item,
              producto: item.producto || {},
              descuentoAplicado: item.producto?.descuento || 0,
              precio: item.producto?.precio || 0,
              imagen: item.producto?.imagenUrl || item.producto?.imagen || '',
              nombre: item.producto?.nombre || '',
            })),
            direccionEnvio: carrito.cliente?.direccion || carrito.cliente?.direccionEnvio || '',
            numeroSeguimiento: carrito.numeroSeguimiento || '',
            metodoPago: venta.metodoPago || 'Tarjeta de crédito',
          };
        });
        // Ordenar por fecha
        const sortedCompras = comprasAdaptadas.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setCompras(sortedCompras);
      } catch (err: any) {
        console.error('Error fetching purchases:', err);
        // Si el backend devuelve un mensaje específico, mostrarlo
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('No pudimos cargar tu historial de compras. Por favor intenta nuevamente.');
        }
        setCompras([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompras();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
            Completado
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            Pendiente
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-3.5 w-3.5 mr-1" />
            Cancelado
          </span>
        );
      case 'enviado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <TruckIcon className="h-3.5 w-3.5 mr-1" />
            Enviado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            Procesando
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner className="h-12 w-12 text-indigo-600" />
        <p className="mt-4 text-gray-600">Cargando tu historial de compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <ShoppingBagIcon className="h-full w-full" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Aún no tienes compras</h1>
        <p className="mt-2 text-gray-600">
          Cuando realices tu primera compra en VillalbaStore, aparecerá aquí junto con todos los detalles.
        </p>
        <div className="mt-6">
          <Link
            to="/productos"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Compras</h1>
        <p className="mt-2 text-gray-600">
          Revisa el estado de tus pedidos y accede a tus facturas
        </p>
      </div>

      <div className="space-y-8">
        {compras.map((compra) => (
          <div key={compra.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition hover:shadow-2xl">
            {/* Encabezado de la compra */}
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-xl shadow-sm">
                  <ShoppingBagIcon className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Orden #{compra.id}
                  </h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(compra.fecha).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    {getStatusBadge(compra.estado)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center text-xl font-extrabold text-blue-700">
                  <CurrencyDollarIcon className="h-5 w-5 mr-1 text-blue-500" />
                  ${Number(compra.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
                <Link 
                  to={`/factura/${compra.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                  Ver factura
                </Link>
              </div>
            </div>

            {/* Detalle de productos */}
            <div className="px-6 py-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Productos adquiridos</h3>
              <ul className="space-y-5">
                {compra.items?.map((item: any) => (
                  <li key={item.id} className="flex justify-between items-center gap-4 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 border-indigo-100 shadow-sm bg-white">
                        <img
                          src={item.producto.imagenUrl || item.producto.imagen || '/placeholder-product.jpg'}
                          alt={item.producto.nombre}
                          className="h-full w-full object-cover object-center transition-transform duration-200 hover:scale-105"
                          onError={e => (e.currentTarget.src = '/placeholder-product.jpg')}
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 mb-1">{item.producto.nombre}</h4>
                        <p className="text-sm text-gray-500">
                          Cantidad: <span className="font-semibold text-gray-700">{item.cantidad}</span>
                          {item.descuentoAplicado > 0 && (
                            <span className="ml-2 inline-flex items-center text-green-600 font-semibold">
                              <ReceiptPercentIcon className="h-4 w-4 mr-1" />
                              {item.descuentoAplicado}% desc.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right min-w-[90px]">
                      <p className="text-base font-bold text-blue-700">
                        ${(item.producto.precio * item.cantidad * (1 - (item.descuentoAplicado || 0) / 100)).toFixed(2)}
                      </p>
                      {item.producto.precioOriginal && item.producto.precioOriginal > item.producto.precio && (
                        <p className="text-xs text-gray-400 line-through">
                          ${(item.producto.precioOriginal * item.cantidad).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Información adicional */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Método de pago</h4>
                <p className="text-sm text-gray-900 font-medium">
                  {compra.metodoPago || 'Tarjeta de crédito'}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dirección de envío</h4>
                <p className="text-sm text-gray-900 font-medium">
                  {compra.direccionEnvio || 'No especificada'}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">N° de seguimiento</h4>
                <p className="text-sm text-gray-900 font-medium">
                  {compra.numeroSeguimiento || 'No disponible'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
