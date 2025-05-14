import React from 'react';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-row flex-1 pt-20 overflow-hidden">
        <div className="w-1/5 h-full overflow-hidden">
          <Sidebar />
        </div>
        <div className="w-4/5 h-full overflow-y-auto px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
