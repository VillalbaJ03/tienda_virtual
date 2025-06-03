import React, { useState } from 'react';

interface FAQItem {
  id: number;
  pregunta: string;
  respuesta: string;
  categoria: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    pregunta: "¿Cómo puedo realizar una compra?",
    respuesta: "Para realizar una compra, simplemente navega por nuestros productos, agrega los que te gusten al carrito haciendo clic en 'Agregar al carrito', revisa tu carrito de compras y procede al checkout. Durante el proceso de pago, deberás proporcionar tu información de envío y datos de pago para completar la transacción de manera segura.",
    categoria: "Compras"
  },
  {
    id: 2,
    pregunta: "¿Qué métodos de pago aceptan?",
    respuesta: "Aceptamos múltiples métodos de pago para tu conveniencia: tarjetas de crédito (Visa, MasterCard, American Express), tarjetas de débito, PayPal y transferencias bancarias. Todos los pagos son procesados de manera segura con encriptación SSL para proteger tu información financiera.",
    categoria: "Pagos"
  },
  {
    id: 3,
    pregunta: "¿Puedo modificar o cancelar mi pedido?",
    respuesta: "Sí, puedes modificar o cancelar tu pedido siempre y cuando aún no haya sido procesado para envío. Una vez que recibas el email de confirmación, tienes un plazo de 2 horas para realizar cambios. Después de este tiempo, contacta nuestro servicio al cliente para solicitar asistencia.",
    categoria: "Pedidos"
  },
  {
    id: 4,
    pregunta: "¿Cómo consulto el estado de mi pedido?",
    respuesta: "Para consultar el estado de tu pedido, inicia sesión en tu cuenta y ve a la sección 'Historial de Compras'. Ahí encontrarás todos tus pedidos con información detallada sobre el estado actual, número de seguimiento y fecha estimada de entrega.",
    categoria: "Pedidos"
  },
  {
    id: 5,
    pregunta: "¿Cuáles son los tiempos de entrega?",
    respuesta: "Los tiempos de entrega varían según tu ubicación: entregas locales (1-2 días hábiles), entregas nacionales (3-5 días hábiles), y entregas internacionales (7-15 días hábiles). Recibirás un número de seguimiento una vez que tu pedido sea despachado.",
    categoria: "Envíos"
  },
  {
    id: 6,
    pregunta: "¿Tienen política de devoluciones?",
    respuesta: "Sí, ofrecemos una política de devoluciones de 30 días. Puedes devolver cualquier producto en su estado original, sin usar y con el empaque original. Los gastos de envío de devolución corren por cuenta del cliente, excepto en casos de productos defectuosos o errores de nuestra parte.",
    categoria: "Devoluciones"
  },
  {
    id: 7,
    pregunta: "¿Cómo contacto al soporte técnico?",
    respuesta: "Puedes contactar nuestro equipo de soporte a través de múltiples canales: formulario de contacto en nuestra página web, email a soporte@tienda.com, teléfono +1-800-SOPORTE, o chat en vivo disponible de lunes a viernes de 9:00 AM a 6:00 PM.",
    categoria: "Soporte"
  },
  {
    id: 8,
    pregunta: "¿Ofrecen garantía en sus productos?",
    respuesta: "Todos nuestros productos cuentan con garantía del fabricante. La duración varía según el tipo de producto: electrónicos (12 meses), ropa (6 meses), y artículos para el hogar (24 meses). La garantía cubre defectos de fabricación y mal funcionamiento normal.",
    categoria: "Garantías"
  },
  {
    id: 9,
    pregunta: "¿Puedo comprar sin crear una cuenta?",
    respuesta: "Sí, ofrecemos la opción de compra como invitado. Sin embargo, te recomendamos crear una cuenta para poder rastrear tus pedidos, guardar tu información de envío, acceder a ofertas exclusivas y tener un historial completo de tus compras.",
    categoria: "Cuentas"
  }
];

const categorias = ["Todas", ...Array.from(new Set(faqData.map(item => item.categoria)))];

export default function PreguntasPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [expandido, setExpandido] = useState<number | null>(null);

  const faqFiltrado = faqData.filter(item => {
    const coincideCategoria = categoriaSeleccionada === "Todas" || item.categoria === categoriaSeleccionada;
    const coincideBusqueda = item.pregunta.toLowerCase().includes(busqueda.toLowerCase()) || 
                            item.respuesta.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Centro de Ayuda
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Encuentra respuestas rápidas a tus preguntas más frecuentes
          </p>
          
          {/* Barra de búsqueda */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              className="w-full pl-10 pr-4 py-4 text-gray-900 bg-white rounded-xl shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-300"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filtros por categoría */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Explora por Categoría</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  categoriaSeleccionada === categoria
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div className="space-y-4">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-700">
              {faqFiltrado.length} pregunta{faqFiltrado.length !== 1 ? 's' : ''} encontrada{faqFiltrado.length !== 1 ? 's' : ''}
            </h3>
          </div>

          {faqFiltrado.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => setExpandido(expandido === item.id ? null : item.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {item.categoria}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.pregunta}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${
                      expandido === item.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                expandido === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-5 pt-0">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <p className="text-gray-700 leading-relaxed">
                      {item.respuesta}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {faqFiltrado.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron preguntas</h3>
              <p className="text-gray-500">Intenta ajustar tu búsqueda o seleccionar una categoría diferente.</p>
            </div>
          )}
        </div>

        {/* Sección de contacto */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¿No encontraste lo que buscabas?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta específica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Soporte
            </a>
            <a
              href="tel:+1-800-SOPORTE"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Llamar Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
