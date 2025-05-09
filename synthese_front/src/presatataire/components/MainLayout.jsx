import React from 'react';
import TopNav from './TopNav';
import SideBare from './SideBare';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <SideBare />
      <div className="flex flex-col flex-1 overflow-hidden">
        
        <main className="flex-1 overflow-auto p-4">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;