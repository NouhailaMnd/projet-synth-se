import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
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