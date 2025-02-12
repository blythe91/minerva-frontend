import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Api } from '../../services/Api'; // Conexión a la API
import { useNavigate } from 'react-router-dom'; // Para la navegación
import { showAlert } from '../../components/utils/Alert'; // Importa la función showAlert

const ParticipantEventTable = () => {
  const [participantEvents, setParticipantEvents] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  // Fetch ParticipantEvent data
  useEffect(() => {
    const fetchParticipantEvents = async () => {
      setIsLoading(true);
      try {
        const response = await Api.get('/participant-events'); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          setParticipantEvents(response.data);
        } else {
          showAlert('Error', 'No se pudieron cargar los datos de participantes en eventos', 'error');
          console.error('Error al cargar los datos');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema con la conexión a la API', 'error'); // Despliega alerta de error
        console.error('Error de conexión con la API', error);
      }
      setIsLoading(false);
    };

    fetchParticipantEvents();
  }, []);

  // Filtrar los datos de la tabla
  const filteredItems = participantEvents.filter(item => {
    const valuesToFilter = [
      item.cedula,
      item.pri_nom,
      item.pri_ape,
      item.name_participant_type,
      item.name_event,
      item.event_prefix,
    ];

    return valuesToFilter.some(value =>
      value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Manejador para el clic en el ID
  const handleIdClick = (id) => {
    navigate(`/participant-events/${id}`); // Redirige al detalle del registro
  };

  // Manejador para el clic en el nombre del evento
  const handleEventClick = (id) => {
    navigate(`/events/${id}`); // Redirige al detalle del evento
  };

  // Manejador para el clic en el nombre del participante
  const handleParticipantClick = (id) => {
    navigate(`/participants/${id}`); // Redirige al detalle del participante
  };

  // Manejador para el clic en el tipo de participante
  const handleParticipantTypeClick = (id) => {
    navigate(`/participant-types/${id}`); // Redirige al detalle del tipo de participante
  };

  // Manejador para el clic en el tipo de certificado
  const handleCertificateTypeClick = (id) => {
    navigate(`/certificate-types/${id}`); // Redirige al detalle del tipo de certificado
  };

  // Manejador para el botón de agregar participante en evento
  const handleAddParticipantEvent = () => {
    navigate('/participant-events/new'); // Redirige al formulario para agregar un nuevo participante en un evento
  };

  // Columnas de la tabla
  const columns = [
    {
      name: 'ID',
      selector: row => row._id,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline text-left"
          onClick={() => handleIdClick(row._id)}
        >
          {row._id}
        </button>
      ),
    },
    {
      name: 'Cédula',
      selector: row => row.cedula,
      sortable: true,

    },
    
    {
      name: 'Nombre del Participante',
      selector: row => `${row.pri_nom} ${row.pri_ape}`,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline text-left"
          onClick={() => handleParticipantClick(row.participant_id)}
        >
          {`${row.pri_nom} ${row.pri_ape}`}
        </button>
      ),
    },
    {
      name: 'Tipo de Participante',
      selector: row => row.name_participant_type,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline text-left"
          onClick={() => handleParticipantTypeClick(row.participant_type_id)}
        >
          {row.name_participant_type}
        </button>
      ),
    },
    {
      name: 'Nombre de Evento',
      selector: row => row.name_event,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline text-left"
          onClick={() => handleEventClick(row.event_id)}
        >
          {row.name_event}
        </button>
      ),
    },
    {
      name: 'Prefijo del Evento',
      selector: row => row.event_prefix,
      sortable: true,
    },
  ];

  const handleUpdateFields = () => {
    navigate('/update-fields'); // Redirecciona al componente UpdateFields
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-end mb-4">
          <button
            onClick={handleUpdateFields}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Actualizar Campos de Participantes
          </button>
        </div>
      <div className="flex justify-between items-center mb-4">

        
        <h2 className="text-2xl font-bold">Lista de Participantes en Eventos</h2>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddParticipantEvent} // Llama al manejador para agregar un nuevo participante en evento
        >
          Agregar Participante en Evento
        </button>
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

export default ParticipantEventTable;
