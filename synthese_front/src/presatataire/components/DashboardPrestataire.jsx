import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const DashboardPrestataire = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/prestataire/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Aucune donnée disponible</div>;
  }

  // Préparation des données pour les graphiques
  const statusData = {
    labels: dashboardData.reservations_stats.map(stat => {
      const statusLabels = {
        'enattente': 'En attente',
        'confirme': 'Confirmé',
        'annule': 'Annulé',
        'termine': 'Terminé'
      };
      return statusLabels[stat.status] || stat.status;
    }),
    datasets: [
      {
        data: dashboardData.reservations_stats.map(stat => stat.total),
        backgroundColor: [
          '#FFCE56',
          '#36A2EB',
          '#FF6384',
          '#4BC0C0'
        ],
        hoverBackgroundColor: [
          '#FFCE56',
          '#36A2EB',
          '#FF6384',
          '#4BC0C0'
        ]
      }
    ]
  };

  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  const monthlyData = {
    labels: dashboardData.reservations_by_month.map(item => months[item.month - 1]),
    datasets: [
      {
        label: 'Réservations par mois',
        backgroundColor: '#4299E1',
        borderColor: '#2B6CB0',
        borderWidth: 1,
        hoverBackgroundColor: '#2B6CB0',
        hoverBorderColor: '#2C5282',
        data: dashboardData.reservations_by_month.map(item => item.total)
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue, Prestataire</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Prestations</h3>
              <p className="text-2xl font-semibold text-gray-800">{dashboardData.total_prestations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Services</h3>
              <p className="text-2xl font-semibold text-gray-800">{dashboardData.total_services}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Abonnement</h3>
              <p className="text-xl font-semibold text-gray-800">
                {dashboardData.abonnement?.type_abonnement?.type || 'Aucun'}
              </p>
              <p className="text-sm text-gray-500">
                {dashboardData.abonnement ? 
                  `Expire le ${new Date(dashboardData.abonnement.date_fin).toLocaleDateString()}` : 
                  'Non abonné'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statut des réservations</h3>
          <div className="h-64">
            <Pie 
              data={statusData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Réservations par mois</h3>
          <div className="h-64">
            <Bar 
              data={monthlyData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Prestataire Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du prestataire</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600"><span className="font-medium">Pays:</span> {dashboardData.prestataire_info.region || 'Non renseigné'}</p>
            <p className="text-gray-600"><span className="font-medium">Ville:</span> {dashboardData.prestataire_info.ville || 'Non renseigné'}</p>
            <p className="text-gray-600"><span className="font-medium">Quartier:</span> {dashboardData.prestataire_info.quartier || 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-gray-600"><span className="font-medium">Code postal:</span> {dashboardData.prestataire_info.code_postal || 'Non renseigné'}</p>
            <p className="text-gray-600"><span className="font-medium">Téléphone:</span> {dashboardData.prestataire_info.telephone || 'Non renseigné'}</p>
            <p className="text-gray-600"><span className="font-medium">Genre:</span> {dashboardData.prestataire_info.genre === 'homme' ? 'Homme' : 'Femme'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPrestataire;