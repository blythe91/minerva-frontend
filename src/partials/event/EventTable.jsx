import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { showAlert } from '../../components/utils/Alert'; // alertas
import { Api } from '../../services/Api'; // conexión a la API
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para la navegación

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await Api.get('/events'); // Ajusta el endpoint según sea necesario

        if (response.statusCode === 200) {
          setEvents(response.data);
        } else {
          showAlert('Error', 'No se pudieron cargar los eventos', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema con la conexión', 'error');
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  // Función para filtrar los elementos
  const filteredItems = events.filter(item => {
    const valuesToFilter = [
      item.name_event,
      item.start_date,
      item.end_date,
      item.event_type_name,
      item.address,
    ];

    return valuesToFilter.some(value =>
      value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Columnas de la tabla
  const columns = [
    {
      name: 'Nombre del Evento',
      selector: row => row.name_event,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => handleRowClick(row._id)} // Redirige al detalle del evento
        >
          {row.name_event}
        </button>
      ),
    },
    {
      name: 'Fecha de Inicio',
      selector: row => row.start_date,
      sortable: true,
    },
    {
      name: 'Fecha de Fin',
      selector: row => row.end_date,
      sortable: true,
    },
    {
      name: 'Tipo de Evento',
      selector: row => row.event_type_name,
    },
    {
      name: 'Dirección',
      selector: row => row.address,
    },
  ];

  // Manejador de clic en el nombre
  const handleRowClick = (id) => {
    navigate(`/events/${id}`); // Redirige al componente de detalles
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Eventos</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate('/events/new')} // Redirige a la ruta de agregar evento
        >
          Agregar Evento
        </button>
      </div>

      {/* Filtros */}
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
        paginationPerPage={10} // Puedes ajustar esto según tus necesidades
        paginationRowsPerPageOptions={[5, 10, 20, 50, 100]} // Opciones para el número de filas por página
      />
    </div>
  );
};

export default EventTable;
