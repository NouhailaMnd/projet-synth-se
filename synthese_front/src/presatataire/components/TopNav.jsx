import React from 'react';

const TopNav = () => {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <button className="md:hidden text-gray-500 focus:outline-none">
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="ml-4 text-lg font-semibold text-gray-800">Tableau de bord</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none">
          <i className="fas fa-bell"></i>
        </button>
        <button className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none">
          <i className="fas fa-envelope"></i>
        </button>
        <div className="relative">
          <button className="flex items-center space-x-2 focus:outline-none">
            <img className="w-8 h-8 rounded-full" src="https://via.placeholder.com/32" alt="Profile" />
            <span className="hidden md:inline text-sm font-medium">Jean Dupont</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;