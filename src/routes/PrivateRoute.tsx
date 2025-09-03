import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isTokenValidFromStorage } from "../lib/auth";

export default function PrivateRoute() {
  const ok = isTokenValidFromStorage();
  const location = useLocation();
  return ok ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
