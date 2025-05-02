import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-gray-800 rounded-2xl overflow-y-auto">
        <nav className="flex-1 bg-gradient-to-b from-gray-700 to-blue-500 p-4 gap-5 rounded-2xl flex flex-col">
          {/* Dashboard */}
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 rounded-2xl">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Dashboard
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            {/* Home */}
            <Link to="/AfficherPrestataire" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6l2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2z" />
              </svg>
              AfficherPrestataire
            </Link>

            {/* Profile */}
            <Link to="/profile" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 32 32" fill="currentColor">
                <path
                  d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z" />
              </svg>
              Profile
            </Link>

            {/* Article */}
            <Link to="/articles" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                <path
                  d="M16 7h3v4h-3zm-7 8h11M9 11h4M9 7h4M6 18.5a2.5 2.5 0 1 1-5 0V7h5.025M6 18.5V3h17v15.5a2.5 2.5 0 0 1-2.5 2.5h-17" />
              </svg>
              Articles
            </Link>

            {/* Users */}
            <Link to="/users" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 32 32" fill="currentColor">
                <path
                  d="M16 14a6 6 0 1 0-6-6 6 6 0 0 0 6 6zm0 2c-4 0-12 2-12 6v4h24v-4c0-4-8-6-12-6z" />
              </svg>
              Users
            </Link>

            {/* Comments */}
            <Link to="/comments" className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2A10 10 0 0 0 2 12a9.89 9.89 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20m0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20m5-9H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m-2 4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2M9 9h6a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2" />
              </svg>
              Comments
            </Link>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
