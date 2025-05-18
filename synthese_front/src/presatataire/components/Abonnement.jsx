import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FacturePDF from './FacturePDF';

const Abonnement = () => {
  const [typesAbonnement, setTypesAbonnement] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [joursRestants, setJoursRestants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [abonnement, setAbonnement] = useState(null);
  const [user, setUser] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

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

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentForm = () => {
    // Validation simple des champs
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Veuillez entrer un numéro de carte valide (16 chiffres)');
      return false;
    }
    if (!paymentData.cardName) {
      alert('Veuillez entrer le nom figurant sur la carte');
      return false;
    }
    if (!paymentData.expiryDate || !paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      alert('Veuillez entrer une date d\'expiration valide (MM/AA)');
      return false;
    }
    if (!paymentData.cvv || paymentData.cvv.length !== 3) {
      alert('Veuillez entrer un CVV valide (3 chiffres)');
      return false;
    }
    return true;
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!validatePaymentForm()) return;

    try {
      const res = await axios.post(
        '/api/abonnement',
        { 
          type_abonnement_id: selectedType.id,
          payment_data: paymentData 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = res.data;
      alert('✅ Paiement accepté et abonnement souscrit avec succès !');
      checkAbonnementStatus();
      setAbonnement(data.abonnement);
      setUser(data.user);
      setShowPaymentForm(false);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert('Erreur lors du traitement du paiement.');
      }
    }
  };

  const handleInitiatePayment = (e) => {
    e.preventDefault();
    if (!selectedType) {
      alert("Veuillez sélectionner un type d'abonnement.");
      return;
    }
    setShowPaymentForm(true);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'actif':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expiré':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mx-auto bg-white rounded-xl shadow-md overflow-hidden w-full max-w-8xl"> 
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Gestion d'abonnement</h2>
          <p className="opacity-90 mt-1">Souscrivez à un abonnement pour accéder à toutes les fonctionnalités</p>
        </div>

        <div className="p-4 md:p-8 lg:p-10">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {status && (
                <div className={`mb-6 p-4 border-l-4 rounded-r ${getStatusClass(status)}`}>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    <strong className="font-medium">
                      {status === 'actif' ? 'Abonnement actif' : 
                       status === 'expire' ? 'Abonnement expiré' : 'Aucun abonnement actif'}
                    </strong>
                  </div>
                  <p className="mt-2">
                    {status === 'actif' ? `Votre abonnement est valide pour encore ${joursRestants} jours.` : 
                     status === 'expire' ? 'Votre abonnement a expiré. Renouvelez-le pour continuer à bénéficier des services.' : 
                     'Vous n\'avez pas d\'abonnement actif.'}
                  </p>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Choisissez votre abonnement</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {typesAbonnement.map((type) => (
                    <div 
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 h-full flex flex-col ${
                        selectedType?.id === type.id 
                          ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold text-gray-800">{type.type}</h4>
                        {selectedType?.id === type.id && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Sélectionné</span>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-blue-600">{type.prix} MAD</span>
                        <span className="text-gray-500"> / {type.duree_mois} mois</span>
                      </div>
                      
                      <ul className="space-y-2 text-sm text-gray-600 flex-grow">
                        {type.description && type.description.split(',').map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-4 h-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {item.trim()}
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`mt-4 w-full py-2 rounded-lg font-medium transition ${
                          selectedType?.id === type.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedType?.id === type.id ? 'Sélectionné' : 'Sélectionner'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedType && !showPaymentForm && (
                <form onSubmit={handleInitiatePayment} className="mt-8 border-t pt-6">
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-800 mb-3 text-lg">Récapitulatif</h4>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <p className="text-gray-700 font-medium">{selectedType.type}</p>
                        <p className="text-gray-600">Durée: {selectedType.duree_mois} mois</p>
                        <p className="text-sm text-gray-500 mt-2">Accès à toutes les fonctionnalités premium</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mt-3 md:mt-0">{selectedType.prix} MAD</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'actif'}
                    className={`w-full px-6 py-4 rounded-lg font-medium text-white transition duration-300 text-lg ${
                      status === 'actif'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                  >
                    {status === 'actif' 
                      ? 'Abonnement déjà actif' 
                      : `Procéder au paiement (${selectedType.prix} MAD)`}
                  </button>
                </form>
              )}

              {showPaymentForm && (
                <form onSubmit={handleSubmitPayment} className="mt-8 border-t pt-6">
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-800 mb-4 text-lg">Informations de paiement</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formatCardNumber(paymentData.cardNumber)}
                          onChange={(e) => {
                            e.target.value = formatCardNumber(e.target.value);
                            handlePaymentChange(e);
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
                        <input
                          type="text"
                          name="cardName"
                          value={paymentData.cardName}
                          onChange={handlePaymentChange}
                          placeholder="JEAN DUPONT"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value.length === 2 && !paymentData.expiryDate.includes('/')) {
                                value += '/';
                              }
                              setPaymentData({...paymentData, expiryDate: value});
                            }}
                            placeholder="MM/AA"
                            maxLength="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 3) {
                                setPaymentData({...paymentData, cvv: value});
                              }
                            }}
                            placeholder="123"
                            maxLength="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center">
                      <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm text-gray-500">Paiement sécurisé SSL</span>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(false)}
                      className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmer le paiement de {selectedType.prix} MAD
                    </button>
                  </div>
                </form>
              )}

              {abonnement && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Votre facture</h3>
                  <PDFDownloadLink
                    document={<FacturePDF abonnement={abonnement} user={user} />}
                    fileName={`facture-abonnement-${abonnement.id}.pdf`}
                    className="inline-flex items-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 text-sm md:text-base"
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