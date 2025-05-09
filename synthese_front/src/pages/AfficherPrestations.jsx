import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const PrestationForm = ({ prestation, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    description: '',
    disponible: true,
  });

  useEffect(() => {
    if (prestation) {
      setFormData({
        id: prestation.id,
        nom: prestation.nom,
        description: prestation.description,
        disponible: prestation.disponible,
      });
    } else {
      setFormData({
        id: '',
        nom: '',
        description: '',
        disponible: true,
      });
    }
  }, [prestation]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prestation && !formData.id) {
      alert("L'ID de la prestation est manquant !");
      return;
    }
    onSave(formData, () => {
      // Reset après sauvegarde (si création)
      setFormData({
        id: '',
        nom: '',
        description: '',
        disponible: true,
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6 border border-gray-200 max-w-xl">
      <h3 className="text-lg font-semibold mb-4 text-blue-900">
        {prestation ? 'Modifier une Prestation' : 'Ajouter une Prestation'}
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block font-medium text-black">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-black">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          />
        </div>
        <div className="flex items-center">
          <label className="text-black font-medium mr-2">Disponible</label>
          <input
            type="checkbox"
            name="disponible"
            checked={formData.disponible}
            onChange={handleChange}
            className="accent-blue-900"
          />
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-900 text-white px-3 py-1 text-sm rounded hover:bg-blue-800">
            {prestation ? 'Enregistrer' : 'Ajouter'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-3 py-1 text-sm rounded hover:bg-gray-600"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

const AfficherPrestations = () => {
  const [prestations, setPrestations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPrestation, setEditingPrestation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prestationToDelete, setPrestationToDelete] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios
      .get('/api/prestations')
      .then((res) => setPrestations(res.data))
      .catch((err) => console.error('Erreur chargement prestations:', err));
  }, []);

  const handleAddPrestation = (newPrestation, resetForm) => {
    axios
      .post('/api/prestations', newPrestation)
      .then((res) => {
        setPrestations((prev) => [...prev, res.data]);
        setIsAdding(false);
        resetForm();
        showSuccess('Prestation ajoutée avec succès !');
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Erreur lors de l’ajout';
        alert(`Erreur : ${message}`);
      });
  };

  const handleUpdatePrestation = (updated, resetForm) => {
    axios
      .put(`/api/prestations/${updated.id}`, updated)
      .then(() => {
        setPrestations((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditingPrestation(null);
        showSuccess('Prestation modifiée avec succès !');
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Erreur mise à jour';
        alert(`Erreur : ${message}`);
      });
  };

  const handleDelete = () => {
    if (prestationToDelete) {
      axios
        .delete(`/api/prestations/${prestationToDelete.id}`)
        .then(() => {
          setPrestations((prev) => prev.filter((p) => p.id !== prestationToDelete.id));
          setIsDeleteModalOpen(false);
          setPrestationToDelete(null);
          showSuccess('Prestation supprimée.');
        })
        .catch((err) => {
          const message = err.response?.data?.message || 'Erreur suppression';
          alert(`Erreur : ${message}`);
        });
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredPrestations = useMemo(() => {
    return prestations.filter((p) =>
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, prestations]);

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
<h2 className="text-2xl font-bold text-blue-900 mb-6 mt-20 border-b pb-2">
        Liste des Prestations</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4 border border-green-400 text-sm">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingPrestation(null);
          }}
          className="bg-blue-900 text-white px-4 py-1 text-sm rounded hover:bg-blue-800"
        >
          + Ajouter une prestation
        </button>

        <button
          onClick={() => setShowSearchBar((prev) => !prev)}
          className="ml-2 text-blue-900 text-xl"
          title="Rechercher"
        >
          🔍
        </button>
      </div>
        <div className="mb-6 flex justify-end items-center gap-2">

      {showSearchBar && (
        <input
          type="text"
          placeholder="Rechercher par nom, description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full max-w-md p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
        />
      )}
      </div>

      {isAdding && <PrestationForm onSave={handleAddPrestation} onCancel={() => setIsAdding(false)} />}

      {editingPrestation && (
        <PrestationForm
          prestation={editingPrestation}
          onSave={handleUpdatePrestation}
          onCancel={() => setEditingPrestation(null)}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-xl shadow text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-2 text-left text-xs">Nom</th>
              <th className="p-2 text-left text-xs">Description</th>
              <th className="p-2 text-left text-xs">Disponible</th>
              <th className="p-2 text-left text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrestations.map((p) => (
              <tr key={p.id} className="border-t hover:bg-blue-50">
                <td className="p-2 text-xs">{p.nom}</td>
                <td className="p-2 text-xs">{p.description}</td>
                <td className="p-2 text-xs text-center">{p.disponible ? 'Oui' : 'Non'}</td>
                <td className="p-2 text-xs flex space-x-1">
                  <button
                    onClick={() => {
                      setEditingPrestation(p);
                      setIsAdding(false);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600"
                  >
                    ✏
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setPrestationToDelete(p);
                    }}
                    className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Êtes-vous sûr de vouloir supprimer cette prestation ?
            </h3>
            <div className="mt-4 flex justify-center space-x-4">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Oui, supprimer
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AfficherPrestations;
