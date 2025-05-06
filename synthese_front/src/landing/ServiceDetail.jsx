import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./footer";
import axios from "axios";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [selectedOption, setSelectedOption] = useState("1");
  const [activeTab, setActiveTab] = useState("Description");
  const [prestataires, setPrestataires] = useState([]);
  const [selectedPrestataire, setSelectedPrestataire] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8000/api/services/${id}`)
      .then(res => {
        setService(res.data);
        if (res.data.prestation_id) {
          axios.get(`http://localhost:8000/api/prestataires/par-prestation/${res.data.prestation_id}`)
            .then(pres => setPrestataires(pres.data))
            .catch(err => console.error("Erreur chargement prestataires:", err));
        }
      })
      .catch(err => console.error("Erreur chargement service:", err));
  }, [id]);

  const handleAddToCart = () => {
    const duree = parseFloat(selectedOption);
    const prix = parseFloat(service.prix);

    const newItem = {
      id: service.id,
      nom: service.nom,
      prix: prix, // ✅ champ 'prix' obligatoire pour Checkout
      duree: duree,
      total: prix * duree,
      date: selectedDate,
      prestataire: selectedPrestataire,
    };

    const existingCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    existingCart.push(newItem);
    sessionStorage.setItem("cart", JSON.stringify(existingCart));

    window.dispatchEvent(new Event("cartUpdated"));
    alert("Service ajouté au panier !");
  };

  if (!service) return <div className="p-10 text-center">Chargement du service...</div>;

  const imageUrl = service.photo
    ? `http://localhost:8000/storage/${service.photo}`
    : "https://via.placeholder.com/800x400?text=Service";

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-2">{service.nom}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
              {service.prestation?.nom || "Catégorie inconnue"}
            </span>
            <span className="text-yellow-500 text-sm">⭐ 4.8 (3 avis)</span>
          </div>

          <img
            src={imageUrl}
            alt={service.nom}
            className="rounded-lg mb-6 w-full object-cover h-64"
          />

          <div className="flex space-x-4 border-b mb-6">
            {["Description", "Prestataire"].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
                } hover:text-blue-600`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Description" && (
            <div>
              <h2 className="font-semibold text-lg mb-2">À propos de ce service</h2>
              <p className="text-sm text-gray-700 mb-6">{service.description}</p>
              <h3 className="font-semibold mb-2">Durée souhaitée</h3>
              <div className="mb-4">
                <label htmlFor="duree" className="block text-sm text-gray-700 mb-1">
                  Entrez la durée en heures
                </label>
                <input
                  type="number"
                  id="duree"
                  min="1"
                  step="0.5"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Prix horaire : {service.prix} €/h
                </p>
              </div>
            </div>
          )}

          {activeTab === "Prestataire" && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Prestataires disponibles</h2>
              {prestataires.length > 0 ? (
                <ul className="space-y-4">
                  {prestataires.map((p) => (
                    <li
                      key={p.id}
                      className={`border p-4 rounded-lg shadow-sm cursor-pointer ${
                        selectedPrestataire === p.id ? "border-blue-600 bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedPrestataire(p.id)}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="prestataire"
                          checked={selectedPrestataire === p.id}
                          onChange={() => setSelectedPrestataire(p.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium text-sm">Téléphone : {p.telephone}</p>
                          <p className="text-sm">Ville : {p.ville}, Quartier : {p.quartier}</p>
                          <p className="text-sm text-gray-600">Genre : {p.genre}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Aucun prestataire disponible.</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border rounded-lg shadow p-6 h-fit">
          <h3 className="text-sm font-semibold mb-2">Réserver ce service</h3>
          <p className="text-lg font-bold text-blue-600 mb-4">
            {service.prix} €<span className="text-sm font-normal text-gray-500">/heure</span>
          </p>

          {selectedPrestataire && (
            <p className="text-sm text-gray-700 mb-2">
              Prestataire sélectionné : #{selectedPrestataire}
            </p>
          )}

          <label htmlFor="date" className="text-sm text-gray-700 mb-2 block">
            Choisissez une date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
            onClick={handleAddToCart}
            disabled={!selectedDate || !selectedPrestataire || !selectedOption}
          >
            Réserver
          </button>
          <p className="text-[10px] text-gray-400">
            En cliquant sur “Pré-réserver”, vous acceptez les conditions générales.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
