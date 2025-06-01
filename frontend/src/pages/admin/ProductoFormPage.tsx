import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Tecnología',
    precio: '',
    stock: '',
    temporada: 'alta',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Si es edición, cargar datos existentes
  useEffect(() => {
    if (id) {
      const fetchProducto = async () => {
        try {
          setLoading(true);
          setError('');
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const token = user.token || '';
          const res = await axios.get(`/api/admin/productos/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFormData({
            codigo: res.data.codigo || '',
            nombre: res.data.nombre || '',
            categoria: res.data.categoria || 'Tecnología',
            precio: res.data.precio?.toString() || '',
            stock: res.data.stock?.toString() || '',
            temporada: res.data.temporada || 'alta',
          });
        } catch (err) {
          setError('No se pudo cargar el producto');
        } finally {
          setLoading(false);
        }
      };
      fetchProducto();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      const payload = {
        ...formData,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
      };
      if (id) {
        await axios.put(`/api/admin/productos/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('¡Producto actualizado exitosamente!');
      } else {
        await axios.post('/api/admin/productos', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('¡Producto creado exitosamente!');
        setFormData({
          codigo: '',
          nombre: '',
          categoria: 'Tecnología',
          precio: '',
          stock: '',
          temporada: 'alta',
        });
      }
      setTimeout(() => navigate('/admin/productos'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">{id ? 'Editar Producto' : 'Registro de Producto'}</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Código*</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Nombre*</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Categoría*</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Tecnología">Tecnología</option>
            <option value="Ropa">Ropa</option>
            <option value="Libros">Libros</option>
            <option value="Hogar">Hogar</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Precio* (ej: 99.99)</label>
          <input
            type="number"
            name="precio"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block mb-1">Stock*</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block mb-1">Temporada*</label>
          <select
            name="temporada"
            value={formData.temporada}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Guardando...' : id ? 'Actualizar Producto' : 'Registrar Producto'}
        </button>
      </form>
    </div>
  );
}
