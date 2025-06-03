import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditarProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    temporada: '',
    estado: '',
    descuento: '',
    imagenUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token || '';
        const res = await axios.get(`/api/admin/productos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const prod = res.data.data.find((p: any) => p.id === Number(id));
        if (!prod) throw new Error('Producto no encontrado');
        setForm({
          codigo: prod.codigo || '',
          nombre: prod.nombre || '',
          categoria: prod.categoria || '',
          precio: prod.precio?.toString() || '',
          stock: prod.stock?.toString() || '',
          temporada: prod.temporada || '',
          estado: prod.estado || '',
          descuento: prod.descuento?.toString() || '',
          imagenUrl: prod.imagenUrl || ''
        });
      } catch (e) {
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      await axios.put(`/api/admin/productos/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Producto actualizado correctamente', { position: 'top-center' });
      setTimeout(() => navigate('/admin'), 1200);
    } catch (e) {
      setError('Error al guardar los cambios');
      toast.error('Error al guardar los cambios', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Código</label>
          <input name="codigo" value={form.codigo} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Categoría</label>
          <input name="categoria" value={form.categoria} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Precio</label>
          <input name="precio" type="number" value={form.precio} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Temporada</label>
          <input name="temporada" value={form.temporada} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange} className="w-full border rounded p-2">
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Descuento (%)</label>
          <input name="descuento" type="number" value={form.descuento} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Imagen (URL)*</label>
          <input name="imagenUrl" value={form.imagenUrl} onChange={handleChange} className="w-full border rounded p-2" required />
          {form.imagenUrl && (
            <img src={form.imagenUrl} alt="Vista previa" className="mt-2 h-32 object-contain border rounded" onError={e => (e.currentTarget.style.display = 'none')} />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate('/admin')} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  );
}
