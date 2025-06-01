import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function HistorialPage() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const token = user && user.token ? user.token : '';
        const response = await axios.get('/api/ventas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompras(response.data);
      } catch (error) {
        setCompras([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Cargando historial...</div>;
  }

  if (compras.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">No hay compras registradas</h1>
        <Link to="/productos" className="text-blue-500 hover:text-blue-700">Ir a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis Compras</h1>
      <div className="space-y-6">
        {compras.map((compra) => (
          <div key={compra.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Compra #{compra.id}</h2>
                <p className="text-sm text-gray-500">{new Date(compra.fecha).toLocaleDateString()} - Total: ${compra.total?.toFixed(2) ?? '-'}</p>
              </div>
              <div className="flex space-x-2">
                <Link to={`/factura/${compra.id}`} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Ver factura</Link>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-2">Productos:</h3>
              <ul className="space-y-2">
                {compra.items?.map((item: any) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.producto.nombre} x {item.cantidad}</span>
                    <span>${(item.producto.precio * item.cantidad * (1 - (item.descuentoAplicado || 0) / 100)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
