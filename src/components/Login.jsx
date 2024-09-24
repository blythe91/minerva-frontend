import React, { useState } from 'react';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    // Aquí se agregarían las validaciones o el envío de la información.
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
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

