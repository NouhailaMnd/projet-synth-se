import React from "react";
import Footer from "./footer"; // Vérifie que le chemin est correct

const services = [
  {
    title: "Ménage complet",
    category: "ménage",
    price: 20,
    rating: 4.8,
    image: "https://via.placeholder.com/300x180?text=Menage",
  },
  {
    title: "Tonte de pelouse",
    category: "jardinage",
    price: 25,
    rating: 4.7,
    image: "https://via.placeholder.com/300x180?text=Pelouse",
  },
  {
    title: "Montage de meubles",
    category: "bricolage",
    price: 30,
    rating: 4.8,
    image: "https://via.placeholder.com/300x180?text=Meubles",
  },
  {
    title: "Garde d’enfants",
    category: "garde_enfants",
    price: 18,
    rating: 4.6,
    image: "https://via.placeholder.com/300x180?text=Garde",
  },
  {
    title: "Cours de mathématiques",
    category: "cours",
    price: 15,
    rating: 4.5,
    image: "https://via.placeholder.com/300x180?text=Cours",
  },
  {
    title: "Aide aux personnes âgées",
    category: "aide",
    price: 22,
    rating: 4.7,
    image: "https://via.placeholder.com/300x180?text=Aide",
  },
  {
    title: "Nettoyage de vitres",
    category: "ménage",
    price: 28,
    rating: 4.6,
    image: "https://via.placeholder.com/300x180?text=Vitres",
  },
  {
    title: "Taille de haies",
    category: "jardinage",
    price: 27,
    rating: 4.7,
    image: "https://via.placeholder.com/300x180?text=Haies",
  },
  {
    title: "Petites réparations",
    category: "bricolage",
    price: 32,
    rating: 4.8,
    image: "https://via.placeholder.com/300x180?text=Réparations",
  },
];

export default function ServiceList() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-center text-2xl font-bold mb-6">Nos Services à Domicile</h1>

        {/* Barre de recherche */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Recherchez un service..."
            className="border rounded-l px-4 py-2 w-72"
          />
          <button className="bg-blue-500 text-white px-4 rounded-r">Rechercher</button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres */}
          <div className="w-full md:w-1/4 border rounded p-4">
            <h3 className="font-semibold mb-4">Filtrer les services</h3>
            <div className="mb-4">
              <p className="font-medium mb-2">Catégories</p>
              {["Ménage", "Jardinage", "Bricolage", "Cours", "Garde d’enfants", "Aide"].map((cat, idx) => (
                <div key={idx} className="flex items-center mb-1">
                  <input type="checkbox" id={cat} className="mr-2" />
                  <label htmlFor={cat} className="text-sm">{cat}</label>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <p className="font-medium mb-2">Prix horaire</p>
              <input type="range" min="0" max="100" className="w-full" />
              <p className="text-sm mt-1">0 € – 100 €</p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Appliquer les filtres</button>
              <button className="border py-2 rounded hover:bg-gray-100">Réinitialiser</button>
            </div>
          </div>

          {/* Liste des services */}
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition">
                <img src={service.image} alt={service.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="text-xs text-blue-600 mb-1">{service.category}</p>
                  <h3 className="font-semibold text-md mb-2">{service.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{service.price} €/h</span>
                    <span className="text-yellow-500 text-sm">⭐ {service.rating}</span>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer à la fin de la page */}
      <Footer />
    </>
  );
}
