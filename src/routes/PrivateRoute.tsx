// PrivateRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isTokenValidFromStorage } from "../lib/auth";

interface Props {
    children: React.ReactElement;
}

export default function PrivateRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        await isTokenValidFromStorage();
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
}