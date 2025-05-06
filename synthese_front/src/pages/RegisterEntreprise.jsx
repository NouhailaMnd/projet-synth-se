import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function RegisterEntreprise() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',  
        email: '',
        password: '',
        role: 'entreprise',
        nom_entreprise: '',
        secteur_activite: '',
        pays: '',
        ville: '',
        quartier: '',
        code_postal: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                navigate('/login')
                // Optionnel : vider le formulaire ou rediriger
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Impossible de contacter le serveur.");
        }
    }

    return (
        <div className="w-full h-full bg-white  rounded-xl flex overflow-hidden">
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
                                <label htmlFor="nom_entreprise" className="mb-3 block text-base font-medium text-[#07074D]">
                                    Nom de l’entreprise
                                </label>
                                <input
                                    type="text"
                                    name="nom_entreprise"
                                    value={formData.nom_entreprise} onChange={handleChange}
                                    id="nom_entreprise"
                                    placeholder="Entrez le nom de l’entreprise"
                                    required
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                />
                                {errors.nom_entreprise && <p className="text-red-500 text-sm">{errors.nom_entreprise[0]}</p>}
                            </div>

                            <div className="mb-5">
                                <label htmlFor="secteur" className="mb-3 block text-base font-medium text-[#07074D]">
                                    Secteur d'activité
                                </label>
                                <input
                                    type="text"
                                    name="secteur_activite"
                                    value={formData.secteur_activite} onChange={handleChange}
                                    id="secteur"
                                    placeholder="Entrez le secteur"
                                    required
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                />
                                {errors.secteur_activite && <p className="text-red-500 text-sm">{errors.secteur_activite[0]}</p>}
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
                                    required
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
                                    value={formData.password} onChange={handleChange}
                                    id="password"
                                    placeholder="Entrez votre mot de passe"
                                    required
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                            </div>

                            <div className="mb-5 pt-3">
                                <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                                    Adresse
                                </label>
                                <div className="-mx-3 flex flex-wrap">
                                    <div className="w-full px-3 sm:w-1/2">
                                        <div className="mb-5">
                                            <input
                                                type="text"
                                                name="pays"
                                                value={formData.pays} onChange={handleChange}
                                                id="pays"
                                                placeholder="Pays"
                                                required
                                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-3 sm:w-1/2">
                                        <div className="mb-5">
                                            <input
                                                type="text"
                                                name="ville"
                                                value={formData.ville} onChange={handleChange}
                                                id="ville"
                                                placeholder="Ville"
                                                required
                                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-3 sm:w-1/2">
                                        <div className="mb-5">
                                            <input
                                                type="text"
                                                name="quartier"
                                                value={formData.quartier} onChange={handleChange}
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
                                                value={formData.code_postal} onChange={handleChange}
                                                id="code_postal"
                                                placeholder="Code postal"
                                                required
                                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button type="submit"
                                    className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                                >
                                    Créer un compte entreprise
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
