import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { routes } from './routes/route'; // Si estás usando el archivo route.ts
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
    
      <Routes>
        <Route path="/" element={
          <ProtectedRoute> 
            <Dashboard /> 
          </ProtectedRoute>} 
        />
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
      </Routes>
    </>
  );
}

export default App;
