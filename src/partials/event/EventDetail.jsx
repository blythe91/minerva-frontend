import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../components/utils/Alert'; 
import { Api } from '../../services/Api';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';

const EventDetail = () => {
  const { id } = useParams(); 
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await Api.get(`/events/${id}`);
      if (response.statusCode === 200) {
        setEvent(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar la información del evento', 'error');
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

  const handleEdit = () => {
    navigate(`/events/edit/${event._id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este evento?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/events/${event._id}`);
        if (response.statusCode === 200) {
          showAlert('Éxito', 'Evento eliminado correctamente', 'success');
          navigate('/events');
        } else {
          showAlert('Error', 'No se pudo eliminar el evento', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema al eliminar el evento', 'error');
      }
    }
  };

  const handleGenerateCertificate = () => {
    navigate(`/events/${id}/certificates/`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          className="flex items-center space-x-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          onClick={handleGenerateCertificate}
        >
          <FaFilePdf className="text-white" />
          <span>Generar Certificados del Evento</span>
        </button>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate('/events/new')}
        >
          Agregar Evento
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">{event.name_event}</h2>

      {/* Sección de información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Nombre del Evento:</strong> {event.name_event}</p>
          <p><strong>Horas Académicas:</strong> {event.academic_hours}</p>
          <p><strong>Tipo de Evento:</strong> {event.event_type_name}</p>
          <p><strong>Modalidad del Evento:</strong> {event.event_modality || 'No especificada'}</p>
        </div>
        <div>
          <p><strong>Coordinación:</strong> {event.coordination_name}</p>
          <p><strong>Prefijo:</strong> {event.event_prefix || 'No especificado'}</p>
          <p><strong>Plantilla de Certificado:</strong> {event.certificate_template_name || 'No especificado'}</p>
        </div>
      </div>

      {/* Sección de fechas y dirección */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Fecha de Inicio:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
          <p><strong>Fecha de Fin:</strong> {new Date(event.end_date).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>Texto de Línea de Fecha [Certificado]:</strong> {event.date_line_text || 'No especificada'}</p>
          <p><strong>Dirección:</strong> {event.address || 'No especificada'}</p>
        </div>
      </div>

      {/* Información de las firmas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <p><strong>Firmante {i}:</strong> {event[`name_signature${i}`] || 'No especificado'}</p>
            <p><strong>Cargo Firmante {i}:</strong> {event[`jobtitle_signature${i}`]  || 'No especificado'}</p>
            <p><strong>Imagen Firmante {i}:</strong> {event[`image_signature${i}`]  || 'No especificado'}</p>
          </div>
        ))}
      </div>

      {/* Información adicional del evento */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div>
          <p><strong>Facilitador:</strong> {event.teacher || 'No especificado'}</p>
          <p><strong>Título del Facilitador:</strong> {event.teacher_title || 'No especificado'}</p>
        </div>
        <div>
          <p><strong>Texto libre sobre el nombre del evento  [certificado]:</strong> {event.event_open_text || 'No especificado'}</p>
          <p><strong>Contenido Programático:</strong> {event.programatic_content || 'No especificado'}</p>
        </div>
        
      </div>

      {/* Archivos de fuente y plantilla
      <div className="mb-6">
        <p><strong>Archivo de Fuente:</strong> {event.font_file_path ? event.font_file_path.split('/').pop() : 'No hay fuente cargada'}</p>
        <p><strong>Plantilla de Certificado:</strong></p>
        {event.certificate_template_path ? (
          <img src={`${process.env.REACT_APP_API_URL}/storage/${event.certificate_template_path}`} alt="Plantilla de Certificado" className="w-full h-auto max-w-xs" />
        ) : (
          <p>No hay plantilla de certificado cargada</p>
        )}
      </div> */}

      <div className="flex space-x-4 mb-4">
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={handleBack}>
          Volver
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleEdit}>
          Editar
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default EventDetail;
