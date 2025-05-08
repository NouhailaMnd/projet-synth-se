import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar />  <Navbar />
      <div className="ml-1O flex-1">      
        <main className="p-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
