import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrestationForm = ({ prestation, onSave }) => {
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
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6 border border-gray-200 max-w-xl">
      <h3 className="text-lg font-semibold mb-4 text-blue-900">
        Ajouter une Prestation
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
        <button type="submit" className="bg-blue-900 text-white px-3 py-1 text-sm rounded hover:bg-blue-800">
          Ajouter
        </button>
      </div>
    </form>
  );
};

const AfficherPrestations = () => {
  const [prestations, setPrestations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [prestationToDelete, setPrestationToDelete] = useState(null);

  useEffect(() => {
    axios
      .get('/api/prestations')
      .then((res) => setPrestations(res.data))
      .catch((err) => console.error('Erreur chargement prestations:', err));
  }, []);

  const handleAddPrestation = (newPrestation) => {
    axios
      .post('/api/prestations', newPrestation)
      .then((res) => {
        setPrestations((prev) => [...prev, res.data]);
        setIsAdding(false);
      })
      .catch((err) => {
        console.error('Erreur ajout prestation:', err);
        alert('Erreur lors de l’ajout');
      });
  };

  const handleChange = (id, field, value) => {
    setPrestations((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: field === 'disponible' ? !p.disponible : value } : p
      )
    );
  };

  const handleUpdate = (prestation) => {
    axios
      .put(`/api/prestations/${prestation.id}`, prestation)
      .then(() => setEditingId(null))
      .catch((err) => {
        console.error('Erreur mise à jour prestation:', err);
        alert('Erreur mise à jour');
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
        })
        .catch((err) => {
          console.error('Erreur suppression prestation:', err);
          alert('Erreur suppression');
        });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Liste des Prestations</h2>

      <button
        onClick={() => setIsAdding(!isAdding)}
        className="bg-blue-900 text-white px-4 py-1 text-sm rounded hover:bg-blue-800 mb-4"
      >
        + Ajouter une prestation
      </button>

      {isAdding && <PrestationForm onSave={handleAddPrestation} />}

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
            {prestations.map((p) => (
              <tr key={p.id} className="border-t hover:bg-blue-50">
                <td className="p-1 text-xs">
                  {editingId === p.id ? (
                    <input
                      type="text"
                      value={p.nom}
                      onChange={(e) => handleChange(p.id, 'nom', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    p.nom
                  )}
                </td>
                <td className="p-1 text-xs">
                  {editingId === p.id ? (
                    <input
                      type="text"
                      value={p.description}
                      onChange={(e) => handleChange(p.id, 'description', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    p.description
                  )}
                </td>
                <td className="p-1 text-xs text-center">
                  {editingId === p.id ? (
                    <input
                      type="checkbox"
                      checked={p.disponible}
                      onChange={() => handleChange(p.id, 'disponible')}
                      className="accent-blue-900"
                    />
                  ) : p.disponible ? 'Oui' : 'Non'}
                </td>
                <td className="p-1 text-xs flex space-x-1">
                  {editingId === p.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(p)}
                        className="bg-blue-900 text-white px-2 py-1 text-xs rounded hover:bg-blue-800"
                      >
                        💾
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-600 text-white px-2 py-1 text-xs rounded hover:bg-gray-700"
                      >
                        ❌
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(p.id)}
                        className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => { setIsDeleteModalOpen(true); setPrestationToDelete(p); }}
                        className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                      >
                        🗑
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-900">Êtes-vous sûr de vouloir supprimer cette prestation ?</h3>
            <div className="mt-4 flex justify-center space-x-4">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Oui, supprimer</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AfficherPrestations;
