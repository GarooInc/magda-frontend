// src/router/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import FincaDashboard from "../pages/FincaDashboard";
import PrivateRoute from "./PrivateRoute";
import { isTokenValidFromStorage } from "../lib/auth";
import LoteDashboard from "../pages/LoteDashboard";
import LoteDetail from "../pages/LoteDetail";

const AppRouter = () => {
  const alreadyLoggedIn = isTokenValidFromStorage();

  return (
    <Routes>
      <Route
        path="/login"
        element={alreadyLoggedIn ? <Navigate to="/panel-finca" replace /> : <Login />}
      />

      <Route element={<PrivateRoute />}>
        <Route path="/panel-finca" element={<FincaDashboard />} />

        <Route path="/panel-lote" >
          <Route index element={<LoteDashboard />} />               {/* /panel-lote */}
          <Route path=":loteId" element={<LoteDetail />} />    {/* /panel-lote/123 */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={alreadyLoggedIn ? "/panel-finca" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRouter;