import React, { useState, useEffect } from "react";
import axios from "axios";

const AfficherPrestataires = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [filteredPrestataires, setFilteredPrestataires] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    prestations: [],
    photo: null,
  });
  const [prestations, setPrestations] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);  // Ajout de l'état pour l'affichage du champ de recherche

  useEffect(() => {
    fetchPrestataires();
    axios.get("http://localhost:8000/api/prestations")
      .then((response) => setPrestations(response.data))
      .catch((error) => console.error("Erreur lors du chargement des prestations :", error));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredPrestataires(
      prestataires.filter((prestataire) =>
        prestataire.user?.name?.toLowerCase().includes(term) ||
        prestataire.user?.email?.toLowerCase().includes(term) ||
        prestataire.telephone?.toLowerCase().includes(term) ||
        prestataire.genre?.toLowerCase().includes(term) ||
        prestataire.prestations?.some((p) => p.nom.toLowerCase().includes(term)) ||
        prestataire.ville?.toLowerCase().includes(term) ||
        prestataire.quartier?.toLowerCase().includes(term) ||
        prestataire.code_postal?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, prestataires]);

  const fetchPrestataires = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/prestataires");
      setPrestataires(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des prestataires :", error);
    }
  };

  const toggleForm = () => {
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
      prestations: [],
      photo: null,
    });
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
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

    const formDataToSend = new FormData();
    for (let key in formData) {
      if (key === 'prestations') {
        formData[key].forEach((id) => formDataToSend.append('prestations[]', id));
      } else if (formData[key] !== null && (key !== 'password' || !formData.id)) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const url = formData.id
        ? `http://localhost:8000/api/prestataires/${formData.id}?_method=PUT`
        : "http://localhost:8000/api/prestataires";

      await axios.post(url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchPrestataires();
      toggleForm();
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
      password: '',
      telephone: prestataire.telephone,
      genre: prestataire.genre,
      pays: prestataire.pays,
      ville: prestataire.ville,
      quartier: prestataire.quartier,
      code_postal: prestataire.code_postal,
      prestations: prestataire.prestations?.map((p) => p.id.toString()) || [],
      photo: null,
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-20 border-b pb-2">
        Liste des Prestataires</h2>
      <button onClick={toggleForm} 
      className="bg-blue-600 text-white px-4 py-1 text-sm rounded hover:bg-blue-800 mb-4">
        + Ajouter un Prestataire
      </button>
<button onClick={() => setShowSearchInput(!showSearchInput)}   className="text-indigo-500 absolute right-10">

          <span    
        className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-800 ml-2"
            >🔍</span>
        </button>    

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-indigo-800">
            {formData.id ? "Modifier Prestataire" : "Nouveau Prestataire"}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {['name', 'email', ...(formData.id ? [] : ['password']), 'telephone', 'genre', 'pays', 'ville', 'quartier', 'code_postal'].map(field => (
              <input
                key={field}
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                value={formData[field]}
                onChange={handleInputChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
            ))}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo :</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </div>

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
            <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-800 transition-all">
              Sauvegarder
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-800 text-white px-4 py-2 text-sm rounded-md hover:bg-gray-700 transition-all">
              Annuler
            </button>
          </div>
        </div>
      )}

        <div className="mb-6 flex justify-end items-center gap-2">
        
        {showSearchInput && (
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full max-w-md p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-xl shadow text-sm table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left text-xs w-20">Photo</th>
              <th className="p-2 text-left text-xs w-28">Nom</th>
              <th className="p-2 text-left text-xs w-30">Email</th>
              <th className="p-2 text-left text-xs w-24">Téléphone</th>
              <th className="p-2 text-left text-xs w-16">Genre</th>
              <th className="p-2 text-left text-xs w-36">Prestation</th>
              <th className="p-2 text-left text-xs w-28">Ville</th>
              <th className="p-2 text-left text-xs w-28">Quartier</th>
              <th className="p-2 text-left text-xs w-24">Code postal</th>
              <th className="p-2 text-left text-xs w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrestataires.length > 0 ? (
              filteredPrestataires.map((prestataire) => (
                <tr key={prestataire.id} className="border-t hover:bg-gray-50 transition-all">
                  <td className="py-4 px-2 w-20">
                    {prestataire.photo ? (
                      <img
                        src={prestataire.photo}
                        alt="photo"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <img
                        src="/images/default.jpg"
                        alt="photo par défaut"
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-4 px-2 w-28">{prestataire.user?.name || "Nom non disponible"}</td>
                  <td className="py-4 px-2 w-30">{prestataire.user?.email || "Email non disponible"}</td>
                  <td className="py-4 px-2 w-24">{prestataire.telephone}</td>
                  <td className="py-4 px-2 w-16">{prestataire.genre}</td>
                  <td className="py-4 px-2 w-36">
                    {prestataire.prestations?.length
                      ? prestataire.prestations.map((p) => p.nom).join(", ")
                      : "Aucune prestation"}
                  </td>
                  <td className="py-4 px-2 w-28">{prestataire.ville}</td>
                  <td className="py-4 px-2 w-28">{prestataire.quartier}</td>
                  <td className="py-4 px-2 w-24">{prestataire.code_postal}</td>
                  <td className="py-4 px-2 w-32 flex space-x-3">
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
                <td colSpan="10" className="py-4 px-6 text-center text-gray-500">Aucun prestataire trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AfficherPrestataires;
