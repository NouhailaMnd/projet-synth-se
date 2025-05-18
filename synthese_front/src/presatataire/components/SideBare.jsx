import React, { useState, useEffect } from 'react';
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
  const [userData, setUserData] = useState({ 
    name: 'Utilisateur', 
    email: '',
    role: 'Basic'
  });
  const location = useLocation();

  useEffect(() => {
    // Récupération des données utilisateur
    const userSession = sessionStorage.getItem('user');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        setUserData({
          name: user.name || 'Utilisateur',
          email: user.email || '',
          role: user.role || 'Basic'
        });
      } catch (error) {
        console.error("Erreur de parsing des données utilisateur:", error);
      }
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  const getInitials = (name) => {
    if (!name || name === 'Utilisateur') return 'US';
    const parts = name.split(' ');
    let initials = '';
    if (parts.length > 1) {
      initials = parts[0][0] + parts[parts.length - 1][0];
    } else {
      initials = parts[0].substring(0, 2);
    }
    return initials.toUpperCase();
  };

  const getRoleColor = (role) => {
    switch(role.toLowerCase()) {
      case 'premium':
        return 'text-yellow-300';
      case 'admin':
        return 'text-red-400';
      default:
        return 'text-indigo-200';
    }
  };

  return (
    <>
      {/* Mobile menu button */}
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

      {/* Logo Container */}
      <div className="p-4 border-b border-indigo-600 flex items-center justify-center">
        <img 
          src="/logo.png" 
          alt="Logo DomiService" 
          className="h-20 w-auto object-contain" // Ajustez h-16 selon vos besoins
        />
        </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-700 hover:scrollbar-thumb-indigo-400">
            <ul className="space-y-1 px-4">

              {/* Dashboard */}
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

              {/* Services */}
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

              {/* Reservations */}
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

              {/* Profile */}
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

              {/* Subscription */}
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

             

            </ul>
          </nav>

          {/* User footer */}
          <div className="p-4 border-t border-indigo-600">
            <div className="flex items-center px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm font-medium">{getInitials(userData.name)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{userData.name}</p>
                <p className="text-xs truncate" title={userData.email}>{userData.email}</p>
                <p className={`text-xs mt-1 ${getRoleColor(userData.role)}`}>
                  {userData.role}
                </p>
              </div>
            </div>
            <button 
              className="
                flex items-center w-full px-4 py-3 rounded-lg
                hover:bg-indigo-600 transition-all text-left
              "
              onClick={handleLogout}
            >
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