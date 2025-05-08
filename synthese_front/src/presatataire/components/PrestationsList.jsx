import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrestationsComponent = () => {
  const [prestations, setPrestations] = useState([]);
  const [error, setError] = useState(null);

  // Intercepteur global (à placer ailleurs en production, ici pour test)
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }, []); // Une seule fois au montage

  // Récupération des prestations
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/prestataire/prestations')
      .then((response) => {
        setPrestations(response.data);
      })
      .catch((error) => {
        setError('Erreur lors de la récupération des prestations.');
        console.error(error);
      });
  }, []);

  if (error) return <p className="text-red-600 p-4">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Liste des Prestations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prestations.map((prestation) => (
          <div key={prestation.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold text-gray-800">{prestation.nom}</h3>
            <p
              className={`mt-2 font-medium ${
                prestation.est_associee ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {prestation.est_associee ? 'Associée' : 'Non associée'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrestationsComponent;
