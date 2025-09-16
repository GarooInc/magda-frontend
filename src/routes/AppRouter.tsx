import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import FincaDashboard from "../pages/FincaDashboard";
import PrivateRoute from "./PrivateRoute";
import LoteDashboard from "../pages/LoteDashboard";
import LoteDetail from "../pages/LoteDetail";
import FormUpload from "../pages/FormUpload";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="/panel-finca" element={<FincaDashboard />} />
        <Route path="/panel-lote">
          <Route index element={<LoteDashboard />} />
          <Route path=":loteId" element={<LoteDetail />} />
        </Route>
      </Route>

      <Route
          path="/formulario/:id_poligono"
          element={<FormUpload />}
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
