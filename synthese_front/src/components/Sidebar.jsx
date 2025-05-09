import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/Dashboard', label: 'Dashboard', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )},
  {
    to: null,
    label: 'Accueil',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.293 3.293a1 1 0 011.414 0l6 6l2 2a1 1 0 01-1.414 1.414L19 12.414V19a2 2 0 01-2 2h-3a1 1 0 01-1-1v-3h-2v3a1 1 0 01-1 1H7a2 2 0 01-2-2v-6.586l-.293.293a1 1 0 01-1.414-1.414l2-2z" />
      </svg>
    ),
    children: [
      {
        to: '/acceuil/stats',
        label: 'Statistiques',
        children: [
          { to: '/UserStats', label: 'Utilisateur' },
          { to: '/ReservationChart', label: 'Résérvation' },
        ],
      },
    ],
  },
  { to: '/AfficherPrestataire', label: 'Gestion Prestataires', icon: (
    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
      <path d="M12 4a5 5 0 115 5a5 5 0 01-5-5m10 28h-2v-5a5 5 0 00-5-5H9a5 5 0 00-5 5v5H2v-5a7 7 0 017-7h6a7 7 0 017 7z" />
    </svg>
  )},
  { to: '/AfficherPrestations', label: 'Gestion Prestations', icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M16 7h3v4h-3zm-7 8h11M9 11h4M9 7h4M6 18.5a2.5 2.5 0 11-5 0V7h5.025M6 18.5V3h17v15.5a2.5 2.5 0 01-2.5 2.5h-17" />
    </svg>
  )},
  { to: '/UserTable', label: 'Gestion Utilisateurs', icon: (
    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 14a6 6 0 100-12 6 6 0 000 12zm0 2c-4 0-12 2-12 6v4h24v-4c0-4-8-6-12-6z" />
    </svg>
  )},
  { to: '/Gestionservices', label: 'Gestion Services', icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 002 12a10 10 0 002.26 6.33l-2 2a1 1 0 00-.21 1.09A1 1 0 003 22h9a10 10 0 000-20zm0 18H5.41l.93-.93a1 1 0 000-1.41A8 8 0 1112 20zm5-9H7a1 1 0 000 2h10a1 1 0 000-2zm-2 4H9a1 1 0 000 2h6a1 1 0 000-2zm-6-6h6a1 1 0 000-2H9a1 1 0 000 2z" />
    </svg>
  )},
  { 
    to: '/ReservationTable', 
    label: 'Les Réservations', 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 4h18a1 1 0 010 2H3a1 1 0 010-2zm0 4h18a1 1 0 010 2H3a1 1 0 010-2zm0 4h18a1 1 0 010 2H3a1 1 0 010-2zm0 4h18a1 1 0 010 2H3a1 1 0 010-2z" />
      </svg>
    )
  }
  
];

const Sidebar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderLinks = (items, depth = 0) => {
    return items.map(({ to, label, icon, children }) => {
      const isActive = location.pathname === to;
      const isOpen = openMenus[label];

      return (
        <div key={label} className={`ml-${depth * 4}`}>
          {children ? (
            <div>
              <button
                onClick={() => toggleMenu(label)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-300 
                  ${isActive ? 'bg-blue-700 text-white font-bold shadow-lg' : 'hover:bg-blue-800 text-gray-300 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  {icon && <span>{icon}</span>}
                  <span>{label}</span>
                </div>
                <span>{isOpen ? '▲' : '▼'}</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4"
                  >
                    {renderLinks(children, depth + 1)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive ? 'bg-blue-700 text-white font-bold shadow-lg' : 'hover:bg-blue-800 text-gray-300 hover:text-white'}`}
            >
              {icon && <span>{icon}</span>}
              <span>{label}</span>
            </Link>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-blue-950 text-white p-4 shadow-md">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-xl font-bold tracking-wider">ÉquiPassion</span>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-950 via-black to-blue-900 shadow-2xl text-white flex flex-col justify-between"
          >
            <div className="p-6">
              <h1 className="text-2xl font-extrabold mb-6 text-center">Admin Panel</h1>
              <nav className="space-y-2">{renderLinks(links)}</nav>
            </div>
            <div className="p-4 text-center text-xs text-gray-400">&copy; 2025 ÉquiPassion</div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-gradient-to-b from-blue-950 via-black to-blue-900 shadow-lg text-white flex-col justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold mb-6 text-center">Admin Panel</h1>
          <nav className="space-y-2">{renderLinks(links)}</nav>
        </div>
        <div className="p-4 text-center text-xs text-gray-400">&copy; 2025 ÉquiPassion</div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
