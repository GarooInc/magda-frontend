import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import FincaDashboard from '../pages/FincaDashboard';
import LoteDashboard from '../pages/LoteDashboard';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Login />} />
      <Route path="/panel-finca" element={<FincaDashboard />} />
      <Route path="/panel-lote" element={<LoteDashboard />} />
    </Routes>
  );
};

export default AppRouter;
