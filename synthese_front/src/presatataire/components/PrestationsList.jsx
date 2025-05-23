import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrestationsList = () => {
  const [prestataire, setPrestataire] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    associer: null,
    supprimer: null
  });
  const [files, setFiles] = useState({});

  // Configuration Axios
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Charger les données
  useEffect(() => {
    fetchPrestationsAvecPrestataire();
  }, []);

  const fetchPrestationsAvecPrestataire = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/prestataire/prestations');
      
      // Vérifier la structure de la réponse et l'adapter si nécessaire
      if (Array.isArray(response.data)) {
        // Si la réponse est directement un tableau de prestations
        setPrestations(response.data);
        
        // Récupérer le prestataire si nécessaire via une autre requête
        try {
          const prestataireResponse = await axios.get('http://localhost:8000/api/prestataire/profil');
          setPrestataire(prestataireResponse.data);
        } catch (e) {
          console.error("Impossible de récupérer le profil du prestataire", e);
        }
      } else {
        // Si la réponse contient toujours l'ancienne structure
        setPrestataire(response.data.prestataire);
        setPrestations(response.data.prestations);
      }
    } catch (error) {
      setError("Erreur lors de la récupération des données");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (prestationId, event) => {
    setFiles({
      ...files,
      [prestationId]: event.target.files[0]
    });
  };

  const handleAssocier = async (prestationId) => {
    if (!files[prestationId]) {
      setError("Veuillez sélectionner un document");
      return;
    }

    try {
      setActionLoading({ ...actionLoading, associer: prestationId });

      const formData = new FormData();
      formData.append('prestation_id', prestationId);
      formData.append('document_justificatif', files[prestationId]);

      const response = await axios.post(
        'http://localhost:8000/api/prestataire/prestations',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Rafraîchir les données
      await fetchPrestationsAvecPrestataire();
      
      // Réinitialiser le fichier pour cette prestation
      setFiles(prev => {
        const newFiles = {...prev};
        delete newFiles[prestationId];
        return newFiles;
      });

    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Erreur lors de l'association");
    } finally {
      setActionLoading({ ...actionLoading, associer: null });
    }
  };

  const handleSupprimerAssociation = async (prestationId) => {
    if (!prestataire) {
      setError("Information du prestataire non disponible");
      return;
    }
    
    try {
      setActionLoading({ ...actionLoading, supprimer: prestationId });
      await axios.delete(
        `http://localhost:8000/api/prestataire/${prestataire.id}/prestation/${prestationId}`
      );
      await fetchPrestationsAvecPrestataire();
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur lors de la suppression");
    } finally {
      setActionLoading({ ...actionLoading, supprimer: null });
    }
  };

  // Fonction pour afficher le statut avec couleur appropriée
  const getStatusClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'; // Pas de statut
    
    switch(status) {
      case 'valide':
        return 'bg-green-100 text-green-800';
      case 'rejete':
        return 'bg-red-100 text-red-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
        {error}
        <button 
          onClick={() => setError(null)}
          className="ml-4 px-3 py-1 bg-red-600 text-white rounded"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-800  text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                 <h1 className="text-2xl font-bold mb-6">Gestion des Prestations</h1>
              </div>
              
            </div>
          </div>
        </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Prestation</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Document</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prestations.map(prestation => (
              <tr key={prestation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {prestation.nom}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {prestation.est_associee ? (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(prestation.status_validation)}`}>
                      {prestation.status_validation === 'valide' && 'Validée'}
                      {prestation.status_validation === 'rejete' && 'Rejetée'}
                      {prestation.status_validation === 'en_attente' && 'En attente'}
                      {!prestation.status_validation && 'Non défini'}
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Non associée
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!prestation.est_associee ? (
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(prestation.id, e)}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  ) : (
                    prestation.document_justificatif ? (
                      <a 
                        href={`http://localhost:8000/storage/${prestation.document_justificatif}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Voir document
                      </a>
                    ) : (
                      <span className="text-gray-400">Aucun document</span>
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!prestation.est_associee ? (
                    <button
                      onClick={() => handleAssocier(prestation.id)}
                      disabled={!files[prestation.id] || actionLoading.associer === prestation.id}
                      className={`px-3 py-1 rounded text-white 
                        ${!files[prestation.id] || actionLoading.associer === prestation.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {actionLoading.associer === prestation.id ? 'En cours...' : 'Associer'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSupprimerAssociation(prestation.id)}
                      disabled={actionLoading.supprimer === prestation.id}
                      className={`px-3 py-1 rounded text-white 
                        ${actionLoading.supprimer === prestation.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {actionLoading.supprimer === prestation.id ? 'En cours...' : 'Supprimer'}
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