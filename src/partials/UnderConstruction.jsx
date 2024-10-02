import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnderConstruction = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">¡En construcción!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, esta sección aún está en desarrollo.
        </p>
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          onClick={handleBack}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default UnderConstruction;
