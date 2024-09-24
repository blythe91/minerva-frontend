import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email });
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

        <h2 className="text-2xl font-semibold text-center mb-6">Recuperar Contraseña</h2>
        
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
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Enviar enlace de recuperación
            </button>
          </div>
        </form>

        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-blue-500 hover:underline"
          >
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
