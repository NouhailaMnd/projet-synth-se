import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AuthSidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-8 py-4 rounded-full flex items-center gap-4 text-xl min-w-[220px] justify-center font-semibold transition duration-200 border-2 ${
      pathname === path
        ? 'border-indigo-500 bg-white text-indigo-700 shadow-md'
        : 'border-transparent bg-white text-zinc-800 hover:border-indigo-300 hover:text-indigo-600'
    }`;

  return (
    <div className="w-2/4 flex items-center justify-center ">
      <div className="bg-indigo-200 text-indigo-700  shadow w-[100%] h-[100%] flex flex-col justify-between p-6">
        {/* Top Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold ml-3">Register</h1>
          </div>
          <hr className="border-indigo-500" />
        </div>

        {/* Centered Links */}
        <ul className="flex flex-row justify-center space-x-6 mb-6">
          <li>
            <Link to="/" className={linkClass('/') + ' bg-white shadow-md hover:shadow-xl px-6 py-3 rounded-full flex items-center gap-2'}>
              <span className="text-2xl">👤</span> 
              <span className="text-sm font-medium">Prestataire</span>
            </Link>
          </li>
          <li>
            <Link to="/Entreprise" className={linkClass('/Entreprise') + ' bg-white shadow-md hover:shadow-xl px-6 py-3 rounded-full flex items-center gap-2'}>
              <span className="text-2xl">🏢</span> 
              <span className="text-sm font-medium">Entreprise</span>
            </Link>
          </li>
          <li>
            <Link to="/Client" className={linkClass('/Client') + ' bg-white shadow-md hover:shadow-xl px-6 py-3 rounded-full flex items-center gap-2'}>
              <span className="text-2xl">🙋‍♀️</span> 
              <span className="text-sm font-medium">Client</span>
            </Link>
          </li>
        </ul>

        {/* Bottom Section with image and copyright */}
        <div className="mt-10 text-center">
          <img
            src="/auth_img.png"
            alt="Logo"
            className=" h-auto mx-auto mb-4"
          />
        </div>
      </div>
    </div>
  );
}








