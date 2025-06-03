import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function useCarrito() {
  const [carrito, setCarrito] = useState([]);
  const [contador, setContador] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = user && user.token ? user.token : '';
    if (token) {
      fetchCarrito();
    }
  }, []);

  const fetchCarrito = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user && user.token ? user.token : '';
      const response = await axios.get('/api/carrito', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = Array.isArray(response.data.items) ? response.data.items : [];
      setCarrito(items);
      setContador(items.reduce((sum, item) => sum + item.cantidad, 0));
    } catch (error) {
      console.error('Error fetching carrito:', error);
    }
  };

  const agregarAlCarrito = async (productoId, cantidad = 1) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user && user.token ? user.token : '';
      await axios.post('/api/carrito/items', 
        { productoId, cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Producto agregado al carrito', { position: 'top-center' });
      await fetchCarrito();
      return true;
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      toast.error('Error al agregar al carrito', { position: 'top-center' });
      throw error;
    }
  };

  const actualizarCantidad = async (itemId, nuevaCantidad) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user && user.token ? user.token : '';
      await axios.put(`/api/carrito/items/${itemId}`, 
        { cantidad: nuevaCantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCarrito();
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
    }
  };

  const eliminarDelCarrito = async (itemId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = user && user.token ? user.token : '';
      await axios.delete(`/api/carrito/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCarrito();
      toast.success('Producto eliminado del carrito', { position: 'top-center' });
    } catch (error) {
      console.error('Error eliminando del carrito:', error);
      toast.error('Error al eliminar del carrito', { position: 'top-center' });
    }
  };

  return {
    carrito,
    contador,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    fetchCarrito
  };
}
