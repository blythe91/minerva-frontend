import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Api } from '../../services/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { showAlert } from '../../components/utils/Alert';
import { FaFilePdf } from 'react-icons/fa';

const EventCertificates = () => {
  const [participantEvents, setParticipantEvents] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eventName, setEventName] = useState(''); // Estado para almacenar el nombre del evento
  const [eventDetail, setEventDetail] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Captura el ID del evento desde la ruta

  // Fetch de participantes registrados en el evento específico
  useEffect(() => {
    const fetchParticipantEvents = async () => {
      setIsLoading(true);
      try {
        console.log("/////");
        console.log(id);
        console.log("/////");
        const response = await Api.get(`/participant-events/get-participants/${id}`);

        if (response.statusCode === 200 || response.status === 200) {
          setParticipantEvents(response.data);
        } else {
          showAlert('Error', 'No se pudieron cargar los datos de participantes en el evento', 'error');
          console.error('Error al cargar los datos');
        }
        const response2 = await Api.get(`/events/${id}`);
        if (response2.statusCode === 200 || response2.status === 200) {
          setEventName(response2.data.name_event); // Asignar el nombre del evento al estado
          setEventDetail(response2.data);
          console.log("/////");
          console.log(id);
          console.log("/////");
        } else {
          showAlert('Error', 'No se pudo obtener el nombre del evento', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema con la conexión a la API', 'error');
        console.error('Error de conexión con la API', error);
      }
      setIsLoading(false);
    };

    fetchParticipantEvents();
  }, [id]);

  // Filtrar datos de la tabla
  const filteredItems = participantEvents.filter(item => {
    const valuesToFilter = [
      item.pri_nom,
      item.pri_ape,
      item.name_participant_type,
      item.name_event,
      item.certificate_code,
    ];

    return valuesToFilter.some(value =>
      value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Manejador para descargar el certificado individual
  const handleDownloadCertificate = (participantid) => {
    navigate(`/certgen/${participantid}`);
  };

  function CorrelativeFormat(num, lenght) {
    return num.toString().padStart(lenght, '0');
  }
  // Manejador para generar todos los certificados
  // const handleGenerateAllCertificates = (eventId) => {
  //   if (eventId) {
  //     navigate(`/certgen-all/${eventId}`); // Redirige a la ruta para generar y descargar todos los certificados
  //   } else {
  //     showAlert('Error', 'ID del evento no disponible', 'error');
  //   }
  // };

  const redirectCertGenAll = (eventId) =>{
    if (eventId) {
      navigate(`/certgen-all/${eventId}`); // Redirige a la ruta para generar y descargar todos los certificados
    } else {
      showAlert('Error', 'ID del evento no disponible', 'error');
    }
  }

  const handleGenerateAllCertificates = async (eventId) => {
    if (!eventId) {
      showAlert('Error', 'ID del evento no disponible', 'error');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Paso 1: Obtener el último correlativo
      const correlativoResponse = await Api.get(`/id-cert-control/last-correlative/${eventDetail.event_type_id}/${new Date(eventDetail.start_date).getFullYear()}/${eventDetail.coordination_id}`);

      const lastCorrelative = parseInt(correlativoResponse.data?.last_correlative || 0);
  
      let currentCorrelative = lastCorrelative + 1; // Iniciar el nuevo correlativo
  
      const updates = participantEvents
      .filter(participant => !participant.certificate_code) // Filtra los participantes sin un certificate_code válido
      .map(participant => ({
        _id: participant._id,
        certificate_code: `${eventDetail.event_prefix}-${CorrelativeFormat(currentCorrelative++, 4)}`,
      }));
  
      if (updates.length === 0) {
        showAlert('Información', 'Todos los participantes ya tienen códigos de certificado asignados.', 'info');
        setIsLoading(false);
        redirectCertGenAll(eventId);
        return;
      }
  
      // Paso 3: Actualizar el correlativo en id-cert-control

      const updateCorrelative = {
        'eventTypeId': eventDetail.event_type_id,
        'year': new Date(eventDetail.start_date).getFullYear(),
        'coordinationId': eventDetail.coordination_id,
        'correlative': currentCorrelative-1,
      };
      // await Api.put('/id-cert-control/update-correlative', updateCorrelative);

      
      const updateResponse2 = await Api.post(`/id-cert-control/update-correlative/`,updateCorrelative);

      if (updateResponse2.statusCode === 200) {
        
        console.log('Correlativo actualizado correctamente. '+updateCorrelative);
        
      } else {
        alert('Error al actualizar el correlativo.');
      }
  
      // Paso 4: Enviar las actualizaciones a la API
      console.log(updates);
      const updateResponse = await Api.postArray('/participant-events/multiple-certificates', updates);
  
      if (updateResponse.status === 200 || updateResponse.statusCode === 200) {
        showAlert('Éxito', 'Códigos de certificado generados exitosamente.', 'success');
      } else {
        showAlert('Error', 'No se pudieron generar los códigos de certificado.', 'error');
      }
  
      // Paso 5: Refrescar los datos del componente
      const refreshedParticipants = await Api.get(`/participant-events/get-participants/${id}`);
      if (refreshedParticipants.status === 200 || refreshedParticipants.statusCode === 200) {
        setParticipantEvents(refreshedParticipants.data);
        redirectCertGenAll(eventId);
      }
    } catch (error) {
      console.error('Error al generar los códigos de certificado:', error);
      showAlert('Error', 'Ocurrió un error al generar los códigos de certificado.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  

  // Columnas de la tabla
  const columns = [
    {
      name: 'ID',
      selector: row => row._id,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => navigate(`/participant-events/${row._id}`)}
        >
          {row._id}
        </button>
      ),
    },
    {
      name: 'Nombre del Participante',
      selector: row => `${row.pri_nom} ${row.pri_ape}`,
      sortable: true,
    },
    {
      name: 'Tipo de Participante',
      selector: row => row.name_participant_type,
      sortable: true,
    },
    {
      name: 'Código de certificado',
      selector: row => row.certificate_code,
      sortable: true,
    },
    {
      name: 'Certificado',
      cell: row => (
        <button
          className="flex items-center space-x-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          onClick={() => handleDownloadCertificate(row._id)}
        >
          <FaFilePdf className="text-white" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Participantes del Evento: <br/> {eventName && `${eventName}`}
        </h2>
        
        <div className="flex space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => navigate('/events')}
          >
            Volver a Eventos
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleGenerateAllCertificates(id)}
          >
            Generar Todos los Certificados
          </button>
        </div>
      </div>

      {/* Filtro */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar en todos los campos"
          className="px-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        progressPending={isLoading}
        persistTableHead
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  );
};

export default EventCertificates;
