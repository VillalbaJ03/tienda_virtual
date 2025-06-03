import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductoFormPage({ isModal = false, onSuccess, onClose, producto }: { isModal?: boolean, onSuccess?: () => void, onClose?: () => void, producto?: any }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Tecnología',
    precio: '',
    stock: '',
    temporada: 'alta',
    imagenUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Si es edición, cargar datos existentes
  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo || '',
        nombre: producto.nombre || '',
        categoria: producto.categoria || 'Tecnología',
        precio: producto.precio?.toString() || '',
        stock: producto.stock?.toString() || '',
        temporada: producto.temporada || 'alta',
        imagenUrl: producto.imagenUrl || producto.imagen || '',
      });
    } else if (paramId) {
      const fetchProducto = async () => {
        try {
          setLoading(true);
          setError('');
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const token = user.token || '';
          const res = await axios.get(`/api/admin/productos/${paramId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFormData({
            codigo: res.data.codigo || '',
            nombre: res.data.nombre || '',
            categoria: res.data.categoria || 'Tecnología',
            precio: res.data.precio?.toString() || '',
            stock: res.data.stock?.toString() || '',
            temporada: res.data.temporada || 'alta',
            imagenUrl: res.data.imagenUrl || '',
          });
        } catch (err) {
          setError('No se pudo cargar el producto');
        } finally {
          setLoading(false);
        }
      };
      fetchProducto();
    }
  }, [producto, paramId]);

  // Determinar si es edición (modal o por URL)
  const isEdit = !!(producto && producto.id) || !!paramId;
  const editId = producto?.id || paramId;

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
      if (isEdit) {
        await axios.put(`/api/admin/productos/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('¡Producto actualizado exitosamente!');
      } else {
        await axios.post('/api/admin/productos', formData, {
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
          imagenUrl: '',
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-2 md:p-4 space-y-5">
      {/* El título solo se muestra si no es modal, el modal ya lo muestra */}
      {!isModal && (
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700">{isEdit ? 'Editar Producto' : 'Registro de Producto'}</h1>
      )}
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg border border-red-200 text-center font-semibold">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-lg border border-green-200 text-center font-semibold">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Código*</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nombre*</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Categoría*</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            required
          >
            <option value="Tecnología">Tecnología</option>
            <option value="Ropa">Ropa</option>
            <option value="Libros">Libros</option>
            <option value="Hogar">Hogar</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Precio* (ej: 99.99)</label>
          <input
            type="number"
            name="precio"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Stock*</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Temporada*</label>
          <select
            name="temporada"
            value={formData.temporada}
            onChange={handleChange}
            className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            required
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-gray-700">Imagen (URL)*</label>
          <input
            type="url"
            name="imagenUrl"
            value={formData.imagenUrl}
            onChange={handleChange}
            className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            placeholder="https://..."
            required
          />
          {formData.imagenUrl && (
            <img src={formData.imagenUrl} alt="Vista previa" className="mt-3 h-36 object-contain border rounded-xl mx-auto shadow" onError={e => (e.currentTarget.style.display = 'none')} />
          )}
        </div>
      </div>
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-lg font-bold shadow hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEdit ? 'Actualizar Producto' : 'Registrar Producto'}
        </button>
      </div>
    </form>
  );
}
