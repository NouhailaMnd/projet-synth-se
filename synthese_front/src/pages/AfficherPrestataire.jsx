import React, { useState, useEffect } from "react";
import axios from "axios";

const AfficherPrestataires = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    telephone: '',
    genre: '',
    pays: '',
    ville: '',
    quartier: '',
    code_postal: '',
    prestations: []
  });
  const [prestations, setPrestations] = useState([]);

  const fetchPrestataires = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/prestataires");
      setPrestataires(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des prestataires :", error);
    }
  };

  useEffect(() => {
    fetchPrestataires();
    axios.get("http://localhost:8000/api/prestations")
      .then((response) => {
        setPrestations(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des prestations :", error);
      });
  }, []);

  const toggleForm = () => setShowForm(!showForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const prestations = prev.prestations.includes(value)
        ? prev.prestations.filter((id) => id !== value)
        : [...prev.prestations, value];
      return { ...prev, prestations };
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.telephone || formData.prestations.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (formData.id) {
        await axios.put(`http://localhost:8000/api/prestataires/${formData.id}`, formData);
      } else {
        await axios.post("http://localhost:8000/api/prestataires", formData);
      }

      await fetchPrestataires();
      setShowForm(false);
      setFormData({
        id: null,
        name: '',
        email: '',
        password: '',
        telephone: '',
        genre: '',
        pays: '',
        ville: '',
        quartier: '',
        code_postal: '',
        prestations: []
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/prestataires/${id}`);
      setPrestataires(prestataires.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (prestataire) => {
    setFormData({
      id: prestataire.id,
      name: prestataire.user?.name || '',
      email: prestataire.user?.email || '',
      telephone: prestataire.telephone,
      genre: prestataire.genre,
      pays: prestataire.pays,
      ville: prestataire.ville,
      quartier: prestataire.quartier,
      code_postal: prestataire.code_postal,
      prestations: prestataire.prestations?.map((p) => p.id.toString()) || []
    });
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-6 mt-20 bg-gray-50 rounded-xl">
      <button onClick={toggleForm} className="bg-blue-900 text-white px-4 py-1 text-sm rounded hover:bg-blue-800 mb-4">
        + Ajouter un Prestataire
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-indigo-800">
            {formData.id ? "Modifier Prestataire" : "Nouveau Prestataire"}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {['name', 'email', 'password', 'telephone', 'genre', 'pays', 'ville', 'quartier', 'code_postal'].map(field => (
              <input
                key={field}
                name={field}
                value={formData[field] || ''}
                onChange={handleInputChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
            ))}

            {/* ✅ LISTE DE CHECKBOXES POUR PRESTATIONS */}
            <div className="border rounded-lg p-3 col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Prestations :</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {prestations.map((prestation) => (
                  <label key={prestation.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={prestation.id.toString()}
                      checked={formData.prestations.includes(prestation.id.toString())}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-800">{prestation.nom}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button onClick={handleSubmit} className="bg-indigo-900 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-800 transition-all">
              Sauvegarder
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-800 text-white px-4 py-2 text-sm rounded-md hover:bg-gray-700 transition-all">
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-xl shadow text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-2 text-left text-xs">Nom</th>
              <th className="p-2 text-left text-xs">Email</th>
              <th className="p-2 text-left text-xs">Téléphone</th>
              <th className="p-2 text-left text-xs">Genre</th>
              <th className="p-2 text-left text-xs">Prestation</th>
              <th className="p-2 text-left text-xs">Ville</th>
              <th className="p-2 text-left text-xs">Quartier</th>
              <th className="p-2 text-left text-xs">Code postal</th>
              <th className="p-2 text-left text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prestataires.length > 0 ? (
              prestataires.map((prestataire) => (
                <tr key={prestataire.id} className="border-t hover:bg-gray-50 transition-all">
                  <td className="py-4 px-6">{prestataire.user?.name || "Nom non disponible"}</td>
                  <td className="py-4 px-6">{prestataire.user?.email || "Email non disponible"}</td>
                  <td className="py-4 px-6">{prestataire.telephone}</td>
                  <td className="py-4 px-6">{prestataire.genre}</td>
                  <td className="py-4 px-6">
                    {prestataire.prestations?.length
                      ? prestataire.prestations.map((p) => p.nom).join(", ")
                      : "Aucune prestation"}
                  </td>
                  <td className="py-4 px-6">{prestataire.ville}</td>
                  <td className="py-4 px-6">{prestataire.quartier}</td>
                  <td className="py-4 px-6">{prestataire.code_postal}</td>
                  <td className="py-4 px-6 flex space-x-3">
                    <button
                      onClick={() => handleEdit(prestataire)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all"
                    >
                      ✏
                    </button>
                    <button
                      onClick={() => handleDelete(prestataire.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td coSpan="9" className="py-4 px-6 text-center text-gray-500">Aucun prestataire trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AfficherPrestataires;
