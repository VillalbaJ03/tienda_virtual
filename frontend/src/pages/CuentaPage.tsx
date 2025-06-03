import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircleIcon, EnvelopeIcon, IdentificationIcon, UserIcon, AtSymbolIcon } from '@heroicons/react/24/solid';

export default function CuentaPage() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    // Si no hay nombre, intentar recargar desde el backend
    if (user && (!user.nombre || user.nombre === '' || user.nombre === 'Sin nombre')) {
      axios.get('/api/clientes/me', {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then(res => {
        if (res.data && res.data.nombre) {
          const updated = { ...user, nombre: res.data.nombre };
          localStorage.setItem('user', JSON.stringify(updated));
          setUser(updated);
        }
      }).catch(() => {});
    }
  }, []);

  // Usar el nombre real si existe, si no mostrar 'Sin nombre'
  const nombre = user?.nombre && user.nombre.trim() !== '' ? user.nombre : 'Sin nombre';
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-8 mt-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center text-4xl text-blue-600 font-bold">
          <UserCircleIcon className="h-12 w-12 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-blue-700 mb-1 flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-blue-500" /> Mi Cuenta
          </h1>
          <div className="text-gray-500 text-sm flex items-center gap-1"><IdentificationIcon className="h-4 w-4 text-gray-400" /> Panel de usuario</div>
        </div>
      </div>
      {user ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 w-24 flex items-center gap-1"><UserIcon className="h-5 w-5 text-blue-400" /> Nombre:</span>
            <span className="text-gray-900">{nombre}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 w-24 flex items-center gap-1"><AtSymbolIcon className="h-5 w-5 text-blue-400" /> Email:</span>
            <span className="text-gray-900 flex items-center gap-1"><EnvelopeIcon className="h-5 w-5 text-gray-400" /> {user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 w-24 flex items-center gap-1"><IdentificationIcon className="h-5 w-5 text-blue-400" /> Rol:</span>
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">{user.rol}</span>
          </div>
          <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} className="mt-8 w-full bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition flex items-center justify-center gap-2">
            <UserCircleIcon className="h-5 w-5 text-white" /> Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="text-gray-500">No hay sesión activa.</div>
      )}
    </div>
  );
}
