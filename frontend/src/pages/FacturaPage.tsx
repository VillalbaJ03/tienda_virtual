import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function FacturaPage() {
  const { id } = useParams();
  const [facturaUrl, setFacturaUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setFacturaUrl(`/api/facturas/${id}.pdf`);
    setLoading(false);
  }, [id]);

  if (loading) return <div className="text-center py-12">Cargando factura...</div>;

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Factura #{id}</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition font-semibold"
          >
            ← Volver
          </button>
        </div>
        <div className="bg-gray-100 rounded-lg overflow-hidden border mb-4">
          <iframe
            src={facturaUrl}
            className="w-full min-h-[70vh] border-none"
            title={`Factura-${id}`}
          />
        </div>
        <div className="flex justify-end">
          <a
            href={facturaUrl}
            download={`factura-${id}.pdf`}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Descargar Factura
          </a>
        </div>
      </div>
    </div>
  );
}
