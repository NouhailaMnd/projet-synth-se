import React from 'react';

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-indigo-700 text-white">
        <div className="flex items-center justify-center h-16 px-4 bg-indigo-800">
          <span className="text-xl font-semibold">ServicePro</span>
        </div>
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <div className="space-y-1">

            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-800 rounded-md">
              <i className="fas fa-tachometer-alt mr-3"></i>
              Tableau de bord
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-md">
              <i className="fas fa-calendar-check mr-3"></i>
              Réservations
            </a>
            
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-md">
              <i className="fas fa-user mr-3"></i>
              Profil
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-md">
              <i className="fas fa-comments mr-3"></i>
              Messagerie
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-md">
              <i className="fas fa-history mr-3"></i>
              Historique
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-md">
              <i className="fas fa-star mr-3"></i>
              Avis clients
            </a>
          </div>
        </div>
        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center">
            <img className="w-10 h-10 rounded-full" src="https://via.placeholder.com/40" alt="Profile" />
            <div className="ml-3">
              <p className="text-sm font-medium">Jean Dupont</p>
              <p className="text-xs text-indigo-200">Prestataire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;