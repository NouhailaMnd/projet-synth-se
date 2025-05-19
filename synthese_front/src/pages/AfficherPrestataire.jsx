import React, { useState, useEffect } from "react";
import axios from "axios";

const AfficherPrestataire = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [filteredPrestataires, setFilteredPrestataires] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [citiesAndRegions, setCitiesAndRegions] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [showForm, setShowForm] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    telephone: "",
    genre: "",
    region: "",
    ville: "",
    quartier: "",
    code_postal: "",
    photo: null,
  });

  useEffect(() => {
    fetchPrestataires();
    axios
      .get("http://localhost:8000/api/prestations")
      .then((res) => setPrestations(res.data))
      .catch((err) => console.error("Erreur chargement prestations :", err));

    fetch("/cities_and_regions_combined.json")
      .then((res) => res.json())
      .then((data) => {
        setCitiesAndRegions(data);
        const uniqueRegions = Array.from(
          new Map(data.map((item) => [item.region.id, item.region.name])).entries()
        ).map(([id, name]) => ({ id, name }));
        setRegions(uniqueRegions);
      })
      .catch((err) => console.error("Erreur chargement villes/régions :", err));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredPrestataires(
      prestataires.filter((p) =>
        p.user?.name?.toLowerCase().includes(term) ||
        p.user?.email?.toLowerCase().includes(term) ||
        p.telephone?.toLowerCase().includes(term) ||
        p.genre?.toLowerCase().includes(term) ||
        p.ville?.toLowerCase().includes(term) ||
        p.quartier?.toLowerCase().includes(term) ||
        p.code_postal?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, prestataires]);
const handleImageClick = (imageUrl) => {
    setPopupImage(imageUrl);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupImage(null);
  };
  const fetchPrestataires = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/prestataires");
      setPrestataires(res.data);
    } catch (err) {
      console.error("Erreur chargement prestataires :", err);
    }
  };

  const toggleForm = () => {
    setFormData({
      id: null,
      name: "",
      email: "",
      password: "",
      telephone: "",
      genre: "",
      region: "",
      ville: "",
      quartier: "",
      code_postal: "",
      photo: null,
    });
    setFilteredCities([]);
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "region") {
        const filtered = citiesAndRegions.filter(
          (city) => city.region.name === value
        );
        setFilteredCities(filtered);
        updatedForm.ville = "";
      }
      return updatedForm;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };



  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.telephone 
     
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    for (let key in formData) {
      if (key === "prestations") {
        formData.prestations.forEach((id) => data.append("prestations[]", id));
      } else if (formData[key] !== null && (key !== "password" || !formData.id)) {
        data.append(key, formData[key]);
      }
    }

    try {
      const url = formData.id
        ? `http://localhost:8000/api/prestataires/${formData.id}?_method=PUT`
        : "http://localhost:8000/api/prestataires";

      await axios.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchPrestataires();
      toggleForm();
    } catch (err) {
      console.error("Erreur enregistrement :", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/prestataires/${id}`);
      setPrestataires(prestataires.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      id: p.id,
      name: p.user?.name || "",
      email: p.user?.email || "",
      password: "",
      telephone: p.telephone,
      genre: p.genre,
      region: p.region,
      ville: p.ville,
      quartier: p.quartier,
      code_postal: p.code_postal,
      photo: null,
    });
    const filtered = citiesAndRegions.filter(
      (city) => city.region.name === p.region
    );
    setFilteredCities(filtered);
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-20 border-b pb-2">
        Liste des Prestataires
      </h2>
      <button
        onClick={toggleForm}
        className="bg-blue-600 text-white px-4 py-1 text-sm rounded hover:bg-blue-800 mb-4"
      >
        + Ajouter un Prestataire
      </button>
      <button
        onClick={() => setShowSearchInput(!showSearchInput)}
        className="text-indigo-500 absolute right-10"
      >
        <span 
        className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-800 ml-2"
        >
          🔍
        </span>
      </button>

      {showSearchInput && (
        <input
          type="text"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 mb-4 mt-2 rounded"
        />
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            {["name", "email", ...(formData.id ? [] : ["password"]), "telephone", "quartier", "code_postal"].map((field) => (
              <input
                key={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                value={formData[field]}
                onChange={handleInputChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
            ))}

            <div className="col-span-2">
              <label>Genre</label>
              <div className="flex space-x-4">
                {["homme", "femme"].map((g) => (
                  <label key={g} className="flex items-center">
                    <input
                      type="radio"
                      name="genre"
                      value={g}
                      checked={formData.genre === g}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label>Région</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Région --</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Ville</label>
              <select
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Ville --</option>
                {filteredCities.map((v, idx) => (
                  <option key={idx} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label>Photo</label>
              <input type="file" onChange={handlePhotoChange} className="w-full" />
            </div>

           
          </div>

          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800">
            {formData.id ? "Modifier" : "Ajouter"}
          </button>
        </form>
      )}

           <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr className=" text-left">
            <th className="p-2 ">Photo</th>
            <th className="p-2 ">Nom</th>
                        <th className="p-2 ">Genre</th>

            <th className="p-2 ">Email</th>
            <th className="p-2 ">Téléphone</th>
            <th className="p-2 ">Ville</th>
            <th className="p-2 ">Région</th>
            <th className="p-2 ">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrestataires.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">
                {p.photo && (
                  <img
                    src={p.photo}
                    alt={p.user?.name}
                    className="h-10 w-10 object-cover rounded-full cursor-pointer"
                    onClick={() => handleImageClick(p.photo)}
                  />
                )}
              </td>
              <td className="p-2 border">{p.user?.name}</td>
                            <td className="p-2 border">{p.genre}</td>

              <td className="p-2 border">{p.user?.email}</td>
              <td className="p-2 border">{p.telephone}</td>
              <td className="p-2 border">{p.ville}</td>
              <td className="p-2 border">{p.region}</td>
             
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  ✏
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup for displaying the image */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full p-1"
            >
              X
            </button>
            <img src={popupImage} alt="Popup Image" className="max-w-full max-h-96 object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AfficherPrestataire;
