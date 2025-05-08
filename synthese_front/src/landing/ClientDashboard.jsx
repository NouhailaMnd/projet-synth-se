import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../layouts/NavBar';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({});
  const [userData, setUserData] = useState({});
  const [clientData, setClientData] = useState({});
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user?.id) return;

    axios.get(`http://localhost:8000/api/user/${user.id}`)
      .then(res => {
        const { user, client } = res.data;
        setUserData(user);
        setClientData(client);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          numero_telephone: client?.numero_telephone || '',
          pays: client?.pays || '',
          ville: client?.ville || '',
          quartier: client?.quartier || '',
          code_postal: client?.code_postal || '',
        });
      });

    axios.get(`http://localhost:8000/api/user/${user.id}/reservations`)
      .then(res => setReservations(res.data));

    axios.get(`http://localhost:8000/api/user/${user.id}/paiements`)
      .then(res => setPaiements(res.data));
  }, []);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user?.id) return;

    console.log('user.id', user.id);
    console.log('formData', formData);

    axios.post(`http://localhost:8000/api/user/${user.id}/update`, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(() => alert("Profil mis à jour avec succès !"))
      .catch((error) => {
        console.error(error.response?.data || error.message);
        alert("Erreur lors de la mise à jour");
      });
  };

  const renderProfile = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <div className="space-y-4">
          {[
            { label: 'Nom complet', name: 'name' },
            { label: 'Email', name: 'email' },
            { label: 'Téléphone', name: 'numero_telephone' },
            { label: 'Pays', name: 'pays' },
            { label: 'Ville', name: 'ville' },
            { label: 'Quartier', name: 'quartier' },
            { label: 'Code postal', name: 'code_postal' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium">{field.label}</label>
              <input
                name={field.name}
                className="w-full p-2 border rounded"
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Mettre à jour
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h2 className="text-xl font-semibold mb-4">Votre profil</h2>
        <span className="text-6xl">🧑</span>
        <h3 className="mt-4 text-lg font-semibold">{formData.name}</h3>
        <p className="text-sm text-gray-500">
          Client depuis {userData.created_at ? new Date(userData.created_at).getFullYear() : '...'}
        </p>
        <div className="mt-4 text-left">
          <p>📧 {formData.email}</p>
          <p>📞 {formData.numero_telephone || 'Non renseigné'}</p>
          <p>📍 {formData.ville || 'Adresse non renseignée'}</p>
        </div>
      </div>
    </div>
  );

  const renderReservations = () => (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Mes réservations</h2>
      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map(r => (
            <div key={r.id} className="p-4 border rounded">
              <h3 className="text-lg font-semibold">{r.service_nom}</h3>
              <p className="text-sm text-gray-500">Prestataire : {r.prestataire_nom}</p>
              <p>Durée : {r.duree}</p>
              <p>Date : {r.date_reservation}</p>
              <p className="font-semibold">Statut : {r.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFacturation = () => (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Historique de paiements</h2>
      {paiements.length === 0 ? (
        <p>Aucune facture disponible.</p>
      ) : (
        <div className="divide-y">
          {paiements.map((p, i) => (
            <div key={i} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Réservation #{p.reservation_id}</p>
                <p className="text-sm text-gray-500">{p.date_paiement}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-semibold">{p.montant} €</p>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded">Facture</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-4 mb-6">
          {['profile', 'reservations', 'facturation'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'profile' ? 'Mon Profil' : tab === 'reservations' ? 'Mes Réservations' : 'Facturation'}
            </button>
          ))}
        </div>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'reservations' && renderReservations()}
        {activeTab === 'facturation' && renderFacturation()}
      </div>
    </>
  );
}
