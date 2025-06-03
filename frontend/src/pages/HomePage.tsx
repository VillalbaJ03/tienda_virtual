import React, { useEffect, useState } from 'react';
import ProductoCard from '../components/ProductoCard';
import { 
  FaShippingFast, 
  FaLock, 
  FaHeadset, 
  FaLaptop, 
  FaTshirt, 
  FaBook, 
  FaCouch, 
  FaArrowRight, 
  FaStar,
  FaGift,
  FaShieldAlt,
  FaRocket,
  FaHeart,
  FaUsers,
  FaPercentage
} from 'react-icons/fa';

const categorias = [
  { nombre: 'Tecnología', icon: <FaLaptop className="text-3xl" />, color: 'from-blue-500 to-blue-600', descripcion: 'Lo último en gadgets' },
  { nombre: 'Ropa', icon: <FaTshirt className="text-3xl" />, color: 'from-pink-500 to-pink-600', descripcion: 'Moda y estilo' },
  { nombre: 'Libros', icon: <FaBook className="text-3xl" />, color: 'from-amber-500 to-amber-600', descripcion: 'Conocimiento infinito' },
  { nombre: 'Hogar', icon: <FaCouch className="text-3xl" />, color: 'from-emerald-500 to-emerald-600', descripcion: 'Tu espacio ideal' },
];

const estadisticas = [
  { numero: '50K+', texto: 'Clientes satisfechos', icon: <FaUsers className="text-2xl" /> },
  { numero: '99.9%', texto: 'Uptime garantizado', icon: <FaRocket className="text-2xl" /> },
  { numero: '24/7', texto: 'Soporte técnico', icon: <FaHeadset className="text-2xl" /> },
  { numero: '15 días', texto: 'Garantía devolución', icon: <FaShieldAlt className="text-2xl" /> },
];

export default function HomePage() {
  const [destacados, setDestacados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/productos?limite=4&destacados=1')
      .then(res => res.json())
      .then(data => {
        setDestacados(Array.isArray(data) ? data : data.productos || data.data || []);
      })
      .catch(() => setDestacados([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero principal mejorado */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-800 text-white overflow-hidden">
        {/* Patrones de fondo animados */}
        <div className="absolute inset-0 opacity-20">
          {/* Elimina la sintaxis problemática de bg-[url(...)] y usa una clase Tailwind estándar o un fondo simple */}
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        </div>
        
        {/* Formas geométricas flotantes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-cyan-400 rotate-45 opacity-25 animate-spin"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Contenido principal */}
            <div className="space-y-8">
              {/* Badge de bienvenida */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <FaGift className="text-yellow-400" />
                <span className="text-sm font-medium">¡Envío gratis en compras +$50!</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Tu tienda
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 animate-pulse">
                  favorita
                </span>
                está aquí
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 font-light leading-relaxed max-w-lg">
                Descubre productos únicos, ofertas increíbles y una experiencia de compra que te enamorará.
              </p>
              
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                {estadisticas.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-cyan-300">{stat.numero}</div>
                    <div className="text-sm text-blue-200 mt-1">{stat.texto}</div>
                  </div>
                ))}
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/productos" 
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  <FaRocket className="mr-2 group-hover:animate-bounce" />
                  Explorar productos
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="/ofertas" 
                  className="group inline-flex items-center justify-center border-2 border-white/50 hover:border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 rounded-xl transition-all duration-300"
                >
                  <FaPercentage className="mr-2" />
                  Ver ofertas especiales
                </a>
              </div>
            </div>
            
            {/* Imagen hero con efectos */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Experiencia de compra moderna" 
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500" 
                />
                {/* Elementos flotantes */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm animate-bounce">
                  ¡Nuevo!
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1">
                  <FaStar className="text-xs" />
                  5.0 Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Explora nuestras categorías
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra exactamente lo que necesitas en nuestras categorías cuidadosamente seleccionadas.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categorias.map((cat, index) => (
            <a 
              href="/productos"
              key={cat.nombre} 
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10 flex flex-col items-center p-8 text-white h-40">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <span className="text-xl font-semibold mb-2">{cat.nombre}</span>
                <span className="text-sm opacity-80 mb-4">{cat.descripcion}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center text-sm font-medium">
                  Ver más <FaArrowRight className="ml-1" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Productos destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lo más vendido y mejor valorado por nuestros clientes
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : destacados.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-40 text-center">
              <FaHeart className="text-6xl text-gray-300 mb-4" />
              <span className="text-xl text-gray-400 font-medium">No hay productos destacados disponibles</span>
              <span className="text-gray-400 mt-2">¡Pronto tendremos novedades para ti!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {destacados.map(producto => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <a 
              href="/productos" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              Ver todos los productos <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas para una experiencia de compra perfecta
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FaShippingFast className="text-2xl text-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">Envíos ultrarrápidos</h3>
            <p className="text-gray-600 leading-relaxed">
              Entrega en 24-48 horas en la mayoría de áreas metropolitanas. Seguimiento en tiempo real y notificaciones instantáneas.
            </p>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FaLock className="text-2xl text-green-600" />
            </div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">Seguridad garantizada</h3>
            <p className="text-gray-600 leading-relaxed">
              Pagos cifrados SSL y protección contra fraudes. Tu información y dinero están completamente seguros con nosotros.
            </p>
          </div>
          
          <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FaHeadset className="text-2xl text-purple-600" />
            </div>
            <h3 className="font-bold text-xl mb-4 text-gray-800">Soporte excepcional</h3>
            <p className="text-gray-600 leading-relaxed">
              Asistencia 24/7 por expertos certificados. Resolvemos cualquier duda en menos de 15 minutos promedio.
            </p>
          </div>
        </div>
      </section>

      {/* Banner de suscripción */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="p-10 md:p-16 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FaGift className="text-yellow-900 text-xl" />
                </div>
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  ¡Oferta especial!
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¡Únete a nuestra comunidad VIP!
              </h3>
              <p className="text-lg text-blue-100 mb-8">
                Suscríbete para recibir ofertas exclusivas, novedades anticipadas y un <strong>15% de descuento</strong> en tu primera compra.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input 
                  type="email" 
                  placeholder="Tu dirección de email" 
                  className="flex-grow px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                />
                <button className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap transform hover:scale-105">
                  Suscribirse gratis
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                  <FaLock className="text-xs" />
                  <span>100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeart className="text-xs" />
                  <span>Sin spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGift className="text-xs" />
                  <span>Ofertas exclusivas</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block flex-1 p-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Ofertas exclusivas semanales</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Acceso anticipado a nuevos productos</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span>Descuentos especiales de cumpleaños</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span>Contenido exclusivo y tips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
