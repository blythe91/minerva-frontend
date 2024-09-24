import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Importar useDispatch
import { login } from '../store/authSlice'; // Importar el action login
import { Api } from '../services/Api';
import { showAlert } from '../components/Alert';  // Importar el componente de alertas


const Login = () => {
  const dispatch = useDispatch(); // Inicializar el dispatch

  // Valores iniciales del formulario
  const initialValues = {
    email: '',
    password: ''
  };

  // Estado para los valores del formulario
  const [values, setValues] = useState(initialValues);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value, // Actualiza el campo correspondiente (email o password)
    });
  };

  // onSubmit para manejar el envío del formulario
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Ingresa al onSubmit");
    console.log(values);

    // Enviar la petición a la API
    const response = await Api.post('/auth/login', values);
    console.log("respuesta de api");
    console.log(response);
    // Si la autenticación es exitosa
    if (response.statusCode === 200) {
      // Mostrar alerta de éxito
      showAlert('¡Éxito!', 'Inicio de sesión exitoso', 'success');

      // Dispatch para cambiar el estado de autenticación
      dispatch(login());
      return
    }
    if (response.statusCode === 401) {
      // Indicar mensaje de login fallido
      //showAlert('Error','Credenciales incorrectas', 'error');
      showAlert('Error',response.data.error+" ("+response.statusCode+")" || 'Hubo un problema con el inicio de sesión', 'error');
      return
    } else {
        // Mostrar alerta de error en caso de fallo
      showAlert('Error',response.data.message+" ("+response.statusCode+")" || 'Hubo un problema con el inicio de sesión', 'error');
    }
      

     
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {/* Logo de la aplicación */}
        <div className="text-center mb-6">
          <img
            src="/di.png" // Cambia esta ruta por la ubicación de tu logo
            alt="Logo del sistema"
            className="mx-auto h-25"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h2>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              name="email" // Asigna el name para acceder al valor
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.email}
              onChange={handleChange} // Cambia al controlador handleChange
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password" // Asigna el name para acceder al valor
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.password}
              onChange={handleChange} // Cambia al controlador handleChange
              required
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        {/* Enlace para registro y recuperar contraseña */}
        <div className="text-center">
          <a
            href="/register" // Enlace a la página de registro
            className="text-sm text-blue-500 hover:underline"
          >
            Registrarse
          </a>
          <br />
          <a
            href="/forgot-password" // Enlace a la página de recuperar contraseña
            className="text-sm text-blue-500 hover:underline mt-2"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;


