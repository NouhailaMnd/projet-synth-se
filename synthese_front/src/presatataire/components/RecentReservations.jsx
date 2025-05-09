import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservationsPrestataire = () => {
  const [reservations, setReservations] = useState([]);
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedReservation, setExpandedReservation] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        setErreur("Authentification requise. Veuillez vous connecter.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:8000/api/prestataire/reservations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReservations(response.data);
      } catch (error) {
        console.error(error);
        setErreur(error.response?.data?.message || "Erreur lors du chargement des réservations");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReservations();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const toggleReservation = (id) => {
    setExpandedReservation(expandedReservation === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Oups ! Une erreur est survenue</h2>
          <p className="text-gray-600 mb-6">{erreur}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Mes Réservations</h1>
                <p className="mt-2 opacity-90">Gérez vos rendez-vous clients</p>
              </div>
              <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="font-medium">{reservations.length} {reservations.length > 1 ? 'réservations' : 'réservation'}</p>
              </div>
            </div>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
            <div className="mx-auto h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">Aucune réservation trouvée</h3>
            <p className="mt-2 text-gray-500">Votre calendrier de réservations est vide pour le moment.</p>
            <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Actualiser
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div 
                key={res.reservation_id} 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleReservation(res.reservation_id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{res.prestation_nom}</h3>
                        <p className="text-gray-500">{res.service_nom}</p>
                        <p className="text-sm text-gray-400 mt-1 sm:hidden">{formatDate(res.date_reservation)}</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        res.status === 'confirmée' ? 'bg-green-100 text-green-800' :
                        res.status === 'annulée' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {res.status}
                      </span>
                      <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {res.duree} min
                      </span>
                      <svg 
                        className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedReservation === res.reservation_id ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedReservation === res.reservation_id && (
                  <div className="px-6 pb-6 pt-0 border-t border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">DÉTAILS DE LA RÉSERVATION</h4>
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            <span className="font-medium">Date:</span> {formatDate(res.date_reservation)}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Durée:</span> {res.duree} minutes
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Statut:</span> 
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              res.status === 'confirmée' ? 'bg-green-100 text-green-800' :
                              res.status === 'annulée' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {res.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">INFORMATIONS CLIENT</h4>
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            <span className="font-medium">Nom:</span> {res.client_nom}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Email:</span> {res.client_email}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Adresse:</span> {res.quartier}, {res.ville}, {res.pays}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Code postal:</span> {res.code_postal}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-3">
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors">
                        Contacter le client
                      </button>
                      <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                        Voir les détails
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPrestataire;