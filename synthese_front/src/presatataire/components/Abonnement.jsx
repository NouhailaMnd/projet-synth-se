import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FacturePDF from './FacturePDF';

const Abonnement = () => {
  const [typesAbonnement, setTypesAbonnement] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [joursRestants, setJoursRestants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [abonnement, setAbonnement] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchTypesAbonnement();
    checkAbonnementStatus();
  }, []);

  const fetchTypesAbonnement = async () => {
    try {
      const res = await axios.get('/api/type-abonnements', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setTypesAbonnement(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des types :', error);
    }
  };

  const checkAbonnementStatus = async () => {
    try {
      const res = await axios.get('/api/abonnement/check-status', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setStatus(res.data.status);
      setJoursRestants(res.data.jours_restants || 0);
      setMessage(res.data.message || '');
    } catch (error) {
      console.error('Erreur lors de la vérification du statut :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedType) {
      alert("Veuillez sélectionner un type d'abonnement.");
      return;
    }

    try {
      const res = await axios.post(
        '/api/abonnement',
        { type_abonnement_id: selectedType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = res.data;
      alert('✅ Abonnement souscrit avec succès !');
      checkAbonnementStatus();
      setAbonnement(data.abonnement);
      setUser(data.user);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert('Erreur lors de la souscription.');
      }
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className=" mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Gestion d'abonnement</h2>
          <p className="opacity-90 mt-1">Souscrivez à un abonnement pour accéder à toutes les fonctionnalités</p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {status === 'actif' && (
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-r">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    <strong className="font-medium">Abonnement actif</strong>
                  </div>
                  <p className="mt-2">Votre abonnement est valide pour encore <span className="font-bold">{joursRestants} jours</span>.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'abonnement
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">-- Sélectionnez un type --</option>
                    {typesAbonnement.map((type) => (
                      <option key={type.id} value={type.id} className="py-2">
                        {type.type} - {type.prix} MAD ({type.duree_mois} mois)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={status === 'actif'}
                  className={`w-full px-6 py-3 rounded-lg font-medium text-white transition duration-300 ${
                    status === 'actif'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
                >
                  {status === 'actif' ? 'Abonnement déjà actif' : 'Souscrire maintenant'}
                </button>
              </form>

              {abonnement && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Votre facture</h3>
                  <PDFDownloadLink
                    document={<FacturePDF abonnement={abonnement} user={user} />}
                    fileName={`facture-abonnement-${abonnement.id}.pdf`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300"
                  >
                    {({ loading }) => (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {loading ? 'Génération en cours...' : 'Télécharger la facture'}
                      </>
                    )}
                  </PDFDownloadLink>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Abonnement;