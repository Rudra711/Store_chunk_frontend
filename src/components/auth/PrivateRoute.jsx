// src/components/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../lib/context/user";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return null; // or loading spinner

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
