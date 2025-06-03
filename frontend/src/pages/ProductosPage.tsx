import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductoCard from '../components/ProductoCard';
import { 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

interface ProductosPageProps {
  ofertasOnly?: boolean;
}

export default function ProductosPage({ ofertasOnly = false }: ProductosPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState<any[]>([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  // Parámetros de filtrado
  const categoria = searchParams.get('categoria') || '';
  const searchQuery = searchParams.get('busqueda') || '';
  const precioMin = searchParams.get('precioMin') || '';
  const precioMax = searchParams.get('precioMax') || '';
  const orden = searchParams.get('orden') || 'relevancia';
  const pagina = parseInt(searchParams.get('pagina') || '1');

  // Opciones de ordenación
  const sortOptions = [
    { name: 'Más relevantes', value: 'relevancia' },
    { name: 'Mejor valorados', value: 'rating' },
    { name: 'Precio: menor a mayor', value: 'precio-asc' },
    { name: 'Precio: mayor a menor', value: 'precio-desc' },
    { name: 'Más nuevos', value: 'nuevos' },
  ];

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          categoria,
          busqueda: searchQuery,
          precioMin,
          precioMax,
          orden,
          pagina: pagina.toString(),
          limite: '12'
        }).toString();
        const res = await fetch(`/api/productos?${params}`);
        const data = await res.json();
        let productosFiltrados = data.productos || data.data || [];
        if (ofertasOnly) {
          productosFiltrados = productosFiltrados.filter((p: any) => Number(p.descuento) > 0);
        }
        setProductos(productosFiltrados);
        setTotalProductos(productosFiltrados.length);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProductos([]);
        setTotalProductos(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductos();
  }, [categoria, searchQuery, precioMin, precioMax, orden, pagina, ofertasOnly]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = categoria || searchQuery || precioMin || precioMax;

  return (
    <div className="bg-white">
      {/* Banner superior */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 py-4 text-white text-center text-sm font-medium">
        Envíos gratis en compras superiores a $100.000 | 3 cuotas sin interés
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {searchQuery 
              ? `Resultados para "${searchQuery}"` 
              : categoria 
                ? categoria 
                : 'Nuestros productos'}
            <span className="text-gray-500 text-lg ml-2 font-normal">({totalProductos})</span>
          </h1>

          <div className="flex items-center space-x-4">
            {/* Selector de vista */}
            <div className="hidden sm:flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Ordenar */}
            <div className="relative">
              <select
                value={orden}
                onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), orden: e.target.value })}
                className="appearance-none bg-gray-100 border-0 pl-4 pr-10 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.name}</option>
                ))}
              </select>
              <ArrowsUpDownIcon className="h-4 w-4 absolute right-3 top-2.5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filtros activos */}
        {hasFilters && (
          <div className="flex items-center space-x-4 my-4 flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
            
            {categoria && (
              <span className="inline-flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                {categoria}
                <button 
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), categoria: '' })}
                  className="ml-1.5 p-0.5 rounded-full text-indigo-500 hover:text-indigo-700"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {searchQuery && (
              <span className="inline-flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                "{searchQuery}"
                <button 
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), busqueda: '' })}
                  className="ml-1.5 p-0.5 rounded-full text-indigo-500 hover:text-indigo-700"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}

            <button 
              onClick={clearFilters}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 ml-2"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* Contenido */}
        <section className="pb-24 pt-6">
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`${viewMode === 'grid' ? 'h-80' : 'h-40'} bg-gray-100 rounded-xl animate-pulse`}></div>
              ))}
            </div>
          ) : productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <img 
                src="/no-products.svg" 
                alt="Sin productos" 
                className="w-40 h-40 mb-6 opacity-70" 
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 max-w-md mb-6">
                {hasFilters 
                  ? "Intenta ajustar tus filtros de búsqueda" 
                  : "Pronto tendremos nuevos productos disponibles"}
              </p>
              {hasFilters ? (
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Volver al inicio
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {productos.map((producto) => (
                  <ProductoCard 
                    key={producto.id} 
                    producto={producto} 
                  />
                ))}
              </div>

              {/* Paginación */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-8 mt-12">
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), pagina: (pagina-1).toString() })}
                  disabled={pagina <= 1}
                  className={`flex items-center px-4 py-2 rounded-md ${pagina <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-1" />
                  Anterior
                </button>
                
                <div className="hidden md:flex space-x-2">
                  {[...Array(Math.ceil(totalProductos / 12)).keys()].slice(0, 5).map((i) => (
                    <button
                      key={i}
                      onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), pagina: (i+1).toString() })}
                      className={`px-4 py-2 rounded-md ${pagina === i+1 ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {i+1}
                    </button>
                  ))}
                  {Math.ceil(totalProductos / 12) > 5 && (
                    <span className="px-4 py-2 text-gray-500">...</span>
                  )}
                </div>
                
                <span className="text-sm text-gray-700 md:hidden">
                  Página {pagina} de {Math.ceil(totalProductos / 12)}
                </span>
                
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), pagina: (pagina+1).toString() })}
                  disabled={productos.length < 12}
                  className={`flex items-center px-4 py-2 rounded-md ${productos.length < 12 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Siguiente
                  <ChevronRightIcon className="h-5 w-5 ml-1" />
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}