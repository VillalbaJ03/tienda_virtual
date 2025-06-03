import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UsuarioFormPage({ isModal = false, onSuccess, onClose, usuario }: { isModal?: boolean, onSuccess?: () => void, onClose?: () => void, usuario?: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si es edición, inicializar campos
  useEffect(() => {
    if (usuario) {
      setEmail(usuario.email || '');
      setRol(usuario.rol || 'cliente');
      setDireccion(usuario.direccion || '');
      setTelefono(usuario.telefono || '');
      setNombre(usuario.nombre || '');
      setPassword(''); // nunca mostrar password
    } else {
      setEmail(''); setRol('cliente'); setDireccion(''); setTelefono(''); setNombre(''); setPassword('');
    }
  }, [usuario]);

  const isEdit = !!usuario;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      if (isEdit) {
        // PUT solo envía password si no está vacío
        const payload: any = { email, rol, direccion, telefono, nombre };
        if (password) payload.password = password;
        await axios.put(`/api/admin/usuarios/${usuario.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Usuario actualizado correctamente', { position: 'top-center' });
      } else {
        await axios.post('/api/admin/usuarios', { email, password, rol, direccion, telefono, nombre }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Usuario creado correctamente', { position: 'top-center' });
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      setEmail(''); setPassword(''); setRol('cliente'); setDireccion(''); setTelefono(''); setNombre('');
    } catch (err: any) {
      setError(err.response?.data?.error || (isEdit ? 'Error al actualizar usuario' : 'Error al crear usuario'));
      toast.error(err.response?.data?.error || (isEdit ? 'Error al actualizar usuario' : 'Error al crear usuario'), { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-2 md:p-4 space-y-5">
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg border border-red-200 text-center font-semibold">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nombre*</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Email*</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">{isEdit ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña*'}</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" required={!isEdit} />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Rol*</label>
          <select value={rol} onChange={e => setRol(e.target.value)} className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg">
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-gray-700">Dirección</label>
          <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-gray-700">Teléfono</label>
          <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" />
        </div>
      </div>
      <div className="pt-4">
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-lg font-bold shadow hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-60" disabled={loading}>
          {loading ? 'Guardando...' : isEdit ? 'Actualizar Usuario' : 'Registrar Usuario'}
        </button>
      </div>
    </form>
  );
}
