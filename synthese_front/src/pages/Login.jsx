import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login() {



 


    const navigate = useNavigate();
    const [formData, setFormData] = useState({
           
          email: '',
          password: '',
         
    });
      
        const [errors, setErrors] = useState({});
      
        const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({ ...prev, [name]: value }));
        };
      
        async function handleRegister(e) {
          e.preventDefault();
        
          try {
            const response = await fetch('/api/login', {
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
              const data = await response.json(); // <- ici tu récupères les données
              console.log("connexion réussie :", data);
        
              const token = data.token; // <- ici tu prends le token
              localStorage.setItem('authToken', token); // <- ici tu l'enregistres
               // ✅ Stocker les infos utilisateur comme un seul objet
              sessionStorage.setItem('token', data.token);
              sessionStorage.setItem('user', JSON.stringify(data.user));

              // ✅ Supprimer les anciennes clés si elles existent
              sessionStorage.removeItem('user_id');
              sessionStorage.removeItem('user_name');
              sessionStorage.removeItem('user_email');
              sessionStorage.removeItem('user_role');

              alert("Connexion réussie !");
              navigate('/');
              
            }
          } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Impossible de contacter le serveur.");
          }
        }





  

  

  return (
    <div className="w-full h-screen bg-white flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col justify-center">
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Connexion</h1>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs">
              <form onSubmit={handleRegister}>
                <input
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Adresse e-mail"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}

                <input
                  className="w-full px-8 py-4 mt-5 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}

                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-white w-full py-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out flex items-center justify-center"
                >
                  <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Se connecter</span>
                </button>
              </form>

              <p className="mt-6 text-xs text-center text-gray-600">
                Vous n'avez pas de compte ?{" "}
                <a href="/auth" className="border-b border-gray-500">Créer un compte</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-indigo-100 hidden lg:flex items-center justify-center">
        <div
          className="w-full h-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
          }}
        ></div>
      </div>
    </div>
  );
}
