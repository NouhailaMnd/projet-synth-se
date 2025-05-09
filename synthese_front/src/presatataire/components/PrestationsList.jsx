import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrestationsList = () => {
  const [prestataire, setPrestataire] = useState(null); // Pour stocker les infos du prestataire
  const [prestations, setPrestations] = useState([]); // Pour stocker les prestations
  const [error, setError] = useState(null);

  // Intercepteur pour ajouter automatiquement le token
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
  }, []);

  // Charger les prestations et le prestataire
  useEffect(() => {
    fetchPrestationsAvecPrestataire();
  }, []);

  const fetchPrestationsAvecPrestataire = () => {
    axios
      .get('http://localhost:8000/api/prestataire/prestations') // Changez le chemin de l'API si nécessaire
      .then((response) => {
        const { prestataire, prestations } = response.data;
        setPrestataire(prestataire); // Assigner le prestataire retourné
        setPrestations(prestations); // Assigner les prestations retournées
        console.log(response.data);
      })
      .catch((error) => {
        setError("Erreur lors de la récupération des prestations.");
        console.error(error);
      });
  };

  // Associer une prestation au prestataire
  const handleAssocier = (prestationId) => {
    axios
      .post('http://localhost:8000/api/prestataire/prestations', {
        prestation_id: prestationId,
      })
      .then(() => {
        fetchPrestationsAvecPrestataire(); // Recharger la liste après association
      })
      .catch((error) => {
        console.error("Erreur lors de l'association :", error);
        alert("Erreur lors de l'association.");
      });
  };

  // Supprimer l'association entre la prestation et le prestataire
  const handleSupprimerAssociation = (prestataireId, prestationId) => {
    axios
      .delete(`http://localhost:8000/api/prestataire/${prestataireId}/prestation/${prestationId}`)
      .then(() => {
        fetchPrestationsAvecPrestataire(); // Recharger la liste après suppression de l'association
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'association :", error);
        alert("Erreur lors de la suppression de l'association.");
      });
  };

  if (error) return <p className="text-red-600 p-4">{error}</p>;

  if (!prestataire) {
    return <p className="text-blue-600 p-4">Chargement du prestataire...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Liste des Prestations de {prestataire.nom}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Statut</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prestations.map((prestation) => (
              <tr key={prestation.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{prestation.nom}</td>
                <td className="py-3 px-4">
                  {prestation.est_associee ? (
                    <span className="text-green-600 font-semibold">Associée</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Non associée</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {!prestation.est_associee && (
                    <button
                      onClick={() => handleAssocier(prestation.id)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded"
                    >
                      Associer
                    </button>
                  )}
                  {prestation.est_associee && (
                    <button
                      onClick={() => handleSupprimerAssociation(prestataire.id, prestation.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded ml-2"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrestationsList;
