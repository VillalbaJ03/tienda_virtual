import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CrearUsuarioPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      await axios.post('/api/admin/usuarios', { email, password, rol, direccion, telefono }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Usuario creado correctamente', { position: 'top-center' });
      setTimeout(() => navigate('/admin/usuarios'), 1200);
    } catch (error) {
      toast.error('Error al crear usuario', { position: 'top-center' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label>Rol:</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
