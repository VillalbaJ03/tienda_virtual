import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Definir el tipo Carrito e ItemCarrito para tipar correctamente el estado
interface ItemCarrito {
  id: number;
  producto: { nombre: string; precio: number; descuento?: number };
  cantidad: number;
  precio_unitario: number;
  descuento_aplicado?: number;
}

interface Carrito {
  items: ItemCarrito[];
}

export default function CheckoutPage() {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarrito = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      try {
        const response = await axios.get('/api/carrito', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCarrito(response.data);
      } catch (err) {
        setError('Error al cargar carrito');
      }
    };
    fetchCarrito();
  }, []);

  const handleCheckout = async () => {
    setError("");
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.token || '';
    try {
      const response = await axios.post('/api/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Compra realizada con éxito!', { position: 'top-center' });
      setTimeout(() => navigate(`/factura/${response.data.venta.id}`), 1500);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al procesar pago');
        toast.error(err.response?.data?.error || 'Error al procesar pago', { position: 'top-center' });
      } else {
        setError('Error desconocido al procesar pago');
        toast.error('Error desconocido al procesar pago', { position: 'top-center' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!carrito) return <div>Cargando...</div>;
  if (carrito.items.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Finalizar Compra</h1>
        <div className="bg-yellow-100 text-yellow-700 p-2 mb-4 rounded">Tu carrito está vacío.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Finalizar Compra</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Resumen de tu pedido</h2>
        {carrito.items.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <span>
              {item.producto.nombre} x {item.cantidad}
              {item.producto.descuento && item.producto.descuento > 0 && (
                <span className="text-green-600 ml-2">
                  ({item.producto.descuento}% desc.)
                </span>
              )}
            </span>
            <span>
              ${((item.precio_unitario || item.producto.precio) * item.cantidad * (1 - (item.producto.descuento || 0)/100)).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="mt-4 pt-2 border-t">
          <div className="flex justify-between font-semibold">
            <span>Subtotal:</span>
            <span>${carrito.items.reduce((sum, item) => 
              sum + ((item.precio_unitario || item.producto.precio) * item.cantidad * (1 - (item.producto.descuento || 0)/100)), 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos (16%):</span>
            <span>${(carrito.items.reduce((sum, item) => 
              sum + ((item.precio_unitario || item.producto.precio) * item.cantidad * (1 - (item.producto.descuento || 0)/100)), 0) * 0.16).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2">
            <span>Total:</span>
            <span>${(carrito.items.reduce((sum, item) => 
              sum + ((item.precio_unitario || item.producto.precio) * item.cantidad * (1 - (item.producto.descuento || 0)/100)), 0) * 1.16).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading || carrito.items.length === 0}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Procesando...' : 'Confirmar Compra'}
      </button>
    </div>
  );
}
