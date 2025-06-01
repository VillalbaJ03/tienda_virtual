import { useState, useEffect } from 'react';
import axios from 'axios';

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
      setCarrito(response.data.items);
      setContador(response.data.items.reduce((sum, item) => sum + item.cantidad, 0));
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
      await fetchCarrito();
      return true;
    } catch (error) {
      console.error('Error agregando al carrito:', error);
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
    } catch (error) {
      console.error('Error eliminando del carrito:', error);
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
