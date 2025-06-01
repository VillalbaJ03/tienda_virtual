import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function FacturaPage() {
  const { id } = useParams();
  const [facturaUrl, setFacturaUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFacturaUrl(`/api/facturas/${id}.pdf`);
    setLoading(false);
  }, [id]);

  if (loading) return <div>Cargando factura...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Factura #{id}</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <iframe 
          src={facturaUrl} 
          className="w-full h-screen border-none"
          title={`Factura-${id}`}
        />
        <div className="mt-4">
          <a 
            href={facturaUrl} 
            download={`factura-${id}.pdf`}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Descargar Factura
          </a>
        </div>
      </div>
    </div>
  );
}
