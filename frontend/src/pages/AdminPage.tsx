import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab } from '@headlessui/react';
import { PencilIcon, TrashIcon, PlusIcon, ArrowPathIcon, ChartBarIcon, UserGroupIcon, CubeIcon } from '@heroicons/react/24/outline';
import ReporteGrafico from '../components/ReporteGrafico';
import ProductosMasVendidosGrafico from '../components/ProductosMasVendidosGrafico';
import CardStats from '../components/CardStats';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Definiciones de tipos para productos y usuarios
interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  temporada: string;
  estado: string;
  descuento: number;
  imagen?: string;
}

interface Usuario {
  id: number;
  email: string;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  rol: string;
  fecha_registro?: string;
}

export default function AdminPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    ventasHoy: 0,
    stockCritico: 0
  });
  const [loading, setLoading] = useState({
    productos: true,
    usuarios: true,
    stats: true
  });
  const [error, setError] = useState({
    productos: '',
    usuarios: '',
    stats: ''
  });
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<Usuario>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editProdId, setEditProdId] = useState<number | null>(null);
  const [editProdData, setEditProdData] = useState<Partial<Producto>>({});
  const [editProdLoading, setEditProdLoading] = useState(false);
  const [editProdError, setEditProdError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token || '';
        const [prodRes, userRes, statsRes] = await Promise.all([
          axios.get('/api/admin/productos', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/usuarios', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setProductos(prodRes.data.data ? prodRes.data.data : prodRes.data);
        setUsuarios(userRes.data);
        setStats(statsRes.data);
        setLoading({ productos: false, usuarios: false, stats: false });
        setError({ productos: '', usuarios: '', stats: '' });
      } catch (error: any) {
        setLoading({ productos: false, usuarios: false, stats: false });
        setError({
          productos: 'Error al cargar productos',
          usuarios: 'Error al cargar usuarios',
          stats: 'Error al cargar estadísticas'
        });
      }
    };
    fetchData();
  }, []);

  const refreshData = async (type: string) => {
    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      setError(prev => ({ ...prev, [type]: '' }));
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      const res = await axios.get(`/api/admin/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (type === 'productos') {
        setProductos(res.data.data ? res.data.data : res.data);
      } else if (type === 'usuarios') {
        setUsuarios(res.data);
      } else if (type === 'stats') {
        setStats(res.data);
      }
    } catch (error) {
      setError(prev => ({ ...prev, [type]: `Error al cargar ${type}` }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Log para depuración
  console.log('Render AdminPage', { productos, usuarios, stats, loading, error });

  // Fallback visual global si todo falla
  if (!localStorage.getItem('user')) {
    return <div className="p-8 text-center text-red-600 font-bold">No hay sesión activa. Por favor, inicia sesión.</div>;
  }
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.rol !== 'admin') {
    return <div className="p-8 text-center text-red-600 font-bold">Acceso denegado: solo administradores.</div>;
  }
  // Si hay un error global inesperado
  if (error.productos && error.usuarios && error.stats) {
    return <div className="p-8 text-center text-red-600 font-bold">Error crítico al cargar el panel. Revisa tu conexión o vuelve a iniciar sesión.</div>;
  }

  // Eliminar usuario
  const handleDeleteUsuario = async (id: number) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      await axios.delete(`/api/admin/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.filter(u => u.id !== id));
      toast.success('Usuario eliminado correctamente', { position: 'top-center' });
    } catch (error) {
      toast.error('Error al eliminar usuario', { position: 'top-center' });
    }
  };

  // Guardar cambios de usuario
  const handleSaveUsuario = async (id: number) => {
    setEditLoading(true);
    setEditError('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      const res = await axios.put(`/api/admin/usuarios/${id}`, editUserData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(usuarios.map(u => u.id === id ? { ...u, ...res.data } : u));
      setEditUserId(null);
      setEditUserData({});
      toast.success('Usuario actualizado correctamente', { position: 'top-center' });
    } catch (error: any) {
      setEditError('Error al actualizar usuario');
      toast.error('Error al actualizar usuario', { position: 'top-center' });
    } finally {
      setEditLoading(false);
    }
  };

  // Agregar función para eliminar productos
  const handleDeleteProducto = async (id: number) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      await axios.delete(`/api/admin/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(productos.filter(p => p.id !== id));
      toast.success('Producto eliminado correctamente', { position: 'top-center' });
    } catch (error) {
      toast.error('Error al eliminar producto', { position: 'top-center' });
    }
  };

  // Guardar cambios de producto
  const handleSaveProd = async (id: number) => {
    setEditProdLoading(true);
    setEditProdError('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      const res = await axios.put(`/api/admin/productos/${id}`, editProdData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(productos.map(p => p.id === id ? { ...p, ...res.data } : p));
      setEditProdId(null);
      setEditProdData({});
    } catch (error: any) {
      setEditProdError('Error al actualizar producto');
    } finally {
      setEditProdLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Panel de Administración</h1>
            <p className="text-gray-600">Bienvenido de nuevo</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                refreshData('productos');
                refreshData('usuarios');
                refreshData('stats');
              }}
              className="p-2 rounded-full bg-white shadow text-gray-600 hover:bg-gray-100"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <button
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow-lg ml-4 font-semibold flex items-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              onClick={() => {
                if (window.confirm('✨ ¿Seguro que quieres cerrar sesión y salir del panel de administración?\n¡Te esperamos pronto de vuelta!')) {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  navigate('/login');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l-3-3m3 3H9m6 0l3 3" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CardStats 
            title="Productos" 
            value={stats.totalProductos} 
            icon={<CubeIcon className="h-6 w-6 text-blue-500" />}
            color="blue"
            loading={loading.stats}
          />
          <CardStats 
            title="Usuarios" 
            value={stats.totalUsuarios} 
            icon={<UserGroupIcon className="h-6 w-6 text-green-500" />}
            color="green"
            loading={loading.stats}
          />
          <CardStats 
            title="Ventas Hoy" 
            value={`$${stats.ventasHoy.toLocaleString()}`} 
            icon={<ChartBarIcon className="h-6 w-6 text-purple-500" />}
            color="purple"
            loading={loading.stats}
          />
          <CardStats 
            title="Stock Crítico" 
            value={stats.stockCritico} 
            icon={<CubeIcon className="h-6 w-6 text-red-500" />}
            color="red"
            loading={loading.stats}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <Tab.Group>
            <Tab.List className="flex border-b">
              {['Productos', 'Usuarios', 'Reportes'].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    `px-4 py-3 text-sm font-medium focus:outline-none ${
                      selected 
                        ? 'border-b-2 border-blue-500 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="p-4">
              {/* Panel de Productos */}
              <Tab.Panel>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Gestión de Productos</h2>
                  <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Nuevo Producto
                  </button>
                </div>
                
                {loading.productos ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error.productos ? (
                  <div className="bg-red-100 text-red-700 p-4 rounded mb-4 flex flex-col items-center">
                    <span>{error.productos}</span>
                    <button onClick={() => refreshData('productos')} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Reintentar</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temporada</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {productos.map((prod) => (
                          <tr key={prod.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{prod.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editProdId === prod.id ? (
                                <input
                                  type="text"
                                  value={editProdData.codigo ?? prod.codigo}
                                  onChange={e => setEditProdData({ ...editProdData, codigo: e.target.value })}
                                  className="border rounded p-1 w-24"
                                />
                              ) : (
                                prod.codigo
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editProdId === prod.id ? (
                                <input
                                  type="text"
                                  value={editProdData.categoria ?? prod.categoria}
                                  onChange={e => setEditProdData({ ...editProdData, categoria: e.target.value })}
                                  className="border rounded p-1 w-24"
                                />
                              ) : (
                                prod.categoria
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editProdId === prod.id ? (
                                <input
                                  type="number"
                                  value={editProdData.precio ?? prod.precio}
                                  onChange={e => setEditProdData({ ...editProdData, precio: Number(e.target.value) })}
                                  className="border rounded p-1 w-20"
                                />
                              ) : (
                                `$${prod.precio}`
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editProdId === prod.id ? (
                                <input
                                  type="text"
                                  value={editProdData.temporada ?? prod.temporada}
                                  onChange={e => setEditProdData({ ...editProdData, temporada: e.target.value })}
                                  className="border rounded p-1 w-24"
                                />
                              ) : (
                                prod.temporada
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editProdId === prod.id ? (
                                <select
                                  value={editProdData.estado ?? prod.estado}
                                  onChange={e => setEditProdData({ ...editProdData, estado: e.target.value })}
                                  className="border rounded p-1"
                                >
                                  <option value="disponible">Disponible</option>
                                  <option value="agotado">Agotado</option>
                                </select>
                              ) : (
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prod.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {prod.estado === 'disponible' ? 'Disponible' : 'Agotado'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editProdId === prod.id ? (
                                <input
                                  type="number"
                                  value={editProdData.descuento ?? prod.descuento}
                                  onChange={e => setEditProdData({ ...editProdData, descuento: Number(e.target.value) })}
                                  className="border rounded p-1 w-16"
                                />
                              ) : (
                                prod.descuento > 0 ? (
                                  <span className="text-green-600 font-semibold">{prod.descuento}%</span>
                                ) : (
                                  <span className="text-gray-500">0%</span>
                                )
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                    onClick={() => { setEditProdId(prod.id); setEditProdData(prod); }}
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    className="text-red-600 hover:text-red-900" onClick={() => handleDeleteProducto(prod.id)}>
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
                )}
              </Tab.Panel>

              {/* Panel de Usuarios */}
              <Tab.Panel>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Gestión de Usuarios</h2>
                  <button
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    onClick={() => navigate('/admin/usuarios/nuevo')}
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Nuevo Usuario
                  </button>
                </div>
                
                {loading.usuarios ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error.usuarios ? (
                  <div className="bg-red-100 text-red-700 p-4 rounded mb-4 flex flex-col items-center">
                    <span>{error.usuarios}</span>
                    <button onClick={() => refreshData('usuarios')} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Reintentar</button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editUserId === user.id ? (
                                <input
                                  type="text"
                                  value={editUserData.nombre ?? user.nombre ?? ''}
                                  onChange={e => setEditUserData({ ...editUserData, nombre: e.target.value })}
                                  className="border rounded p-1 w-32"
                                />
                              ) : (
                                user.nombre || '-'
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editUserId === user.id ? (
                                <input
                                  type="email"
                                  value={editUserData.email ?? user.email}
                                  onChange={e => setEditUserData({ ...editUserData, email: e.target.value })}
                                  className="border rounded p-1 w-40"
                                />
                              ) : (
                                user.email
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editUserId === user.id ? (
                                <input
                                  type="text"
                                  value={editUserData.direccion ?? user.direccion ?? ''}
                                  onChange={e => setEditUserData({ ...editUserData, direccion: e.target.value })}
                                  className="border rounded p-1 w-40"
                                />
                              ) : (
                                user.direccion || '-'
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editUserId === user.id ? (
                                <input
                                  type="text"
                                  value={editUserData.telefono ?? user.telefono ?? ''}
                                  onChange={e => setEditUserData({ ...editUserData, telefono: e.target.value })}
                                  className="border rounded p-1 w-32"
                                />
                              ) : (
                                user.telefono || '-'
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editUserId === user.id ? (
                                <select
                                  value={editUserData.rol ?? user.rol}
                                  onChange={e => setEditUserData({ ...editUserData, rol: e.target.value })}
                                  className="border rounded p-1"
                                >
                                  <option value="cliente">Cliente</option>
                                  <option value="admin">Administrador</option>
                                </select>
                              ) : (
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {user.rol === 'admin' ? 'Administrador' : 'Cliente'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.fecha_registro ? new Date(user.fecha_registro).toLocaleString() : '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {editUserId === user.id ? (
                                <>
                                  <button
                                    className="text-green-600 hover:text-green-900 mr-2"
                                    onClick={() => handleSaveUsuario(user.id)}
                                    disabled={editLoading}
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    className="text-gray-600 hover:text-gray-900"
                                    onClick={() => { setEditUserId(null); setEditUserData({}); }}
                                    disabled={editLoading}
                                  >
                                    Cancelar
                                  </button>
                                  {editError && <div className="text-red-600 text-xs mt-1">{editError}</div>}
                                </>
                              ) : (
                                <>
                                  <button
                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                    onClick={() => { setEditUserId(user.id); setEditUserData(user); }}
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  {user.rol !== 'admin' && (
                                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUsuario(user.id)}>
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Tab.Panel>

              {/* Panel de Reportes */}
              <Tab.Panel>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Reportes y Estadísticas</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-3">Ventas por Temporada</h3>
                    <ReporteGrafico />
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-3">Productos Más Vendidos</h3>
                    <ProductosMasVendidosGrafico />
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
