import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReservationChart = () => {
  const [groupBy, setGroupBy] = useState('day');
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios
      .get('/api/reservations/statistics', { params: { type: groupBy } })
      .then((response) => {
        console.log('Données reçues:', response.data);
        setStats(response.data);
      })
      .catch((error) => {
        console.error('Erreur chargement des stats', error);
      });
  }, [groupBy]);

  if (!stats || Object.keys(stats).length === 0) {
    return <p>Aucune donnée disponible.</p>;
  }

  const labels = Object.keys(stats);
  const statuses = ['enattente', 'confirme', 'encoure', 'termine'];
  const colors = {
    enattente: 'orange',
    confirme: 'blue',
    encoure: 'green',
    termine: 'red'
  };

  const chartData = {
    labels,
    datasets: statuses.map((status) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      data: labels.map((date) => stats[date][status] || 0),
      backgroundColor: colors[status],
    })),
  };

  const options = {
    responsive: true,
    layout: {
      padding: {
        top: 10,  // Réduire l'espace en haut
      }
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Statistiques des réservations' },
    },
  };

  return (
    
   <div className="container mx-auto p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 mt-8">
        <h2 className="text-4xl font-extrabold text-left text-indigo-600 mb-6">
          Statistiques des Reservations
        </h2>

      <select
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value)}
        className="mb-2 p-2 border"  // Réduit l'espace sous le select
      >
        <option value="day">Par jour</option>
        <option value="month">Par mois</option>
        <option value="year">Par année</option>
      </select>

      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>  </div>  </div>
 
  );
};

export default ReservationChart;
