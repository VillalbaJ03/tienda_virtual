import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProductosMasVendidosGrafico() {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    // Obtener token de localStorage de forma segura
    const user = localStorage.getItem('user');
    let token = '';
    try {
      token = user ? JSON.parse(user).token : '';
    } catch {
      token = '';
    }
    if (!token) return;
    axios.get('/api/admin/reportes/productos-mas-vendidos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setLabels(res.data.map((d) => d.nombre));
        setValues(res.data.map((d) => d.totalVendidas));
      })
      .catch(() => {
        setLabels([]);
        setValues([]);
      });
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Productos más Vendidos' },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
}
