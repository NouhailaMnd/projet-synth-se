import { useEffect, useState } from "react";
import axios from "axios";

export default function GestionServices() {
  const [form, setForm] = useState({
    nom: "",
    description: "",
    prestation_id: "",
    prix: "",
    photo: null,
  });

  const [prestations, setPrestations] = useState([]);
  const [services, setServices] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState(null);
  useEffect(() => {
    axios.get("http://localhost:8000/api/prestations").then((res) => setPrestations(res.data));
    axios.get("http://localhost:8000/api/services").then((res) => setServices(res.data));
  }, [refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nom", form.nom);
    data.append("description", form.description);
    data.append("prestation_id", form.prestation_id);
    data.append("prix", form.prix);
    if (form.photo instanceof File) {
      data.append("photo", form.photo);
    }

    const url = editingId
      ? `http://localhost:8000/api/services/${editingId}?_method=PUT`
      : "http://localhost:8000/api/services";

    axios
      .post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setAlert({
          type: "success",
          message: `Service ${editingId ? "modifié" : "ajouté"} avec succès !`,
        });
        setForm({
          nom: "",
          description: "",
          prestation_id: "",
          prix: "",
          photo: null,
        });
        setErrors({});
        setEditingId(null);
        setRefresh(!refresh);
        setShowForm(false);
        setTimeout(() => setAlert(null), 800);
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
          setAlert({ type: "error", message: "Erreur de validation !" });
        } else {
          console.error("Erreur :", error);
          setAlert({ type: "error", message: "Une erreur s’est produite." });
        }
        setTimeout(() => setAlert(null), 800);
      });
  };

  const handleEdit = (service) => {
    setForm({
      nom: service.nom,
      description: service.description,
      prestation_id: service.prestation_id,
      prix: service.prix,
      photo: null,
    });
    setEditingId(service.id);
    setShowForm(true);
  };

const handleDelete = (id) => {
  axios
    .delete(`http://localhost:8000/api/services/${id}`)
    .then(() => {
      setAlert({ type: "success", message: "Service supprimé avec succès !" });
      setRefresh(!refresh);
      setTimeout(() => setAlert(null), 800);
    })
    .catch((err) => {
      console.error(err);
      setAlert({ type: "error", message: "Erreur lors de la suppression." });
      setTimeout(() => setAlert(null), 800);
    });
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, photo: file });
  };

  const filteredServices = services.filter((service) => {
    const prestationNom = service.prestation?.nom?.toLowerCase() || "";
    return (
      service.nom.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search) ||
      prestationNom.includes(search) ||
      service.prix.toString().includes(search)
    );
  });
  // Fonction pour afficher l'image dans le popup
  const handleImageClick = (imageUrl) => {
    setPopupImage(imageUrl);
    setIsPopupOpen(true);
  };

  // Fonction pour fermer le popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupImage(null);
  };
  console.log(services);

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-20 border-b pb-2">
        Liste des Services
      </h2>

      {alert && (
        <div
          className={`p-4 mb-4 rounded-lg shadow-lg transition-all ${
            alert.type === "success"
              ? "bg-green-50 border-l-4 border-green-600"
              : "bg-red-50 border-l-4 border-red-600"
          }`}
        >
          <div className="flex items-center">
            <span
              className={`inline-block w-8 h-8 rounded-full flex items-center justify-center ${
                alert.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {alert.type === "success" ? "✔" : "❌"}
            </span>
            <div className="ml-4 text-black">
              <strong className="font-semibold text-lg">
                {alert.type === "success" ? "Opération réussie!" : "Une erreur est survenue!"}
              </strong>
              <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setForm({ nom: "", description: "", prestation_id: "", prix: "", photo: null });
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-4 py-1 text-sm rounded hover:bg-blue-800 mb-4"
        >
          {showForm ? "Fermer le formulaire" : "+ Ajouter un service"}
        </button>

        <button
          onClick={() => setShowSearch(!showSearch)}
        className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-800 ml-2"
        >
          🔍
        </button>
      </div>

      <div className="mb-6 flex justify-end items-center gap-2">
        {showSearch && (
          <input
            type="text"
            placeholder="🔍 Rechercher par nom, description, prestation ou prix"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 text-sm"
          />
        )}
      </div>

      {showForm && (
        <>
          <h2 className="text-2xl font-bold mb-4">{editingId ? "Modifier" : "Ajouter"} un Service</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <input
              type="text"
              placeholder="Nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className={`border p-2 rounded w-full ${errors.nom ? "border-red-500" : ""}`}
            />
            {errors.nom && <p className="text-red-500 text-xs">{errors.nom[0]}</p>}

            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`border p-2 rounded w-full ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description[0]}</p>}

            <select
              value={form.prestation_id}
              onChange={(e) => setForm({ ...form, prestation_id: e.target.value })}
              className={`border p-2 rounded w-full ${errors.prestation_id ? "border-red-500" : ""}`}
            >
              <option value="">-- Sélectionner une prestation --</option>
              {prestations.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom}
                </option>
              ))}
            </select>
            {errors.prestation_id && (
              <p className="text-red-500 text-xs">{errors.prestation_id[0]}</p>
            )}

            <input
              type="number"
              step="0.01"
              placeholder="Prix (€)"
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
              className={`border p-2 rounded w-full ${errors.prix ? "border-red-500" : ""}`}
            />
            {errors.prix && <p className="text-red-500 text-xs">{errors.prix[0]}</p>}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full ${errors.photo ? "border-red-500" : ""}`}
            />
            {errors.photo && <p className="text-red-500 text-xs">{errors.photo[0]}</p>}

            <button
              type="submit"
              className="bg-blue-800 text-white font-semibold py-2 rounded md:col-span-2"
            >
              {editingId ? "Modifier" : "Ajouter"} le service
            </button>
          </form>
        </>
      )}

      <div className="overflow-x-auto">
           <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
             <th className=" px-2 py-1 text-left">Photo</th>
            <th className=" px-2 py-1 text-left">Nom</th>
            <th className=" px-2 py-1 text-left">Description</th>
            <th className=" px-2 py-1 text-left">Prestation</th>
            <th className=" px-2 py-1 text-left">Prix (€)</th>
            <th className=" px-2 py-1 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr key={service.id}>
               <td className="border px-2 py-1">
                {service.photo && (
                  <img
                    src={service.photo}
                    alt={service.nom}
                    className="h-10 w-10 object-cover rounded-full cursor-pointer"
                    onClick={() => handleImageClick(service.photo)} // Ajout de la fonction de clic
                  />
                )}
              </td>
              <td className="border px-2 py-1">{service.nom}</td>
              <td className="border px-2 py-1">{service.description}</td>
              <td className="border px-2 py-1">{service.prestation?.nom || "N/A"}</td>
              <td className="border px-2 py-1">{parseFloat(service.prix).toFixed(2)}</td>
             
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  ✏
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup d'image */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-xl font-bold text-red-600"
            >
              X
            </button>
            <img
              src={popupImage}
              alt="Popup"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
