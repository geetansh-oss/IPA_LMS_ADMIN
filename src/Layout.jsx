import React from 'react';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="flex pt-24 h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
