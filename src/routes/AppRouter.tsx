import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import FincaDashboard from '../pages/FincaDashboard';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Login />} />
      <Route path="/panel-finca" element={<FincaDashboard />} />
    </Routes>
  );
};

export default AppRouter;
