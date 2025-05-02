import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Services<span className="text-gray-800">ÀDomicile</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/Services" className="text-gray-700 hover:text-blue-600">Services</Link>
            <a href="/HowItWorks" className="text-gray-700 hover:text-blue-600">Comment ça marche</a>
            <a href="/Contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          </nav>

          {/* Boutons Desktop */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
            >
              Connexion
            </Link>
            <Link
              to="/Register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Inscription
            </Link>
          </div>

          {/* Hamburger menu pour mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-sm px-4 py-2 space-y-2">
          <Link to="/Services" className="block text-gray-700 hover:text-blue-600">Services</Link>
          <a href="/HowItWorks" className="block text-gray-700 hover:text-blue-600">Comment ça marche</a>
          <a href="/Contact" className="block text-gray-700 hover:text-blue-600">Contact</a>
          <Link
            to="/Register"
            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Inscription
          </Link>
        </div>
      )}
    </header>
  );
}
