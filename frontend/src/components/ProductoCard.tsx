import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

import useCarrito from '../hooks/useCarrito';

const categoriaIconos: Record<string, React.ReactNode> = {
  'Tecnología': <span className="inline-block mr-1 align-middle">💻</span>,
  'Ropa': <span className="inline-block mr-1 align-middle">👕</span>,
  'Libros': <span className="inline-block mr-1 align-middle">📚</span>,
  'Hogar': <span className="inline-block mr-1 align-middle">🏠</span>,
};

export default function ProductoCard({ producto }: { producto: any }) {
  const { agregarAlCarrito } = useCarrito();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const precio = Number(producto.precio) || 0;
  const descuento = Number(producto.descuento) || 0;
  const precioConDescuento = precio * (1 - (descuento / 100));
  const stock = Number(producto.stock) || 0;
  let stockMsg = '';
  let stockColor = '';
  if (stock === 0) {
    stockMsg = 'Agotado';
    stockColor = 'text-red-600';
  } else if (stock <= 5) {
    stockMsg = `Últimas ${stock} unidades`;
    stockColor = 'text-yellow-600';
  } else {
    stockMsg = `En stock: ${stock} unidades`;
    stockColor = 'text-green-600';
  }

  const handleAgregarAlCarrito = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = user && user.token ? user.token : '';
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const success = await agregarAlCarrito(producto.id);
      if (success) toast.success('Producto agregado al carrito');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al agregar al carrito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={producto.imagenUrl || '/placeholder-product.jpg'}
          alt={producto.nombre}
          className="h-40 w-auto object-contain mx-auto"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          {categoriaIconos[producto.categoria] || null}
          <span className="text-xs text-gray-500 font-medium">{producto.categoria}</span>
        </div>
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{producto.nombre}</h3>
        <div className="flex items-end gap-2 mb-2">
          {descuento > 0 ? (
            <>
              <span className="text-xl font-bold text-red-600">${precioConDescuento.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">${precio.toFixed(2)}</span>
              <span className="ml-1 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{descuento}% OFF</span>
            </>
          ) : (
            <span className="text-xl font-bold">${precio.toFixed(2)}</span>
          )}
        </div>
        <div className={`mb-2 text-sm font-medium ${stockColor}`}>{stockMsg}</div>
        <Link
          to={`/producto/${producto.id}`}
          className="inline-block text-blue-500 hover:text-blue-700 text-sm mb-2"
        >
          Ver detalles
        </Link>
        <button
          onClick={handleAgregarAlCarrito}
          disabled={stock === 0 || loading}
          className={`w-full py-2 rounded-md mt-auto font-semibold transition-all ${
            stock === 0
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : loading
                ? 'bg-blue-300 cursor-wait text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Agregando...' : stock === 0 ? 'Agotado' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
}
