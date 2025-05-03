import React from 'react';
import AuthSidebar from '../components/AuthSidebar';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="h-screen  flex">
      {/* Section pour l'outlet (formulaire et autres contenus) */}
      <div className="flex-grow p-8 flex items-center justify-center">
        <Outlet />
      </div>
      
      {/* Sidebar */}
      <AuthSidebar className="w-1/2" />
    </div>
  );
}


