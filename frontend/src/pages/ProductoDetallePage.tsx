import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { agregarAlCarrito } = {} as any;

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/productos/${id}`);
        // Forzar conversión de precio y descuento a número
        const prod = res.data;
        prod.precio = Number(prod.precio);
        prod.descuento = Number(prod.descuento);
        setProducto(prod);
      } catch (err) {
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleAgregar = async () => {
    try {
      await agregarAlCarrito(producto.id, 1);
      toast.success('Producto agregado al carrito');
    } catch (err) {
      toast.error('Error al agregar al carrito');
    }
  };

  if (loading) return <div className="text-center py-12">Cargando producto...</div>;
  if (!producto) return <div className="text-center py-12 text-red-500">Producto no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow p-8">
      <div>
        <img src={producto.imagenUrl || '/placeholder-product.jpg'} alt={producto.nombre} className="w-full h-80 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
      </div>
      <div>
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold transition">
            ← Volver
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
        <div className="mb-4 flex flex-wrap gap-3 items-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
            Categoría: {producto.categoria}
          </span>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
            Stock: {producto.stock}
          </span>
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold">
            Temporada: {producto.temporada}
          </span>
          <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${producto.estado === 'disponible' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>Estado: {producto.estado}</span>
        </div>
        <div className="mb-4">
          {producto.descuento > 0 ? (
            <>
              <span className="text-2xl font-bold text-red-600">${(producto.precio * (1 - producto.descuento / 100)).toFixed(2)}</span>
              <span className="ml-2 text-lg text-gray-500 line-through">${producto.precio.toFixed(2)}</span>
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{producto.descuento}% OFF</span>
            </>
          ) : (
            <span className="text-2xl font-bold">${producto.precio?.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
