import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-full flex items-center gap-2 text-base font-semibold transition duration-200 border-2 ${
      pathname === path
        ? 'border-indigo-500 bg-white text-indigo-700 shadow-md'
        : 'border-transparent bg-white text-zinc-800 hover:border-indigo-300 hover:text-indigo-600'
    }`;

  return (
    <div className="flex flex-col lg:flex-row-reverse min-h-screen">
      {/* Sidebar visible uniquement sur écrans moyens et + */}
      <div className="lg:w-1/2 bg-indigo-200 text-indigo-700 shadow flex flex-col justify-between p-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          <hr className="border-indigo-500" />
        </div>

        <ul className="space-y-4">
          <li>
            <Link to="/auth" className={linkClass('/')}>
              👤 <span>Prestataire</span>
            </Link>
          </li>
          <li>
            <Link to="/auth/Entreprise" className={linkClass('/Entreprise')}>
              🏢 <span>Entreprise</span>
            </Link>
          </li>
          <li>
            <Link to="/auth/Client" className={linkClass('/Client')}>
              🙋‍♀️ <span>Client</span>
            </Link>
          </li>
        </ul>

        {/* Image visible uniquement sur grands écrans et plus */}
        <div className="mt-auto hidden lg:block text-center">
          <img src="/auth_img.png" alt="Logo" className="mx-auto w-2/3" />
        </div>
      </div>

      {/* Partie formulaire */}
      <div className="flex-1 p-4">
        <div className="mt-4">
          <Outlet />
          <p className="mt-6 text-xs text-gray-600 text-center">
                                Retour ?{" "}
                                <a href="/" className="border-b border-gray-500 border-dotted">à l'accueil</a>
                            </p>
        </div>
      </div>
    </div>
  );
}
