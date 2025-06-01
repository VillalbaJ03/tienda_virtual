import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Carrito() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const response = await axios.get('/api/carritos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setItems(response.data.items);
      } catch (error) {
        console.error('Error al obtener carrito', error);
      }
    };
    fetchCarrito();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>
      {items.map((item: any) => (
        <div key={item.id} className="border p-4 mb-2">
          <h3>{item.producto.nombre}</h3>
          <p>Cantidad: {item.cantidad}</p>
          <p>Precio: ${item.precio_unitario * item.cantidad * (1 - item.descuento_aplicado/100)}</p>
        </div>
      ))}
    </div>
  );
}
