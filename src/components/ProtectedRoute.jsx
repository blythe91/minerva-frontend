import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ children }) {
     const isAuthenticated = false/* Tu lógica para verificar la autenticación */
  
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  }
  
  export default ProtectedRoute;