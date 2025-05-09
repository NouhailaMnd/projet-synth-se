import React from 'react';
import TopNav from './TopNav';
import SideBare from './SideBare';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <SideBare />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;