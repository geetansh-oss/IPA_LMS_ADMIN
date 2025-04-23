import React from 'react';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';

const Layout = () => {
  return (
    <div>
      <Navbar/>
      <div className='flex mt-22'>
      <Sidebar/>
      </div>
    </div>
  )
}

export default Layout;
