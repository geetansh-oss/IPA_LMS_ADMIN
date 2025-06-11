import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import { useApi } from '../hooks/useApi';

const Login = () => {
  const apiService = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warn('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const res = await apiService({
      method: 'POST',
      endpoint: '/login',
      data: { email, password },
    });
    setIsLoading(false);
    if (res?.token) {
      login(res.token);
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel - login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-200">
        <div className="w-full max-w-md px-6 py-10 shadow-lg rounded-lg bg-white">
          {/* Branding */}
          <div className="mb-12 text-center">
            <div className="text-2xl font-bold mb-5 flex flex-col justify-center items-center gap-2">
              <img alt='logo' src='https://IPA-Images.b-cdn.net/Assets/logo.png' className='h-[20vh]' />
              <h1>IPA EDUCATION ACADEMY</h1>
            </div>
            <p className="text-gray-700 text-sm">Login to Your Account</p>
            <p className="text-gray-500 text-xs">The faster you login, the faster we get to work.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-b border-gray-300 p-2 focus:outline-none focus:border-black"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-b border-gray-300 p-2 focus:outline-none focus:border-black"
                required
              />
            </div>

            <div className="text-sm text-right text-gray-500">
              <Link to="/forgotPassword" className="hover:underline">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 bg-black text-white py-2 rounded-md transition ${isLoading ? 'bg-gray-700 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {isLoading ? 'Logging ...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {/* Right panel - image */}
      <div className="hidden md:flex w-1/2 h-full">
        <div className="relative w-full h-full">
          <img
            src="https://IPA-Images.b-cdn.net/Assets/login.webp"
            alt="Welcome"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold text-center">Welcome Back!</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
