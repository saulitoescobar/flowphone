import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UsuariosPage from './pages/UsuariosPage';
import LineasPage from './pages/LineasPage';
import EmpresasPage from './pages/EmpresasPage';
import ProveedoresPage from './pages/ProveedoresPage';
import PlanesPage from './pages/PlanesPage';
import AsesoresPage from './pages/AsesoresPage';
import TestPage from './pages/TestPage';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar />
        <div className="flex-1 flex flex-col pl-16 md:pl-0">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/lineas" element={<LineasPage />} />
            <Route path="/empresas" element={<EmpresasPage />} />
            <Route path="/proveedores" element={<ProveedoresPage />} />
            <Route path="/planes" element={<PlanesPage />} />
            <Route path="/asesores" element={<AsesoresPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
