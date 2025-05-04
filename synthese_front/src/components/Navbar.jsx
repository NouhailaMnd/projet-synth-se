import React from 'react';
import { Bell, Mail } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 bg-white shadow-lg px-6 flex items-center justify-between fixed top-0 left-64 right-0 z-50 border-b border-gray-200">
      {/* Titre */}
      <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
        <span role="img" aria-label="dashboard"></span> Centre de contrôle
      </h1>

      {/* Barre de recherche */}
      <div className="flex-1 mx-8 max-w-md hidden lg:block">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
        />
      </div>

      {/* Icônes + utilisateur */}
      <div className="flex items-center gap-6">
        {/* Message */}
        <button
          className="relative text-gray-600 hover:text-blue-600 transition duration-200"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3l9-8z" />
            </svg>
        </button>
        <button
          className="relative text-gray-600 hover:text-blue-600 transition duration-200"
          aria-label="Messages"
        >
          <Mail className="w-5 h-5" />
          <span className="absolute -top-1 -right-2 bg-green-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
            2
          </span>
        </button>

        {/* Notifications */}
        <button
          className="relative text-gray-600 hover:text-blue-600 transition duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
            3
          </span>
        </button>

        {/* Utilisateur */}
        <div className="flex items-center gap-3 ml-2">
          <div className="text-sm text-gray-700 font-medium">
            Bonjour, <span className="text-blue-600 font-semibold">Admin</span>
          </div>
          <img
            src="https://i.pravatar.cc/40"
            alt="Avatar utilisateur"
            className="rounded-full w-10 h-10 border border-gray-300 shadow"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
