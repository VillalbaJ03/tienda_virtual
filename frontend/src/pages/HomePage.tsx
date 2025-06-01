import React from 'react';

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero principal */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 rounded-3xl shadow-2xl mb-14 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">Bienvenido a la Tienda Virtual</h1>
          <p className="text-2xl mb-10 font-light">Descubre los mejores productos, ofertas y novedades. ¡Compra fácil, rápido y seguro!</p>
          <a href="/productos" className="inline-block bg-yellow-400 text-gray-900 font-bold px-10 py-4 rounded-xl hover:bg-yellow-300 transition text-xl shadow-lg">Ver productos</a>
        </div>
        {/* Ilustración decorativa */}
        <div className="absolute right-0 bottom-0 w-1/2 opacity-20 pointer-events-none select-none hidden md:block">
          <img src="/hero-shop.svg" alt="Hero" className="w-full h-auto" />
        </div>
      </section>
      {/* Beneficios */}
      <section className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">¿Por qué comprar con nosotros?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600">
            <h3 className="font-semibold text-blue-700 mb-3 text-xl">Envíos rápidos</h3>
            <p className="text-gray-600">Recibe tus productos en tiempo récord a todo el país.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-yellow-400">
            <h3 className="font-semibold text-yellow-500 mb-3 text-xl">Pagos seguros</h3>
            <p className="text-gray-600">Tus datos y transacciones están protegidos con tecnología de punta.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-500">
            <h3 className="font-semibold text-green-600 mb-3 text-xl">Atención personalizada</h3>
            <p className="text-gray-600">Soporte y ayuda en cada paso de tu compra.</p>
          </div>
        </div>
      </section>
      {/* Banner de suscripción */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 rounded-3xl mt-20 shadow-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">¡No te pierdas nuestras ofertas!</h3>
          <p className="mb-8 text-lg">Suscríbete y recibe un 10% de descuento en tu primera compra</p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Tu email" 
              className="flex-grow px-5 py-3 rounded-l-lg text-gray-900 text-lg focus:outline-none"
            />
            <button className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-r-lg hover:bg-yellow-300 transition text-lg">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
