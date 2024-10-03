import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const ParticipantTypeDetail = () => {
  const { id } = useParams(); // Obtiene el ID del tipo de participante desde la URL
  const [participantType, setParticipantType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchParticipantType = async () => {
      const response = await Api.get(`/participant-types/${id}`); // Ajusta el endpoint según sea necesario
      if (response.statusCode === 200) {
        setParticipantType(response.data);
      } else {
        showAlertTopEnd('Error', 'No se pudo cargar la información del tipo de participante', 'error');
      }
      setIsLoading(false);
    };

    fetchParticipantType();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!participantType) {
    return <div className="p-6">No se encontró el tipo de participante.</div>;
  }

  // Funciones de manejo de eventos
  const handleEdit = () => {
    navigate(`/participant-types/edit/${participantType._id}`); // Ajusta la ruta de edición según tu estructura
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este tipo de participante?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/participant-types/${participantType._id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          showAlertTopEnd('Éxito', 'Tipo de participante eliminado correctamente', 'success');
          navigate('/participant-types'); // Redirigir a la lista de tipos de participante
        } else {
          showAlertTopEnd('Error', 'No se pudo eliminar el tipo de participante', 'error');
        }
      } catch (error) {
        showAlertTopEnd('Error', 'Hubo un problema al eliminar el tipo de participante', 'error');
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
          onClick={() => navigate('/participant-types/new')} // Redirige a la ruta de agregar tipo de participante
        >
          Agregar Tipo de Participante
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">{participantType.name_participant_type}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Nombre del Tipo de Participante:</strong> {participantType.name_participant_type}</p>
          <p><strong>Descripción:</strong> {participantType.description_participant_type}</p>
          <p><strong>Creado en:</strong> {new Date(participantType.created_at).toLocaleDateString()}</p>
          <p><strong>Actualizado en:</strong> {new Date(participantType.updated_at).toLocaleDateString()}</p>
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

export default ParticipantTypeDetail;
