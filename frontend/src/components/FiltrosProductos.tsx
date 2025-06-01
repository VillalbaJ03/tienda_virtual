import React from 'react';

export default function FiltrosProductos({ filtros, setFiltros }: {
  filtros: {
    categoria: string;
    temporada: string;
    precioMin: string;
    precioMax: string;
  };
  setFiltros: (f: any) => void;
}) {
  return (
    <form className="mb-8 bg-white rounded-2xl shadow p-4 border border-gray-100 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Categoría</label>
          <select
            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 text-sm"
            value={filtros.categoria}
            onChange={e => setFiltros((prev: any) => ({ ...prev, categoria: e.target.value }))}
          >
            <option value="">Todas</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Ropa">Ropa</option>
            <option value="Libros">Libros</option>
            <option value="Hogar">Hogar</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Temporada</label>
          <select
            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 text-sm"
            value={filtros.temporada}
            onChange={e => setFiltros((prev: any) => ({ ...prev, temporada: e.target.value }))}
          >
            <option value="">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Precio mínimo</label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 text-sm"
            value={filtros.precioMin}
            onChange={e => setFiltros((prev: any) => ({ ...prev, precioMin: e.target.value }))}
            min={0}
            placeholder="$0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Precio máximo</label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 text-sm"
            value={filtros.precioMax}
            onChange={e => setFiltros((prev: any) => ({ ...prev, precioMax: e.target.value }))}
            min={0}
            placeholder="$9999"
          />
        </div>
      </div>
    </form>
  );
}
