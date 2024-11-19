import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const CoordinationDetail = () => {
  const { id } = useParams(); // Obtiene el ID de la coordinación desde la URL
  const [coordination, setCoordination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchCoordination = async () => {
      const response = await Api.get(`/coordinations/${id}`); // Ajusta el endpoint según sea necesario
      if (response.statusCode === 200) {
        setCoordination(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar la información de la coordinación', 'error');
      }
      setIsLoading(false);
    };

    fetchCoordination();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!coordination) {
    return <div className="p-6">No se encontró la coordinación.</div>;
  }

  // Funciones de manejo de eventos
  const handleEdit = () => {
    navigate(`/coordinations/edit/${coordination._id}`); // Ajusta la ruta de edición según tu estructura
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta coordinación?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/coordinations/${coordination._id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          showAlert('Éxito', 'Coordinación eliminada correctamente', 'success');
          navigate('/coordinations'); // Redirigir a la lista de coordinaciones
        } else {
          showAlert('Error', 'No se pudo eliminar la coordinación', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema al eliminar la coordinación', 'error');
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate('/coordinations/new')} // Redirige a la ruta de agregar nueva coordinación
        >
          Agregar Coordinación
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">{coordination.name_coordination}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Nombre de la Coordinación:</strong> {coordination.name_coordination}</p>
          <p><strong>Descripción:</strong> {coordination.description_coordination || 'No tiene descripción.'}</p>
          <p><strong>Fecha de Creación:</strong> {new Date(coordination.created_at).toLocaleDateString()}</p>
          <p><strong>Última Actualización:</strong> {new Date(coordination.updated_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={handleBack}
        >
          Volver
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleEdit}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CoordinationDetail;
