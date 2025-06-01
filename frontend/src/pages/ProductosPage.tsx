import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';
import FiltrosProductos from '../components/FiltrosProductos';

export default function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState<any[]>([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Parámetros de filtrado
  const categoria = searchParams.get('categoria') || '';
  const temporada = searchParams.get('temporada') || '';
  const precioMin = searchParams.get('precioMin') || '';
  const precioMax = searchParams.get('precioMax') || '';
  const pagina = parseInt(searchParams.get('pagina') || '1');

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          categoria,
          temporada,
          precioMin,
          precioMax,
          pagina: pagina.toString(),
          limite: '12'
        }).toString();
        const res = await fetch(`/api/productos?${params}`);
        const data = await res.json();
        console.log('Respuesta productos:', data); // DEBUG

        // DEBUG: Si la respuesta es un array plano, adaptarla
        if (Array.isArray(data)) {
          setProductos(data);
          setTotalProductos(data.length);
        } else {
          setProductos(data.productos || data.data || []);
          setTotalProductos(data.total || data.meta?.total || 0);
        }
      } catch (err) {
        setProductos([]);
        setTotalProductos(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [categoria, temporada, precioMin, precioMax, pagina]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar de filtros */}
        <aside className="md:w-1/4 w-full mb-8 md:mb-0">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24 border border-gray-100">
            <FiltrosProductos 
              filtros={{ categoria, temporada, precioMin, precioMax }}
              setFiltros={(f) => {
                setSearchParams({ ...Object.fromEntries(searchParams), ...f, pagina: '1' });
              }}
            />
          </div>
        </aside>
        {/* Lista de productos */}
        <section className="md:w-3/4 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
              {categoria ? `${categoria}` : 'Todos los productos'}
              <span className="text-gray-400 text-lg ml-2 font-normal">({totalProductos})</span>
            </h1>
            {/* Ordenar (opcional) */}
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <img src="/no-products.svg" alt="Sin productos" className="w-32 h-32 mb-6 opacity-70" />
              <p className="text-lg text-gray-500 mb-4">No se encontraron productos que coincidan con tu búsqueda.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {productos.map((producto: any) => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
              {/* Paginación simple */}
              <div className="flex justify-center mt-10 gap-2">
                {pagina > 1 && (
                  <button onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), pagina: (pagina-1).toString() })} className="px-5 py-2 bg-gray-200 rounded-lg font-semibold">Anterior</button>
                )}
                <span className="px-5 py-2 font-semibold">Página {pagina}</span>
                {productos.length === 12 && (
                  <button onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), pagina: (pagina+1).toString() })} className="px-5 py-2 bg-gray-200 rounded-lg font-semibold">Siguiente</button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
