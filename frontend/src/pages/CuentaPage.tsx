import React from 'react';

export default function CuentaPage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-4">Mi Cuenta</h1>
      {user ? (
        <>
          <div className="mb-2"><span className="font-semibold">Nombre:</span> {user.nombre || '-'}</div>
          <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
          <div className="mb-2"><span className="font-semibold">Rol:</span> {user.rol}</div>
          <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cerrar sesión</button>
        </>
      ) : (
        <div className="text-gray-500">No hay sesión activa.</div>
      )}
    </div>
  );
}
