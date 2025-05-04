import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AfficherPrestataires = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPrestataire, setNewPrestataire] = useState({
    name: '', email: '', password: '', genre: '',
    telephone: '', pays: '', ville: '', quartier: '',
    code_postal: '', prestation_id: '',
  });
  const [editPrestataire, setEditPrestataire] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prestataireToDelete, setPrestataireToDelete] = useState(null);

  const fetchData = () => {
    axios.get('/api/prestataires')
      .then(res => {
        const { prestataires, prestations } = res.data;
        if (Array.isArray(prestataires)) setPrestataires(prestataires);
        if (Array.isArray(prestations)) setPrestations(prestations);
      })
      .catch(err => console.error('Erreur chargement données:', err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const prestationsDisponibles = prestations.filter(p => p.disponible === 1 || p.disponible === true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPrestataire(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPrestataire = () => {
    axios.post('/api/prestataires', newPrestataire)
      .then(() => {
        fetchData();
        setIsAdding(false);
        setNewPrestataire({
          name: '', email: '', password: '', genre: '',
          telephone: '', pays: '', ville: '', quartier: '',
          code_postal: '', prestation_id: '',
        });
      })
      .catch(err => {
        console.error('Erreur ajout prestataire:', err);
        alert("Erreur lors de l'ajout.");
      });
  };

  const handleEditClick = (p) => {
    setEditPrestataire({
      ...p,
      name: p.user?.name || '',
      email: p.user?.email || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPrestataire(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePrestataire = () => {
    axios.put(`/api/prestataires/${editPrestataire.id}`, editPrestataire)
      .then(() => {
        fetchData();
        setEditPrestataire(null);
      })
      .catch(err => {
        console.error('Erreur modification prestataire:', err);
        alert("Erreur lors de la modification.");
      });
  };

  const handleDeletePrestataire = () => {
    if (prestataireToDelete) {
      axios.delete(`/api/prestataires/${prestataireToDelete.id}`)
        .then(() => {
          fetchData();
          setIsDeleteModalOpen(false);
          setPrestataireToDelete(null);
        })
        .catch(err => {
          console.error('Erreur suppression prestataire:', err);
          alert("Erreur lors de la suppression.");
        });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Gestion des Prestataires</h2>

      <button
        onClick={() => setIsAdding(true)}
        className="bg-blue-900 text-white px-4 py-1 text-xs rounded hover:bg-blue-800 mb-4"
      >
        + Ajouter un prestataire
      </button>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">Nouveau Prestataire</h3>
          <div className="grid grid-cols-2 gap-4">
            {['name', 'email', 'password', 'genre', 'telephone', 'pays', 'ville', 'quartier', 'code_postal'].map(field => (
              <input
                key={field}
                name={field}
                value={newPrestataire[field] || ''}
                onChange={handleChange}
                placeholder={field}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 text-xs"
              />
            ))}
            <select
              name="prestation_id"
              value={newPrestataire.prestation_id}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 text-xs"
            >
              <option value="">Choisir une prestation</option>
              {prestationsDisponibles.map(p => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 space-x-2">
            <button onClick={handleAddPrestataire} className="bg-blue-900 text-white px-3 py-1 text-xs rounded hover:bg-blue-800">Ajouter</button>
            <button onClick={() => setIsAdding(false)} className="bg-black text-white px-3 py-1 text-xs rounded hover:bg-gray-800">Annuler</button>
          </div>
        </div>
      )}

      {/* Table des Prestataires */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-xl shadow text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-1 text-left text-xs">Nom</th>
              <th className="p-1 text-left text-xs">Email</th>
              <th className="p-1 text-left text-xs">Téléphone</th>
              <th className="p-1 text-left text-xs">Genre</th>
              <th className="p-1 text-left text-xs">Prestation</th>
              <th className="p-1 text-left text-xs">Ville</th>
              <th className="p-1 text-left text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {prestataires.map(p => (
              <tr key={p.id} className="border-t hover:bg-blue-50">
                {editPrestataire?.id === p.id ? (
                  <>
                    <td className="p-1"><input name="name" value={editPrestataire.name} onChange={handleEditChange} className="w-full p-1 border rounded text-xs" /></td>
                    <td className="p-1"><input name="email" value={editPrestataire.email} onChange={handleEditChange} className="w-full p-1 border rounded text-xs" /></td>
                    <td className="p-1"><input name="telephone" value={editPrestataire.telephone} onChange={handleEditChange} className="w-full p-1 border rounded text-xs" /></td>
                    <td className="p-1">
                      <select name="genre" value={editPrestataire.genre} onChange={handleEditChange} className="w-full p-1 border rounded text-xs">
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                    </td>
                    <td className="p-1">
                      <select name="prestation_id" value={editPrestataire.prestation_id} onChange={handleEditChange} className="w-full p-1 border rounded text-xs">
                        {prestations.map(pre => (
                          <option key={pre.id} value={pre.id}>{pre.nom}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-1"><input name="ville" value={editPrestataire.ville} onChange={handleEditChange} className="w-full p-1 border rounded text-xs" /></td>
                    <td className="p-1 flex space-x-2">
                      <button onClick={handleUpdatePrestataire} className="bg-blue-900 text-white px-2 py-1 text-xs rounded hover:bg-blue-800">💾</button>
                      <button onClick={() => setEditPrestataire(null)} className="bg-gray-600 text-white px-2 py-1 text-xs rounded hover:bg-gray-700">✖</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-1 text-xs">{p.user?.name}</td>
                    <td className="p-1 text-xs">{p.user?.email}</td>
                    <td className="p-1 text-xs">{p.telephone}</td>
                    <td className="p-1 text-xs">{p.genre}</td>
                    <td className="p-1 text-xs">{prestations.find(pre => pre.id === p.prestation_id)?.nom || '—'}</td>
                    <td className="p-1 text-xs">{p.ville}</td>
                    <td className="p-1 text-xs flex space-x-2">
                      <button onClick={() => handleEditClick(p)} className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600">✏</button>
                      <button onClick={() => { setIsDeleteModalOpen(true); setPrestataireToDelete(p); }} className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700">🗑</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-900">Êtes-vous sûr de vouloir supprimer ce prestataire ?</h3>
            <div className="mt-4 flex justify-center space-x-4">
              <button onClick={handleDeletePrestataire} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Oui, supprimer</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AfficherPrestataires;
