import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPrestataire() {
  const navigate = useNavigate();
  const [prestations, setPrestations] = useState([]);

  // Chargement du JSON des villes + régions
  const [citiesAndRegions, setCitiesAndRegions] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    async function fetchPrestations() {
      try {
        const response = await fetch('/api/prestations'); // adapte l'url à ta route Laravel
        const data = await response.json();
        setPrestations(data);
      } catch (error) {
        console.error("Erreur lors du chargement des prestations :", error);
      }
    }

    fetchPrestations();

    // Charger le JSON des villes et régions
    fetch('/cities_and_regions_combined.json')
      .then(res => res.json())
      .then(data => {
        setCitiesAndRegions(data);

        // Extraire les régions uniques
        const uniqueRegionsMap = {};
        data.forEach(item => {
          const id = item.region.id;
          if (!uniqueRegionsMap[id]) {
            uniqueRegionsMap[id] = item.region.name;
          }
        });

        const uniqueRegions = Object.entries(uniqueRegionsMap).map(([id, name]) => ({
          id,
          name
        }));

        setRegions(uniqueRegions);
      })
      .catch(err => console.error("Erreur lors du chargement des régions et villes:", err));
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'prestataire',
    telephone: '',
    genre: '',
    region: '',
    ville: '',
    quartier: '',
    code_postal: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'region') {
      // filtrer les villes correspondant à la région sélectionnée
      const citiesFiltered = citiesAndRegions.filter(city => city.region.name === value);
      setFilteredCities(citiesFiltered);

      // Réinitialiser la ville si la région change
      setFormData(prev => ({ ...prev, ville: '' }));
    }
  };

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json();
          setErrors(errorData.errors);
        } else {
          console.error("Erreur serveur :", response.status);
          alert("Une erreur est survenue. Veuillez réessayer plus tard.");
        }
      } else {
        const data = await response.json();
        console.log("Inscription réussie :", data);
        navigate('/login');
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Impossible de contacter le serveur.");
    }
  }

  return (
    <div className="w-full h-full bg-white rounded-xl flex overflow-hidden">
            {/* Formulaire */}
            <div className="flex items-center justify-center w-full">
                <div className="flex items-center justify-center p-6 sm:p-12">
                    <div className="mx-auto w-full max-w-md bg-white">
                        <form onSubmit={handleRegister}>
          <div className="mb-5">
            <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name} onChange={handleChange}
              id="name"
              placeholder="Entrez votre nom complet"
              required
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="telephone" className="mb-3 block text-base font-medium text-[#07074D]">
              Numéro de téléphone
            </label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone} onChange={handleChange}
              id="telephone"
              placeholder="Entrez votre numéro de téléphone"
              required
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone[0]}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
              Adresse e-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email} onChange={handleChange}
              id="email"
              placeholder="Entrez votre e-mail"
              required
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="mb-3 block text-base font-medium text-[#07074D]">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password} onChange={handleChange}
              id="password"
              placeholder="Entrez votre mot de passe"
              required
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
          </div>

          <div className="mb-5">
            <label className="mb-3 block text-base font-medium text-[#07074D]">
              Genre
            </label>
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="homme"
                  name="genre"
                  value="homme"
                  checked={formData.genre === "homme"} 
                  onChange={handleChange}
                  required
                  className="mr-2"
                />
                <label htmlFor="homme" className="text-[#6B7280]">Homme</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="femme"
                  name="genre"
                  value="femme"
                  checked={formData.genre === "femme"} 
                  onChange={handleChange}
                  required
                  className="mr-2"
                />
                <label htmlFor="femme" className="text-[#6B7280]">Femme</label>
              </div>
            </div>
          </div>

         <div className="mb-5 pt-3">
                <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                  Détails de l'adresse
                </label>
                <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <label htmlFor="region" className="mb-2 block text-base font-medium text-[#07074D]">Région</label>
                      <select
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      >
                        <option value="">-- Sélectionnez une région --</option>
                        {regions.map(region => (
                          <option key={region.id} value={region.name}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      {errors.region && <p className="text-red-500 text-sm">{errors.region[0]}</p>}
                    </div>
                  </div>

                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <label htmlFor="ville" className="mb-2 block text-base font-medium text-[#07074D]">Ville</label>
                      <select
                        id="ville"
                        name="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        required
                        disabled={!formData.region}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      >
                        <option value="">-- Sélectionnez une ville --</option>
                        {filteredCities.map(city => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.ville && <p className="text-red-500 text-sm">{errors.ville[0]}</p>}
                    </div>
                  </div>

                  {/* Quartier et Code postal restent inputs */}
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <input
                        type="text"
                        name="quartier"
                        value={formData.quartier}
                        onChange={handleChange}
                        id="quartier"
                        placeholder="Quartier ou zone"
                        required
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>

                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <input
                        type="text"
                        name="code_postal"
                        value={formData.code_postal}
                        onChange={handleChange}
                        id="code_postal"
                        placeholder="Code postal"
                        required
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton soumission */}
              <div>
                <button
                  type="submit"
                  className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  S'inscrire
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}