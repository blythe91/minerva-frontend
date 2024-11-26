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
      item.name_certificate_type,
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

  // Manejador para generar todos los certificados
  const handleGenerateAllCertificates = (eventId) => {
    if (eventId) {
      navigate(`/certgen-all/${eventId}`); // Redirige a la ruta para generar y descargar todos los certificados
    } else {
      showAlert('Error', 'ID del evento no disponible', 'error');
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
      name: 'Tipo de Certificado',
      selector: row => row.name_certificate_type,
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
