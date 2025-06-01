import React, { useEffect, useState } from 'react';
import useCarrito from '../hooks/useCarrito';
import { useNavigate } from 'react-router-dom';

export default function CarritoPage() {
  // Tipar carrito como any[] para evitar errores de tipo
  const { carrito, eliminarDelCarrito, actualizarCantidad } = useCarrito() as { carrito: any[], eliminarDelCarrito: any, actualizarCantidad: any };
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      return total + (Number(item.producto.precio) * item.cantidad * (1 - (Number(item.descuentoAplicado) || 0) / 100));
    }, 0);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight">🛒 Tu Carrito</h1>
      {carrito.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <img src="/empty-cart.svg" alt="Carrito vacío" className="w-32 h-32 mb-6 opacity-70" />
          <p className="text-lg text-gray-500 mb-4">¡Tu carrito está vacío!</p>
          <button
            onClick={() => navigate('/productos')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ir a la tienda
          </button>
        </div>
      ) : (
        <React.Fragment>
          <div className="space-y-4 mb-8">
            {carrito.map((item: any) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-xl shadow p-4 border border-gray-100">
                <img src={item.producto?.imagenUrl || '/placeholder-product.jpg'} alt={item.producto?.nombre || 'Producto'} className="h-24 w-24 rounded-lg object-cover border" />
                <div className="flex-1 w-full">
                  <h3 className="font-semibold text-lg mb-1">{item.producto?.nombre || 'Producto'}</h3>
                  <p className="text-sm text-gray-600 mb-1">{item.cantidad} x ${Number(item.producto?.precio || 0).toFixed(2)} {item.descuentoAplicado > 0 && (<span className="ml-1 text-xs text-green-500">({item.descuentoAplicado}% OFF)</span>)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1} className="px-3 py-1 bg-gray-200 rounded text-lg font-bold">-</button>
                    <span className="font-semibold text-lg">{item.cantidad}</span>
                    <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} className="px-3 py-1 bg-gray-200 rounded text-lg font-bold">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[100px]">
                  <span className="font-bold text-blue-700 text-lg">${(Number(item.producto?.precio || 0) * item.cantidad * (1 - (Number(item.descuentoAplicado) || 0) / 100)).toFixed(2)}</span>
                  <button onClick={() => eliminarDelCarrito(item.id)} className="text-red-500 hover:text-red-700 text-xs mt-2">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t pt-6 mt-6">
            <span className="font-semibold text-xl">Total:</span>
            <span className="text-3xl font-extrabold text-blue-700">${calcularTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-end mt-8">
            <button onClick={() => navigate('/checkout')} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow hover:bg-green-700 transition">Finalizar compra</button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
