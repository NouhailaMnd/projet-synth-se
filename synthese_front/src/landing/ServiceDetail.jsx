import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./footer";
import axios from "axios";
import NavBar from "../layouts/NavBar";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("1");
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
    const duree = parseFloat(selectedDuration);
    const prix = parseFloat(service.prix);
    const prestataireInfo = prestataires.find(p => p.id === selectedPrestataire);

    const newItem = {
      id: service.id,
      nom: service.nom,
      prix: prix,
      duree: duree,
      total: prix * duree,
      date: selectedDate,
      prestataire_id: selectedPrestataire,
      prestataire_nom: prestataireInfo?.user?.name || "Inconnu",
    };

    const existingCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    existingCart.push(newItem);
    sessionStorage.setItem("cart", JSON.stringify(existingCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!service) return <div className="p-10 text-center">Chargement du service...</div>;

  const imageUrl = service.photo
    ? `http://localhost:8000/storage/${service.photo}`
    : "https://via.placeholder.com/800x400?text=Service";

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10">
        {/* Détails du service */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{service.nom}</h1>
          <div className="flex items-center space-x-3 mb-6">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-semibold">
              {service.prestation?.nom || "Catégorie inconnue"}
            </span>
            <span className="text-yellow-500 text-sm">⭐ 4.8 (3 avis)</span>
          </div>

          <img
            src={imageUrl}
            alt={service.nom}
            className="rounded-lg mb-8 w-full object-cover h-64"
          />

          <div className="flex space-x-6 border-b border-gray-300 mb-8">
            {["Description", "Prestataire"].map(tab => (
              <button
                key={tab}
                className={`pb-2 text-lg font-medium ${
                  activeTab === tab
                    ? "border-b-4 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                } transition-colors`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Description" && (
            <div>
              <h2 className="text-xl font-semibold mb-3">À propos de ce service</h2>
              <p className="text-gray-700 mb-8">{service.description}</p>
            </div>
          )}

          {activeTab === "Prestataire" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Prestataires disponibles</h2>
              {prestataires.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {prestataires.map((p) => {
                    const isSelected = selectedPrestataire === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`border rounded-lg p-5 shadow-md cursor-pointer transition-shadow
                          ${isSelected ? "border-blue-600 bg-blue-50 shadow-lg" : "border-gray-300 hover:shadow-lg hover:border-blue-400"}
                        `}
                        onClick={() => setSelectedPrestataire(p.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") setSelectedPrestataire(p.id);
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            name="prestataire"
                            checked={isSelected}
                            onChange={() => setSelectedPrestataire(p.id)}
                            className="cursor-pointer"
                          />
                          <div>
                            <p className="font-semibold text-lg">{p.user?.name || "Inconnu"}</p>
                            <p className="text-gray-600 text-sm mb-1">📞 {p.telephone}</p>
                            <p className="text-gray-600 text-sm mb-1">📍 {p.ville}, {p.quartier}</p>
                            <p className="text-gray-600 text-sm">⚥ {p.genre}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucun prestataire disponible.</p>
              )}
            </div>
          )}
        </div>

        {/* Bloc réservation */}
        <aside className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 sticky top-20 h-fit max-w-md mx-auto md:mx-0">
          <h3 className="text-2xl font-bold mb-6 text-center text-blue-700">Réserver ce service</h3>

          <div className="text-center mb-8">
            <span className="text-4xl font-extrabold text-blue-600">{service.prix}</span>
            <span className="text-lg text-gray-500"> DH / heure</span>
          </div>

          {selectedPrestataire && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-300 text-blue-700 font-semibold flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 1116.95 6.974a7 7 0 01-11.829 10.83z" />
              </svg>
              <span>Prestataire: {prestataires.find(p => p.id === selectedPrestataire)?.user?.name || "Inconnu"}</span>
            </div>
          )}

          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            📅 Choisissez une date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
          />

          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            ⏰ Durée souhaitée (heures)
          </label>
          <input
            id="duration"
            type="number"
            min="0.5"
            step="0.5"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-8"
          />

          <button
            onClick={handleAddToCart}
            disabled={!selectedDate || !selectedPrestataire || !selectedDuration || selectedDuration <= 0}
            className={`w-full py-3 rounded-md text-white font-semibold transition-colors
              ${selectedDate && selectedPrestataire && selectedDuration > 0
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-blue-300 cursor-not-allowed"}
            `}
          >
            Réserver
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            En cliquant sur “Pré-réserver”, vous acceptez les conditions générales.
          </p>
        </aside>
      </div>

      <Footer />
    </>
  );
}
