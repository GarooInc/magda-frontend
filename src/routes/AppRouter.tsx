import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import FincaDashboard from "../pages/FincaDashboard";
import LoteDashboard from "../pages/LoteDashboard";
import PrivateRoute from "./PrivateRoute";
import { isTokenValidFromStorage } from "../lib/auth";

const AppRouter = () => {
  const alreadyLoggedIn = isTokenValidFromStorage();
  console.log("User is logged in:", alreadyLoggedIn);

  return (
    <Routes>
      <Route
        path="/login"
        element={alreadyLoggedIn ? <Navigate to="/panel-finca" replace /> : <Login />}
      />

      <Route
        path="/panel-finca"
        element={
          <PrivateRoute>
            <FincaDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/panel-lote"
        element={
          <PrivateRoute>
            <LoteDashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
