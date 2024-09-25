import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute() {
  /* Tu lógica para verificar la autenticación */   

    var isAuthenticated = true;
    console.log('isAuthenticated en ProtectedRoute1:', isAuthenticated);
    console.log('ingresa al componente ProtectedRoute para verificar permisos');
    console.log('isAuthenticated en ProtectedRoute:', (state) => state.auth.isAuthenticated);
     isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    console.log('isAuthenticated en ProtectedRoute2:', isAuthenticated);

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    return <Outlet />; // Renderiza los componentes hijos;
  }
  
  export default ProtectedRoute;