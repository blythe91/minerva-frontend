import React, { useEffect } from 'react';
import './css/style.css';
import {Routes,Route,useLocation,Navigate,} from 'react-router-dom';
import { Provider } from 'react-redux'; // Importar Provider
import store from './store/store'; // Importar el store
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import ProtectedRoute from './components/utils/ProtectedRoute';
import { routes } from './routes/route'; // Si estás usando el archivo route.ts
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ParticipantTable from './partials/participant/ParticipantTable';
import ParticipantDetail from './partials/participant/ParticipantDetail';
import ParticipantForm from './partials/participant/ParticipantForm';
import EventTable from './partials/event/EventTable';
import EventDetail from './partials/event/EventDetail';
import EventForm from './partials/event/EventForm';
import EventRoleTable from './partials/params/eventRole/EventRoleTable';
import EventRoleForm from './partials/params/eventRole/EventRoleForm';
import EventRoleDetail from './partials/params/eventRole/EventRoleDetail';
import UnderConstruction from './partials/UnderConstruction';






function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      
      <Provider store={store}> {/* Envolver con el Provider */}
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          
          <Route path="/" element={<Dashboard />}> 
            {/* componentes hijos de Dashboard */}
            <Route path="/participants" element={<ParticipantTable />} />
            <Route path="/participants/:id" element={<ParticipantDetail />} />
            <Route path="/participants/edit/:id" element={<ParticipantForm />} />
            <Route path="/participants/new" element={<ParticipantForm />} />

            <Route path="/events" element={<EventTable />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/edit/:id" element={<EventForm />} />
            <Route path="/events/new" element={<EventForm />} />


             <Route path="/event-roles" element={<EventRoleTable />} />
             <Route path="/event-roles/:id" element={<EventRoleDetail />} />
             <Route path="/event-roles/new" element={<EventRoleForm />} />
             <Route path="/event-roles/edit/:id" element={<EventRoleForm />} />
          </Route>
          <Route path="/empty" element={<UnderConstruction />} />

          {/* <Route path="/" element={
            <ProtectedRoute> 
              <Dashboard /> 
            </ProtectedRoute>} 
          /> */}

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/" element={<Dashboard />} />  */}
            {/* Ruta principal que puede redirigir al Dashboard */}
            {/* Agrega aquí más rutas que necesiten ser protegidas */}
            {/* Por ejemplo: */}
            {/* <Route path="/dashboard/another-component" element={<AnotherComponent />} /> */}
          </Route>
          
        </Routes>
      </Provider>
    </>
  );
}

export default App;
