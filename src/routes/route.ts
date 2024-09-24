import Login from "../components/Login";
import Dashboard from "../pages/Dashboard";
import Welcome from "../pages/Welcome";
import Register from "../components/Register"; // Importa el componente de registro
import ForgotPassword from "../components/ForgotPassword"; // Importa el componente para recuperar contraseña

export const routes = [
  {
    path: '/',
    element: Welcome, // Página de bienvenida
  },
  {
    path: '/login',
    element: Login, // Página de inicio de sesión
  },
  {
    path: '/register',
    element: Register, // Página de registro
  },
  {
    path: '/forgot-password',
    element: ForgotPassword, // Página de recuperar contraseña
  },
  {
    path: '/dashboard',
    element: Dashboard, // Página del Dashboard (Protegida)
  }
];