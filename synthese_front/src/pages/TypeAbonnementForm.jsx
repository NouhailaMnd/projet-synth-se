import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
const options = [
  'Abonnement mensuel',
  'Abonnement trimestriel',
  'Abonnement semestriel',
  'Abonnement annuel',
];
 
export default function TypeAbonnementForm() {
  const [type, setType] = useState('');
  const [prix, setPrix] = useState('');
  const [editId, setEditId] = useState(null);
  const [abonnements, setAbonnements] = useState([]);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
 
  const fetchAbonnements = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const res = await axios.get('/api/type-abonnements', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAbonnements(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };
 
  useEffect(() => {
    fetchAbonnements();
  }, []);
 
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!type || !prix || isNaN(prix)) {
      alert("Le type est requis et le prix doit être un nombre.");
      return;
    }
 
    const token = sessionStorage.getItem('token');
    const data = { type, prix };
 
    try {
      if (editId) {
        await axios.put(`/api/type-abonnements/${editId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/type-abonnements', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
 
      resetForm();
      fetchAbonnements();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    }
  };
 
  const resetForm = () => {
    setType('');
    setPrix('');
    setEditId(null);
    setErrors({});
  };
 
  const handleEdit = (item) => {
    setType(item.type);
    setPrix(item.prix);
    setEditId(item.id);
    setShowForm(true);
    setErrors({});
  };
 
  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };
 
  const handleDelete = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`/api/type-abonnements/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchAbonnements();
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };
 
  const filteredAbonnements = abonnements.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.type.toLowerCase().includes(term) ||
      item.prix.toString().includes(term) ||
      item.duree_mois?.toString().includes(term)
    );
  });
 
  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-20 border-b pb-2">
        Gestion des abonnements
      </h2>
 
      <div className="flex items-center mb-4">
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-1 text-sm rounded hover:bg-blue-800 mr-4"
        >
          {showForm ? 'Annuler' : '+ Ajouter abonnement'}
        </button>
 
        <div className="relative flex flex-col items-end ml-auto">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-gray-600 hover:text-black text-xl"
          >
            🔍
          </button>
          {showSearch && (
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2 p-2 border rounded w-64"
              autoFocus
            />
          )}
        </div>
      </div>
 
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 border p-4 rounded bg-gray-50">
          <select
            value={type}
            onChange={handleTypeChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choisir un type --</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
 
          <input
            type="text"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="Prix"
            className="w-full p-2 border rounded"
          />
          {errors.prix && <p className="text-red-500 text-sm">{errors.prix}</p>}
 
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 text-sm rounded hover:bg-blue-800"
          >
            {editId ? 'Modifier' : 'Ajouter'}
          </button>
        </form>
      )}
 
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Prix</th>
            <th className="border px-2 py-1">Durée (mois)</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAbonnements.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.type}</td>
              <td className="border px-2 py-1">{item.prix}</td>
              <td className="border px-2 py-1">{item.duree_mois}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  ✏
                </button>
                <button
                  onClick={() => handleDeleteConfirmation(item.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm text-center">
            <p className="mb-4">Confirmer la suppression de cet abonnement ?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}