import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Logo from '../assets/logo.png';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-3">
        <img src={Logo} alt="Logo" className="h-14" />
        <h1 className="text-lg font-semibold hidden sm:block">IPA EDUCATION ACADEMY</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
        {isAuthenticated ? (
          <button onClick={logout} className="bg-black text-white px-4 py-1 rounded-md text-sm">Logout</button>
        ) : (
          <Link to="/login" className="bg-black text-white px-4 py-1 rounded-md text-sm">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
