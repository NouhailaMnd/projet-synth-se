import React, { useState, useEffect } from 'react';  
import axios from 'axios'; 
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function UserStats() {
  const [groupBy, setGroupBy] = useState('month'); 
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get('/api/user-stats', {
      params: { group_by: groupBy }
    }).then(response => {
      setStats(response.data);
    }).catch(error => {
      console.error('Error fetching stats', error);
    });
  }, [groupBy]);

  const labels = stats.map(item => item.label);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Clients',
        data: stats.map(item => item.client),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Prestataires',
        data: stats.map(item => item.prestataire),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Total: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 mt-8">
        <h2 className="text-4xl font-extrabold text-left text-blue-600 mb-6">
  Statistiques des utilisateurs
</h2>


        <div className="w-1/2 mb-6">
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

        <div className="w-full max-w-3xl mx-auto bg-gray-50 p-4 rounded-lg shadow-lg">
          <div className="h-[300px]"> 
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
