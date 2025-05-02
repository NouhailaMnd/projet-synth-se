import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const AfficherPrestataires = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editPrestataire, setEditPrestataire] = useState({});
  const [newPrestataire, setNewPrestataire] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    genre: '',
    cin: '',
    adresse: '',
    telephone: '',
    disponibilites: [],
  });

  useEffect(() => {
    axios.get('/api/prestataires')
      .then(response => setPrestataires(response.data))
      .catch(error => console.error('Erreur chargement prestataires:', error));
  }, []);

  const formatDateISO = (date) =>
    new Date(date).toISOString().split('T')[0]; // format YYYY-MM-DD

  const handleCalendarChange = (dates) => {
    let formattedDates = [];
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      const current = new Date(start);
      while (current <= end) {
        formattedDates.push(formatDateISO(current));
        current.setDate(current.getDate() + 1);
      }
    } else {
      formattedDates = [formatDateISO(dates)];
    }

    if (isEditing) {
      setEditPrestataire((prev) => ({ ...prev, disponibilites: formattedDates }));
    } else if (isAdding) {
      setNewPrestataire((prev) => ({ ...prev, disponibilites: formattedDates }));
    }
  };

  const handleEdit = (p) => {
    setEditPrestataire({
      id: p.id,
      name: p.user?.name || '',
      email: p.user?.email || '',
      genre: p.genre,
      cin: p.cin,
      adresse: p.adresse,
      telephone: p.telephone,
      disponibilites: p.disponibilites || [],
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      axios.delete(`/api/prestataires/${id}`)
        .then(() => setPrestataires(prestataires.filter(p => p.id !== id)))
        .catch(error => console.error('Erreur suppression:', error));
    }
  };

  const handleAddChange = (e) => {
    setNewPrestataire({ ...newPrestataire, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setEditPrestataire({ ...editPrestataire, [e.target.name]: e.target.value });
  };

  const handleAddPrestataire = () => {
    if (!newPrestataire.name || !newPrestataire.email || !newPrestataire.telephone) {
      return alert('Champs obligatoires manquants');
    }

    axios.post('/api/users', {
      name: newPrestataire.name,
      email: newPrestataire.email,
      role: newPrestataire.role,
      password: newPrestataire.password,
    })
      .then((res) => {
        const userId = res.data.id;
        return axios.post('/api/prestataires', {
          ...newPrestataire,
          user_id: userId,
        });
      })
      .then((res) => {
        setPrestataires([...prestataires, res.data]);
        setNewPrestataire({
          name: '', email: '', role: '', password: '',
          genre: '', cin: '', adresse: '', telephone: '', disponibilites: []
        });
        setIsAdding(false);
      })
      .catch((err) => {
        console.error('Erreur ajout:', err);
        alert('Erreur lors de l’ajout');
      });
  };

  const handleSave = () => {
    axios.put(`/api/prestataires/${editPrestataire.id}`, editPrestataire)
      .then((res) => {
        setPrestataires(prestataires.map(p =>
          p.id === editPrestataire.id ? res.data : p
        ));
        setIsEditing(false);
      })
      .catch((err) => {
        console.error('Erreur maj:', err);
        alert('Erreur lors de la mise à jour');
      });
  };

  return (
    <div className="p-4 text-sm bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Liste des Prestataires</h2>

      <button onClick={() => setIsAdding(true)} className="mb-4 bg-green-500 text-white px-4 py-2 rounded">
        Ajouter Prestataire
      </button>

      {isAdding && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Nouveau Prestataire</h3>
          {['name', 'email', 'role', 'password', 'genre', 'cin', 'adresse', 'telephone'].map((field) => (
            <input key={field}
              name={field}
              value={newPrestataire[field] || ''}
              onChange={handleAddChange}
              placeholder={field}
              className="block w-full mb-2 p-2 border rounded"
            />
          ))}
          <div className="mb-2">
            <label>Disponibilités :</label>
            <Calendar onChange={handleCalendarChange} selectRange />
          </div>
          <button onClick={handleAddPrestataire} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Ajouter</button>
          <button onClick={() => setIsAdding(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
        </div>
      )}

      {isEditing && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Modifier Prestataire</h3>
          {['name', 'email', 'genre', 'cin', 'adresse', 'telephone'].map((field) => (
            <input key={field}
              name={field}
              value={editPrestataire[field] || ''}
              onChange={handleChange}
              placeholder={field}
              className="block w-full mb-2 p-2 border rounded"
            />
          ))}
          <div className="mb-2">
            <label>Disponibilités :</label>
            <Calendar onChange={handleCalendarChange} selectRange />
          </div>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Sauvegarder</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
        </div>
      )}

      <table className="w-full bg-white rounded shadow text-xs">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Nom</th>
            <th>Email</th>
            <th>Genre</th>
            <th>CIN</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Disponibilités</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prestataires.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.user?.name}</td>
              <td>{p.user?.email}</td>
              <td>{p.genre}</td>
              <td>{p.cin}</td>
              <td>{p.adresse}</td>
              <td>{p.telephone}</td>
              <td>
                {Array.isArray(p.disponibilites) && p.disponibilites.length > 0
                  ? p.disponibilites.map((d, i) => (
                      <div key={i}>{new Date(d).toLocaleDateString()}</div>
                    ))
                  : 'Non défini'}
              </td>
              <td>
                <button onClick={() => handleEdit(p)} className="bg-yellow-400 px-2 py-1 mr-1 text-white rounded">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-500 px-2 py-1 text-white rounded">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
          {prestataires.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">Aucun prestataire trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AfficherPrestataires;
