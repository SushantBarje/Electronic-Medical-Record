import React from 'react';
import PropTypes from 'prop-types';
import styles from './RequireAuth.module.css';

import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRole }) => {
  
  const { auth } = useAuth();
  const location = useLocation();
  console.log(auth);
  
  return (
    (auth?.role === allowedRole) ? <Outlet /> :
    auth?.username ? <Navigate to="/unauthorized" state={{from: location}} replace/> :
    <Navigate to="/" state={{from : location}} replace />
  );

};

RequireAuth.propTypes = {};

RequireAuth.defaultProps = {};

export default RequireAuth;
