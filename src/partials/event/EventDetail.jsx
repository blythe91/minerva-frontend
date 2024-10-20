import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../components/utils/Alert'; //alertas
import { Api } from '../../services/Api'; //conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const EventDetail = () => {
  const { id } = useParams(); // Obtiene el ID del evento desde la URL
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await Api.get(`/events/${id}`); // Ajusta el endpoint según sea necesario
      if (response.statusCode === 200) {
        setEvent(response.data);
      } else {
        showAlertTopEnd('Error', 'No se pudo cargar la información del evento', 'error');
      }
      setIsLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!event) {
    return <div className="p-6">No se encontró el evento.</div>;
  }

  // Funciones de manejo de eventos
  const handleEdit = () => {
    navigate(`/events/edit/${event._id}`); // Ajusta la ruta de edición según tu estructura
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este evento?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/events/${event._id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          showAlertTopEnd('Éxito', 'Evento eliminado correctamente', 'success');
          navigate('/events'); // Redirigir a la lista de eventos
        } else {
          showAlertTopEnd('Error', 'No se pudo eliminar el evento', 'error');
        }
      } catch (error) {
        showAlertTopEnd('Error', 'Hubo un problema al eliminar el evento', 'error');
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
          onClick={() => navigate('/events/new')} // Redirige a la ruta de agregar evento
        >
          Agregar Evento
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">{event.name_event}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Nombre del Evento:</strong> {event.name_event}</p>
          <p><strong>Horas Académicas:</strong> {event.academic_hours}</p>
          <p><strong>Tipo de Evento:</strong> {event.event_type_name}</p>
        </div>
        <div>
          <p><strong>Coordinación:</strong> {event.coordination_name}</p>
          <p><strong>Prefijo:</strong> {event.event_prefix || 'No especificado'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Fecha de Inicio:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
          <p><strong>Fecha de Fin:</strong> {new Date(event.end_date).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>Dirección:</strong> {event.address || 'No especificada'}</p>
        </div>
      </div>

      {/* Desplegar información de la fuente y la plantilla de certificado */}
      <div className="mb-6">
        <p><strong>Archivo de Fuente:</strong> {event.font_file_path ? event.font_file_path.split('/').pop() : 'No hay fuente cargada'}</p>
        <p><strong>Plantilla de Certificado:</strong></p>
        {event.certificate_template_path ? (
          <img src={`${process.env.REACT_APP_API_URL}/storage/${event.certificate_template_path}`} alt="Plantilla de Certificado" className="w-full h-auto max-w-xs" />
        ) : (
          <p>No hay plantilla de certificado cargada</p>
        )}
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

export default EventDetail;
