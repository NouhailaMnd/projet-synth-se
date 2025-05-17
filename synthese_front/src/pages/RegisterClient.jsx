import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterClient() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    numero_telephone: '',
    email: '',
    password: '',
    region: '',
    ville: '',
    quartier: '',
    code_postal: '',
    role: 'client' 
  });

  const [errors, setErrors] = useState({});
  const [regions, setRegions] = useState([]);
  const [villes, setVilles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données des régions et villes
  useEffect(() => {
    fetch('/cities_and_regions_combined.json')
      .then(response => response.json())
      .then(data => {
        // Extraire les régions uniques
        const uniqueRegions = Array.from(
          new Set(data.map(item => item.region.name))
        ).map(name => {
          const region = data.find(item => item.region.name === name).region;
          return {
            id: region.id,
            name: region.name
          };
        });
        
        setRegions(uniqueRegions);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erreur de chargement des données:", error);
        setIsLoading(false);
      });
  }, []);

  // Filtrer les villes lorsque la région change
  useEffect(() => {
    if (formData.region) {
      fetch('/cities_and_regions_combined.json')
        .then(response => response.json())
        .then(data => {
          const villesFiltrees = data
            .filter(item => item.region.name === formData.region)
            .map(item => ({
              id: item.id,
              name: item.name
            }));
          setVilles(villesFiltrees);
        });
    } else {
      setVilles([]);
      setFormData(prev => ({ ...prev, ville: '' }));
    }
  }, [formData.region]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si on change la région, on réinitialise la ville
    if (name === 'region') {
      setFormData(prev => ({ ...prev, [name]: value, ville: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
                  value={formData.name} 
                  onChange={handleChange}
                  id="name"
                  placeholder="Nom complet"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
              </div>
              
              <div className="mb-5">
                <label htmlFor="phone" className="mb-3 block text-base font-medium text-[#07074D]">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  name="numero_telephone"
                  value={formData.numero_telephone} 
                  onChange={handleChange}
                  id="phone"
                  placeholder="Entrez votre numéro de téléphone"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors.numero_telephone && <p className="text-red-500 text-sm">{errors.numero_telephone[0]}</p>}
              </div>
              
              <div className="mb-5">
                <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  id="email"
                  placeholder="Entrez votre adresse e-mail"
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
                  value={formData.password} 
                  onChange={handleChange}
                  id="password"
                  placeholder="Entrez votre mot de passe"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
              </div>

              <div className="mb-5 pt-3">
                <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                  Détails de l'adresse
                </label>
                <div className="-mx-3 flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <label htmlFor="region" className="mb-3 block text-base font-medium text-[#07074D]">
                        Région
                      </label>
                      <select
                        name="region"
                        id="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        disabled={isLoading}
                      >
                        <option value="">Sélectionnez une région</option>
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
                      <label htmlFor="ville" className="mb-3 block text-base font-medium text-[#07074D]">
                        Ville
                      </label>
                      <select
                        name="ville"
                        id="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        disabled={!formData.region || isLoading}
                      >
                        <option value="">Sélectionnez une ville</option>
                        {villes.map(ville => (
                          <option key={ville.id} value={ville.name}>
                            {ville.name}
                          </option>
                        ))}
                      </select>
                      {errors.ville && <p className="text-red-500 text-sm">{errors.ville[0]}</p>}
                    </div>
                  </div>
                  
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <label htmlFor="quartier" className="mb-3 block text-base font-medium text-[#07074D]">
                        Quartier ou zone
                      </label>
                      <input
                        type="text"
                        name="quartier"
                        value={formData.quartier} 
                        onChange={handleChange}
                        id="quartier"
                        placeholder="Quartier ou zone"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                      {errors.quartier && <p className="text-red-500 text-sm">{errors.quartier[0]}</p>}
                    </div>
                  </div>
                  
                  <div className="w-full px-3 sm:w-1/2">
                    <div className="mb-5">
                      <label htmlFor="code_postal" className="mb-3 block text-base font-medium text-[#07074D]">
                        Code postal
                      </label>
                      <input
                        type="text"
                        name="code_postal"
                        value={formData.code_postal} 
                        onChange={handleChange}
                        id="code_postal"
                        placeholder="Code postal"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                      {errors.code_postal && <p className="text-red-500 text-sm">{errors.code_postal[0]}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? 'Chargement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}