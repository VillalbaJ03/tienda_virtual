import React, { useState } from 'react';

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">¡Gracias por contactarnos!</h1>
        <p className="text-gray-600">Tu mensaje fue enviado correctamente. Pronto nos pondremos en contacto contigo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Contacto</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow p-8 border border-gray-100">
        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
        <div>
          <label className="block font-semibold mb-1">Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Mensaje</label>
          <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={5} className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">Enviar mensaje</button>
      </form>
    </div>
  );
}
