import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import NavBar from "../layouts/NavBar";

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/services")
      .then(res => {
        const rawServices = res.data;

        const formatted = rawServices.map(service => {
          const match = service.prestation?.nom?.match(/^([\p{Emoji_Presentation}\p{Emoji}\p{So}])?\s*(.+)$/u);
          const icon = match?.[1] || "🔧";
          const name = match?.[2] || service.prestation.nom;

          return {
            id: service.id, // ✅ important pour redirection
            title: service.nom,
            category: name.toLowerCase(),
            icon: icon,
            fullCategory: `${icon} ${name}`,
            price: parseFloat(service.prix),
            image: service.photo
            
          };
        });

        setServices(formatted);

        const uniqueCategories = Array.from(
          new Map(
            formatted.map((item) => [item.category, { category: item.category, icon: item.icon }])
          ).values()
        );

        setPrestations(uniqueCategories);
      })
      .catch(err => {
        console.error("Erreur de chargement des services:", err);
      });
  }, []);

  const toggleCategory = (name) => {
    setSelectedCategories(prev =>
      prev.includes(name)
        ? prev.filter(cat => cat !== name)
        : [...prev, name]
    );
  };

  const filteredServices = services.filter(service => {
    const byCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
    const byPrice = service.price <= maxPrice;
    return byCategory && byPrice;
  });

  return (
    <>
    <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-center text-2xl font-bold mb-6">Nos Services à Domicile</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres */}
          <div className="w-full md:w-1/4 border rounded p-4">
            <h3 className="font-semibold mb-4">Filtrer les services</h3>

            {/* Filtres par prestation */}
            <div className="mb-4">
              <p className="font-medium mb-2">Catégories</p>
              {prestations.map((presta, idx) => (
                <div key={idx} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`cat-${idx}`}
                    checked={selectedCategories.includes(presta.category)}
                    onChange={() => toggleCategory(presta.category)}
                    className="mr-2"
                  />
                  <label htmlFor={`cat-${idx}`} className="text-sm">
                    {presta.icon} {presta.category.charAt(0).toUpperCase() + presta.category.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            {/* Filtre prix */}
            <div className="mb-4">
              <p className="font-medium mb-2">Prix horaire</p>
              <input
                type="range"
                min="0"
                max="200"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm mt-1">0 DH – {maxPrice} DH</p>
            </div>

            <div className="flex flex-col gap-2">
              <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Appliquer les filtres
              </button>
              <button
                className="border py-2 rounded hover:bg-gray-100"
                onClick={() => {
                  setSelectedCategories([]);
                  setMaxPrice(100);
                }}
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Liste des services */}
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition">
                <img src={service.image} 
                alt={service.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="text-xs text-blue-600 mb-1">{service.fullCategory}</p>
                  <h3 className="font-semibold text-md mb-2">{service.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{service.price} DH/h</span>
                    <span className="text-yellow-500 text-sm">⭐ 4.5</span>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                    onClick={() => navigate(`/ServiceDetail/${service.id}`)}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
