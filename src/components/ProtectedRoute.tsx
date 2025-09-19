// components/ProtectedRoute.tsx
import React, { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = { children: JSX.Element };

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/signIn" replace state={{ from: location }} />;
  }

  return children;
};
