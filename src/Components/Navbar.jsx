import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full text-amber-50 shadow-md shadow-gray-300/15 z-50 px-6 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-3">
        <img src={Logo} alt="Logo" className="bg-white rounded-full h-14" />
        <h1 className="text-2xl font-semibold hidden sm:block">IPA EDUCATION ACADEMY</h1>
      </Link>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <button onClick={logout} className="bg-gray-700 px-4 py-1 rounded-md text-sm">Logout</button>
        ) : (
          <Link to="/login" className="bg-gray-700 px-4 py-1 rounded-md text-sm">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
