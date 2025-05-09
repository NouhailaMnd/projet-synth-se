import React, { useState, useEffect } from 'react';  
import axios from 'axios'; 
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function UserStats() {
  const [role, setRole] = useState('client'); 
  const [groupBy, setGroupBy] = useState('month'); 
  const [stats, setStats] = useState([]); 

  useEffect(() => {
    axios.get('/api/user-stats', {
      params: {
        role: role,
        group_by: groupBy,
      }
    }).then(response => {
      setStats(response.data);
    }).catch(error => {
      console.error('Error fetching stats', error);
    });
  }, [role, groupBy]);

  const chartData = {
    labels: stats.map(stat => {
      if (groupBy === 'day') {
        return stat.date; 
      } else if (groupBy === 'month') {
        return `${stat.month}/${stat.year}`; 
      } else {
        return stat.year; 
      }
    }),
    datasets: [
      {
        label: `Utilisateurs (${role})`,
        data: stats.map(stat => stat.total),
        backgroundColor: 'rgb(27, 7, 141)',
        borderColor: 'rgb(34, 9, 174)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Total: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      }
    },
    elements: {
      bar: {
        barThickness: 2,        // largeur fixe plus fine
        maxBarThickness: 4,     // largeur maximale autorisée
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 mt-8">
        <h2 className="text-4xl font-extrabold text-left text-indigo-600 mb-6 transform transition-all hover:scale-105 hover:text-indigo-800">
          Statistiques des utilisateurs
        </h2> 
        <div className="flex justify-between mb-6 space-x-6">
          <div className="w-1/2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-2">Rôle</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="client">Client</option>
              <option value="prestataire">Prestataire</option>
            </select>
          </div>

          <div className="w-1/2">
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

export default UserStats;
