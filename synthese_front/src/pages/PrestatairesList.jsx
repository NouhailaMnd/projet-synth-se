import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrestatairesList = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/prestataires')
      .then(res => {
        // Trie les prestataires par id décroissant (plus récent en haut)
        const sorted = res.data.sort((a, b) => b.id - a.id);
        setPrestataires(sorted);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des prestataires');
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (prestataireId, prestationId, newStatus) => {
    axios.put(`/api/prestataires/${prestataireId}/prestations/${prestationId}/status`, {
      status_validation: newStatus,
    })
    .then(() => {
      setPrestataires(prev =>
        prev.map(p => {
          if (p.id === prestataireId) {
            return {
              ...p,
              prestations: p.prestations.map(prest => {
                if (prest.id === prestationId) {
                  return {
                    ...prest,
                    pivot: {
                      ...prest.pivot,
                      status_validation: newStatus,
                    }
                  };
                }
                return prest;
              }),
            };
          }
          return p;
        })
      );
    })
    .catch(() => {
      alert('Erreur lors de la mise à jour du statut');
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valide':
        return 'bg-green-100 text-green-800';
      case 'refuse':
        return 'bg-red-100 text-red-800';
      case 'en_attente':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Filtrer les prestations pour n'afficher que celles en attente
  const filteredPrestataires = prestataires.map(prestataire => ({
    ...prestataire,
    prestations: prestataire.prestations.filter(prestation => 
      prestation.pivot.status_validation === 'en_attente' || !prestation.pivot.status_validation
    )
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8 font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-20 border-b pb-2">
        Liste Confirmation des Prestataires
      </h2>

      {filteredPrestataires.map(prestataire => (
        // N'affiche que les prestataires ayant au moins une prestation en attente
        prestataire.prestations.length > 0 && (
          <div key={prestataire.id} className="mb-12 bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              {prestataire.photo && (
                <img src={prestataire.photo} alt="Photo Prestataire" className="w-16 h-16 rounded-full object-cover border" />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{prestataire.user?.name || 'Nom utilisateur non disponible'}</h2>
                <p className="text-gray-500">Téléphone : {prestataire.telephone}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Prestation</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Document</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prestataire.prestations.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 text-gray-400 italic" colSpan="3">Aucune prestation</td>
                    </tr>
                  ) : (
                    prestataire.prestations.map(prestation => (
                      <tr key={prestation.id} className={`transition ${getStatusColor(prestation.pivot.status_validation)}`}>
                        <td className="px-6 py-4 font-medium">{prestation.nom}</td>
                        <td className="px-6 py-4">
                          {prestation.pivot.document_justificatif ? (
                            <a
                              href={`http://localhost:8000/storage/${prestation.pivot.document_justificatif}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Voir document
                            </a>
                          ) : (
                            <span className="text-gray-400">Aucun document</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={prestation.pivot.status_validation || 'en_attente'}
                            onChange={(e) =>
                              handleStatusChange(prestataire.id, prestation.id, e.target.value)
                            }
                            className={`border text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:outline-none ${
                              prestation.pivot.status_validation === 'valide'
                                ? 'bg-green-100 border-green-300 text-green-800 focus:ring-green-300'
                                : prestation.pivot.status_validation === 'refuse'
                                ? 'bg-red-100 border-red-300 text-red-800 focus:ring-red-300'
                                : 'bg-yellow-100 border-yellow-300 text-yellow-800 focus:ring-yellow-300'
                            }`}
                          >
                            <option value="en_attente">En attente</option>
                            <option value="valide">Validé</option>
                            <option value="refuse">Refusé</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      ))}

      {filteredPrestataires.every(p => p.prestations.length === 0) && (
        <div className="text-center py-10 text-gray-500">
          Aucune prestation en attente de validation
        </div>
      )}
    </div>
  );
};

export default PrestatairesList;