import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    direccion: '',
    telefono: '',
    rol: 'cliente',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token || '';
        const res = await axios.get(`/api/admin/usuarios`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usuario = res.data.find((u: any) => u.id === Number(id));
        if (!usuario) throw new Error('Usuario no encontrado');
        setForm({
          nombre: usuario.nombre || '',
          email: usuario.email || '',
          direccion: usuario.direccion || '',
          telefono: usuario.telefono || '',
          rol: usuario.rol || 'cliente',
          password: ''
        });
      } catch (e) {
        setError('No se pudo cargar el usuario');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      await axios.put(`/api/admin/usuarios/${id}`, {
        ...form,
        password: form.password || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Usuario actualizado correctamente', { position: 'top-center' });
      setTimeout(() => navigate('/admin'), 1200);
    } catch (e) {
      setError('Error al guardar los cambios');
      toast.error('Error al guardar los cambios', { position: 'top-center' });
    }
  };

  if (loading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Rol</label>
          <select name="rol" value={form.rol} onChange={handleChange} className="w-full border rounded p-2">
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Contraseña (dejar en blanco para no cambiar)</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded p-2" />
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
