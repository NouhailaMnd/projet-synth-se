import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-6 py-3 rounded-full flex items-center justify-center gap-2 text-base font-semibold transition duration-200 border-2 ${
      pathname === path
        ? 'border-indigo-500 bg-white text-indigo-700 shadow-md'
        : 'border-transparent bg-white text-zinc-800 hover:border-indigo-300 hover:text-indigo-600'
    }`;

  return (
    <div className="flex flex-col lg:flex-row-reverse min-h-screen">
      {/* Sidebar */}
      <div className="lg:w-1/2 bg-indigo-200 text-indigo-700 shadow flex flex-col p-6">
        {/* Titre centré en haut */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-4">S’inscrire</h1>
          <hr className="border-indigo-500" />
        </div>

        {/* Conteneur principal qui pousse le groupe de liens au milieu */}
        <div className="flex flex-col flex-grow justify-center items-center">
          {/* Groupe de liens en row centrés */}
          <div className="flex flex-row justify-center items-center space-x-6 w-full">
            <Link to="/auth" className={linkClass('/auth')}>
              👤 <span>Prestataire</span>
            </Link>
            
            <Link to="/auth/client" className={linkClass('/auth/client')}>
              🙋‍♀️ <span>Client</span>
            </Link>
          </div>
        </div>

        {/* Image en bas */}
        <div className="hidden lg:block text-center mt-auto">
          <img src="/auth_img.png" alt="Logo" className="mx-auto w-2/3" />
        </div>
      </div>

      {/* Partie formulaire */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Outlet />
          <p className="mt-6 text-sm text-gray-600 text-center">
            Retour ?{" "}
            <Link to="/" className="border-b border-gray-500 border-dotted hover:text-indigo-600">
              à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}