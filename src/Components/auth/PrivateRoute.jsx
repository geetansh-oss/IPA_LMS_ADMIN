import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from '../../Context/AuthContext'

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
