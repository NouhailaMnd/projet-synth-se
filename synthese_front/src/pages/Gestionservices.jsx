import React, { useState, useEffect } from "react";
import axios from "axios";

const Gestionservices = () => {
  const [services, setServices] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    prestation_id: "",
    prix: "",
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Term de recherche
  const [isFilterVisible, setIsFilterVisible] = useState(false); // Contrôle de l'affichage de la barre de recherche

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des services :", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchServices();
      try {
        const prestationsResponse = await axios.get("http://localhost:8000/api/prestations");
        setPrestations(prestationsResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des prestations :", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      try {
        await axios.put(`/api/services/${editId}`, form);
        await fetchServices();
        setForm({ nom: "", description: "", prestation_id: "", prix: "" });
        setEditId(null);
      } catch (error) {
        console.error("Erreur lors de la modification :", error.response || error.message);
      }
    } else {
      try {
        const response = await axios.post("/api/services", form);
        setServices((prev) => [...prev, response.data]);
        setForm({ nom: "", description: "", prestation_id: "", prix: "" });
        setShowForm(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout :", error.response || error.message);
      }
    }
  };

  const handleEdit = (service) => {
    setForm({
      nom: service.nom,
      description: service.description,
      prestation_id: service.prestation_id,
      prix: service.prix,
    });
    setEditId(service.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    axios.delete(`/api/services/${id}`)
      .then(() => {
        setServices(services.filter((service) => service.id !== id));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 mt-20 border-b pb-2">
        Gestion des Services
      </h2>

      {/* Conteneur Flex pour le bouton et l'icône de filtrage */}
      <div className="flex justify-between items-center mb-4">
        {/* Bouton Ajouter un service */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-900 text-white p-2 rounded hover:bg-blue-800"
        >
          {showForm ? "Annuler" : "Ajouter un service"}
        </button>

        {/* Icône de filtre */}
        <span
          className="text-gray-500 text-xl cursor-pointer"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          🔍
        </span>
      </div>

      {/* Affichage de la barre de recherche */}
      {isFilterVisible && (
        <div className="mb-6 flex justify-end items-center gap-2">
          <input
            type="text"
            placeholder="Filtrer par nom, description, prestation ou prix..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Formulaire d'ajout/modification de service */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-4 rounded-xl shadow-lg">
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          ></textarea>
          <select
            name="prestation_id"
            value={form.prestation_id}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          >
            <option value="">Sélectionnez une prestation</option>
            {prestations.map((prestation) => (
              <option key={prestation.id} value={prestation.id}>
                {prestation.nom}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="prix"
            value={form.prix}
            onChange={handleChange}
            placeholder="Prix"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            required
          />
          <button
            type="submit"
            className="bg-blue-900 text-white px-4 py-1 text-sm rounded hover:bg-blue-800 mb-4"
          >
            {editId ? "Modifier" : "Ajouter"} un service
          </button>
        </form>
      )}

      <table className="min-w-full border-collapse border rounded-xl">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="border p-2 text-left text-xs">Nom</th>
            <th className="border p-2 text-left text-xs">Description</th>
            <th className="border p-2 text-left text-xs">Prestation</th>
            <th className="border p-2 text-left text-xs">Prix</th>
            <th className="border p-2 text-left text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services
              .filter(
                (service) =>
                  service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  service.prestation?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  service.prix.toString().includes(searchTerm)
              )
              .map((service) => {
                const prestationNom = service.prestation?.nom || "Aucune prestation";
                return (
                  <tr key={service.id} className="border-t hover:bg-blue-50">
                    <td className="border p-2 text-xs">{service.nom}</td>
                    <td className="border p-2 text-xs">{service.description}</td>
                    <td className="border p-2 text-xs">{prestationNom}</td>
                    <td className="border p-2 text-xs">{service.prix}€</td>
                    <td className="border p-2 text-xs flex space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td colSpan="5" className="border p-2 text-center">Aucun service disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Gestionservices;
