import React from 'react';
import { Bell, Mail } from 'lucide-react'; // Nécessite `lucide-react`

const Navbar = () => {
  return (
    <header className="h-16 bg-white shadow-md px-6 flex items-center justify-between fixed top-0 left-64 right-0 z-50">
      {/* Titre */}
      <h1 className="text-xl font-bold text-gray-800 tracking-wide">
        📊 Centre de contrôle
      </h1>

      {/* Barre de recherche */}
      <div className="flex-1 mx-8 max-w-lg">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Icônes + utilisateur */}
      <div className="flex items-center gap-6">
        {/* Message */}
        <button className="relative hover:text-blue-600 transition">
          <Mail className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </button>

        {/* Notifications */}
        <button className="relative hover:text-blue-600 transition">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* Utilisateur */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">👋 Bonjour, Admin</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="Avatar"
            className="rounded-full w-10 h-10 border-2 border-blue-500 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
