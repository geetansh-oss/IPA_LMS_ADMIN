import React from 'react';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className='flex flex-row mt-22'>
        <div>
          <Sidebar />
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout;
