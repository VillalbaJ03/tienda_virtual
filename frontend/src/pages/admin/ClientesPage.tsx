import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Definir el tipo Cliente para tipar correctamente el estado
interface Cliente {
  id: number;
  email: string;
  direccion?: string;
  telefono?: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ direccion: string; telefono: string }>({
    direccion: '',
    telefono: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      const res = await axios.get('/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(res.data);
    };
    fetchClientes();
  }, []);

  const handleUpdate = async (id: number) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token || '';
      await axios.put(`/api/clientes/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      // Refrescar lista
      const res = await axios.get('/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(res.data);
      toast.success('Cliente actualizado correctamente', { position: 'top-center' });
    } catch (error) {
      console.error('Error actualizando cliente', error);
      toast.error('Error al actualizar cliente', { position: 'top-center' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <Link to="/admin/usuarios/nuevo" className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Nuevo Usuario
        </Link>
      </div>
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Dirección</th>
            <th className="py-2 px-4">Teléfono</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id} className="border-t">
              <td className="py-2 px-4">{cliente.email}</td>
              <td className="py-2 px-4">
                {editingId === cliente.id ? (
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="border p-1 w-full"
                  />
                ) : (
                  cliente.direccion || 'No especificada'
                )}
              </td>
              <td className="py-2 px-4">
                {editingId === cliente.id ? (
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="border p-1 w-full"
                  />
                ) : (
                  cliente.telefono || 'No especificado'
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  onClick={() => navigate(`/admin/usuarios/editar/${cliente.id}`)}
                >
                  Editar
                </button>
                {editingId === cliente.id ? (
                  <button 
                    onClick={() => handleUpdate(cliente.id)}
                    className="text-green-600"
                  >
                    Guardar
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
