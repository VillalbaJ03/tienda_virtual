import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import useCarrito from '../hooks/useCarrito';

export default function ProductoDetallePage() {
  const { id } = useParams();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/productos/${id}`);
        setProducto(res.data);
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
      await agregarAlCarrito(producto.id, cantidad);
      toast.success('Producto agregado al carrito');
      navigate('/carrito');
    } catch (err) {
      toast.error('Error al agregar al carrito');
    }
  };

  if (loading) return <div className="text-center py-12">Cargando producto...</div>;
  if (!producto) return <div className="text-center py-12 text-red-500">Producto no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow p-8">
      <div>
        <img src={producto.imagenUrl || '/placeholder-product.jpg'} alt={producto.nombre} className="w-full h-80 object-cover rounded-lg" />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
        <p className="text-gray-600 mb-4">{producto.descripcion}</p>
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
        <div className="mb-4">
          <span className="font-semibold">Stock:</span> {producto.stock}
        </div>
        <div className="flex items-center gap-2 mb-6">
          <label className="font-semibold">Cantidad:</label>
          <input type="number" min={1} max={producto.stock} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} className="w-20 border rounded p-2" />
        </div>
        <button onClick={handleAgregar} disabled={producto.stock === 0} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400">
          {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
