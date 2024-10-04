import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../components/utils/Alert'; // alertas
import { Api } from '../../services/Api'; // conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const ParticipantEventDetail = () => {
  const { id } = useParams(); // Obtiene el ID del registro de ParticipantEvent desde la URL
  const [participantEvent, setParticipantEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchParticipantEvent = async () => {
      try {
        const response = await Api.get(`/participant-events/${id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          setParticipantEvent(response.data);
        } else {
          showAlertTopEnd('Error', 'No se pudo cargar la información del evento del participante', 'error');
        }
      } catch (error) {
        showAlertTopEnd('Error', 'Hubo un problema con la conexión', 'error');
      }
      setIsLoading(false);
    };

    fetchParticipantEvent();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!participantEvent) {
    return <div className="p-6">No se encontró el evento del participante.</div>;
  }

  const handleEdit = () => {
    navigate(`/participant-events/edit/${participantEvent._id}`); // Redirige a la página de edición
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este registro de participante en evento?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/participant-events/${participantEvent._id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          showAlertTopEnd('Éxito', 'Registro eliminado correctamente', 'success');
          navigate('/participant-events'); // Redirigir a la lista de eventos del participante
        } else {
          showAlertTopEnd('Error', 'No se pudo eliminar el registro', 'error');
        }
      } catch (error) {
        showAlertTopEnd('Error', 'Hubo un problema al eliminar el registro', 'error');
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Detalle del Evento del Participante</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>ID del Registro:</strong> {participantEvent._id}</p>
          <p><strong>Cédula:</strong> {participantEvent.cedula}</p>
          <p><strong>Nombre del Participante:</strong> {`${participantEvent.pri_nom} ${participantEvent.seg_nom} ${participantEvent.pri_ape} ${participantEvent.seg_ape}`}</p>
          <p><strong>Email:</strong> {participantEvent.email}</p>
        </div>
        <div>
          <p><strong>Evento:</strong> {participantEvent.name_event}</p>
          <p><strong>Tipo de Evento:</strong> {participantEvent.event_type_name}</p>
          <p><strong>Coordinación:</strong> {participantEvent.coordination_name}</p>
          <p><strong>Prefijo del Evento:</strong> {participantEvent.event_prefix || 'No asignado'}</p>
          <p><strong>Tipo de Participante:</strong> {participantEvent.name_participant_type}</p>
          <p><strong>Tipo de Certificado:</strong> {participantEvent.name_certificate_type}</p>
          <p><strong>Creado en:</strong> {new Date(participantEvent.created_at).toLocaleDateString()}</p>
          <p><strong>Actualizado en:</strong> {new Date(participantEvent.updated_at).toLocaleDateString()}</p>
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

export default ParticipantEventDetail;
