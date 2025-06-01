import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

// Definir el tipo Producto para tipar correctamente el estado
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export default function ProductosAdminPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    last_page: 1,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [editProdId, setEditProdId] = useState<number | null>(null);
  const [editProdData, setEditProdData] = useState<Partial<Producto>>({});
  const [editProdLoading, setEditProdLoading] = useState(false);
  const [editProdError, setEditProdError] = useState('');
  const navigate = useNavigate();

  const fetchProductos = async (page = 1) => {
    setLoading(true);
    try {
      // Obtener token de localStorage de forma segura
      let token = '';
      try {
        const user = localStorage.getItem('user');
        token = user ? JSON.parse(user).token : '';
      } catch {
        token = '';
      }
      const res = await axios.get(`/api/admin/productos?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(res.data.data);
      setPagination({
        page: res.data.meta.page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total
      });
    } catch (error) {
      console.error('Error fetching productos', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      // Obtener token de localStorage de forma segura
      let token = '';
      try {
        const user = localStorage.getItem('user');
        token = user ? JSON.parse(user).token : '';
      } catch {
        token = '';
      }
      await axios.delete(`/api/admin/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductos(pagination.page);
    } catch (error) {
      console.error('Error deleting producto', error);
    }
  };

  const handleSaveProd = async (id: number) => {
    setEditProdLoading(true);
    setEditProdError('');
    try {
      let token = '';
      try {
        const user = localStorage.getItem('user');
        token = user ? JSON.parse(user).token : '';
      } catch {
        token = '';
      }
      const res = await axios.put(`/api/admin/productos/${id}`, editProdData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(productos.map(p => p.id === id ? { ...p, ...res.data } : p));
      setEditProdId(null);
      setEditProdData({});
    } catch (error) {
      setEditProdError('Error al actualizar producto');
    } finally {
      setEditProdLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administrar Productos</h1>
        <button
          onClick={() => navigate('/admin/productos/nuevo')}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Nuevo Producto
        </button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Precio</th>
                  <th className="px-6 py-3 text-left">Stock</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td className="px-6 py-4">
                      {editProdId === prod.id ? (
                        <input
                          type="text"
                          value={editProdData.nombre ?? prod.nombre}
                          onChange={e => setEditProdData({ ...editProdData, nombre: e.target.value })}
                          className="border rounded p-1 w-32"
                        />
                      ) : (
                        prod.nombre
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editProdId === prod.id ? (
                        <input
                          type="number"
                          value={editProdData.precio ?? prod.precio}
                          onChange={e => setEditProdData({ ...editProdData, precio: Number(e.target.value) })}
                          className="border rounded p-1 w-24"
                        />
                      ) : (
                        `$${prod.precio}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editProdId === prod.id ? (
                        <input
                          type="number"
                          value={editProdData.stock ?? prod.stock}
                          onChange={e => setEditProdData({ ...editProdData, stock: Number(e.target.value) })}
                          className="border rounded p-1 w-20"
                        />
                      ) : (
                        prod.stock
                      )}
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      {editProdId === prod.id ? (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900 mr-2"
                            onClick={() => handleSaveProd(prod.id)}
                            disabled={editProdLoading}
                          >
                            Guardar
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => { setEditProdId(null); setEditProdData({}); }}
                            disabled={editProdLoading}
                          >
                            Cancelar
                          </button>
                          {editProdError && <div className="text-red-600 text-xs mt-1">{editProdError}</div>}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditProdId(prod.id); setEditProdData(prod); }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => fetchProductos(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {pagination.page} de {pagination.last_page}
            </span>
            <button
              onClick={() => fetchProductos(pagination.page + 1)}
              disabled={pagination.page === pagination.last_page}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
