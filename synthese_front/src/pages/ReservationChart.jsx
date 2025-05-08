import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReservationStats() {
  const [groupBy, setGroupBy] = useState('month');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get('/api/reservations/statistics', {
      params: { type: groupBy }
    }).then(response => {
      setStats(response.data);
    }).catch(error => {
      console.error('Erreur chargement des stats', error);
    });
  }, [groupBy]);

  const chartData = {
    labels: stats.map(stat => stat.label),
    datasets: [
      {
        label: 'Réservations',
        data: stats.map(stat => stat.count),
        backgroundColor: 'rgb(27, 7, 141)',
        borderColor: 'rgb(27, 7, 141)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Total : ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: true },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' }
      }
    },
    elements: {
      bar: {
        barThickness: 2,
        maxBarThickness: 4
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 mt-8">
        <h2 className="text-4xl font-extrabold text-left text-indigo-600 mb-6 transform transition-all hover:scale-105 hover:text-indigo-800">
          Statistiques des réservations
        </h2>

        <div className="flex justify-end mb-6">
          <div className="w-1/3">
            <label htmlFor="groupBy" className="block text-sm font-medium text-gray-600 mb-2">Grouper par</label>
            <select
              id="groupBy"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="day">Jour</option>
              <option value="month">Mois</option>
              <option value="year">Année</option>
            </select>
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto bg-gray-50 p-4 rounded-lg shadow-lg">
          <div className="h-[300px]">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationStats;
