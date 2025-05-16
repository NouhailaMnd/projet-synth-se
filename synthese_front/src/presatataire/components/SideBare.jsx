import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiClipboard,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiDollarSign,
  FiPieChart
} from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';
import { logout } from './logout';

const SideBare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path;


  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <>
      {/* Bouton menu mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-40 w-64 h-screen transition-all duration-300 ease-in-out
        bg-gradient-to-b from-[#1d4ed8] to-[#3b82f6] text-white
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        shadow-xl
      `}>
        <div className="flex flex-col h-full">

          {/* Logo / Titre */}
          <div className="p-6 border-b border-indigo-600 flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-700 font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">MonServicePro</h1>
              <p className="text-indigo-200 text-xs">Tableau de bord</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-700 hover:scrollbar-thumb-indigo-400">
            <ul className="space-y-1 px-4">

              {/* Tableau de bord */}
              <li>
                <NavLink
                  to="/prestataire"
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all
                    ${isActive('/prestataire') ? 'bg-white text-indigo-700 font-medium shadow-md' : 'hover:bg-indigo-600 hover:shadow-md'}
                  `}
                >
                  <FiPieChart className="mr-3 text-lg" />
                  Tableau de bord
                  {isActive('/prestataire') && (
                    <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                  )}
                </NavLink>
              </li>

              {/* Prestations */}
              <li>
                <NavLink
                  to="/prestataire/list"
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-all
                    ${isActive ? 'bg-white text-indigo-700 font-medium shadow-md' : 'hover:bg-indigo-600 hover:shadow-md'}
                  `}
                >
                  <FiClipboard className="mr-3 text-lg" />
                  Prestations
                </NavLink>
              </li>

              {/* Réservations */}
              <li>
                <NavLink
                  to="/prestataire/reservations"
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-all
                    ${isActive ? 'bg-white text-indigo-700 font-medium shadow-md' : 'hover:bg-indigo-600 hover:shadow-md'}
                  `}
                >
                  <FiMessageSquare className="mr-3 text-lg" />
                  Réservations
                  
                </NavLink>
              </li>

              {/* Profil Prestataire */}
              <li>
                <NavLink
                  to="/prestataire/profil"
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-all
                    ${isActive ? 'bg-white text-indigo-700 font-medium shadow-md' : 'hover:bg-indigo-600 hover:shadow-md'}
                  `}
                >
                  <FiUser className="mr-3 text-lg" />
                  Profil Prestataire
                </NavLink>
              </li>

              {/* Abonnement */}
              <li>
                <NavLink
                  to="/prestataire/abonnement"
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-all
                    ${isActive ? 'bg-white text-indigo-700 font-medium shadow-md' : 'hover:bg-indigo-600 hover:shadow-md'}
                  `}
                >
                  <FiDollarSign className="mr-3 text-lg" />
                  Abonnement
                </NavLink>
              </li>

              {/* Paramètres */}
              <li>
                <NavLink
                  to="/parametres"
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-all
                    ${isActive ? 'bg-white text-indigo-700 font-medium shadow-md' : 'hover:bg-indigo-600 hover:shadow-md'}
                  `}
                >
                  <FiSettings className="mr-3 text-lg" />
                  Paramètres
                </NavLink>
              </li>

            </ul>
          </nav>

          {/* Pied de page avec utilisateur */}
          <div className="p-4 border-t border-indigo-600">
            <div className="flex items-center px-4 py-3 mb-2 text-indigo-200">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
                <span className="text-xs font-medium">JP</span>
              </div>
              <div>
                <p className="text-sm font-medium">Jean Prestataire</p>
                <p className="text-xs">Premium</p>
              </div>
            </div>
            <button className="
              flex items-center w-full px-4 py-3 rounded-lg
              hover:bg-indigo-600 transition-all text-left
              "
              onClick={handleLogout}>
              <FiLogOut className="mr-3 text-lg" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBare;
