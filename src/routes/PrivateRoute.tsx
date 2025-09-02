import { Navigate, Outlet } from "react-router-dom";
import { isTokenValidFromStorage } from "../lib/auth";

export default function PrivateRoute() {
  const ok = isTokenValidFromStorage();
  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}