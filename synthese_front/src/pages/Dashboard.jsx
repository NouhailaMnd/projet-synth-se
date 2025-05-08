import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaConciergeBell, FaCogs, FaServicestack, FaEnvelope, FaCalendarCheck } from 'react-icons/fa';
import { GiCardboardBox } from 'react-icons/gi';  // Nouvelle icône pour les prestataires

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrestataires: 0,
    totalPrestations: 0,
    totalServices: 0,
    totalContacts: 0,
    totalReservations: 0,
  });

  useEffect(() => {
    // Exemple d'appel API pour récupérer les totaux depuis le backend Laravel
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats'); // Ajustez l'URL en fonction de votre API Laravel
        setStats(response.data); // La réponse doit contenir les données totales
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques : ", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8 px-6">
      <h1 className="text-center text-4xl font-semibold text-gray-800 mb-10">Tableau de Bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {/* Carte Total Clients */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white p-6 rounded-lg shadow-xl hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-blue-500 p-3 rounded-full shadow-lg">
              <FaUsers size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Total des Clients</h3>
              <p className="text-4xl font-bold">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        {/* Carte Total Prestataires */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-6 rounded-lg shadow-xl hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-purple-600 p-3 rounded-full shadow-lg">
              <GiCardboardBox size={30} /> {/* Nouvelle icône */}
            </div>
            <div>
              <h3 className="text-xl font-semibold">Total des Prestataires</h3>
              <p className="text-4xl font-bold">{stats.totalPrestataires}</p>
            </div>
          </div>
        </div>

        {/* Carte Total Prestations */}
        <div className="bg-gradient-to-r from-green-500 to-lime-400 text-white p-6 rounded-lg shadow-xl hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-green-500 p-3 rounded-full shadow-lg">
              <FaCogs size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Total des Prestations</h3>
              <p className="text-4xl font-bold">{stats.totalPrestations}</p>
            </div>
          </div>
        </div>

        {/* Carte Total Services */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white p-6 rounded-lg shadow-xl hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-teal-500 p-3 rounded-full shadow-lg">
              <FaServicestack size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Total des Services</h3>
              <p className="text-4xl font-bold">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        {/* Carte Total Contacts */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white p-6 rounded-lg shadow-xl hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-orange-500 p-3 rounded-full shadow-lg">
              <FaEnvelope size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Total des Contacts</h3>
              <p className="text-4xl font-bold">{stats.totalContacts}</p>
            </div>
          </div>
        </div>

        {/* Carte Total Réservations */}
        <div className="bg-gradient-to-r from-red-500 to-pink-400 text-white p-6 rounded-lg shadow-xl hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-red-500 p-3 rounded-full shadow-lg">
              <FaCalendarCheck size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Total des Réservations</h3>
              <p className="text-4xl font-bold">{stats.totalReservations}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
