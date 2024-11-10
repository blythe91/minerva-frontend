import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { showAlertTopEnd, showAlert } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para la navegación

const IdCertControlTable = () => {
  const [idCertControls, setIdCertControls] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  // Fetch idCertControls
  useEffect(() => {
    const fetchIdCertControls = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching idCertControl data...");
        const response = await Api.get('/id-cert-controls'); // Ajusta el endpoint según tu ruta
        if (response.statusCode === 200 || response.status === 200) {
          setIdCertControls(response.data);
        } else {
          showAlert('Error', 'No se pudieron cargar los registros de control', 'error');
          console.log(response);
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema con la conexión', 'error');
      }
      setIsLoading(false);
    };

    fetchIdCertControls();
  }, []);

  // Función para filtrar los elementos
  const filteredItems = idCertControls.filter(item => {
    const valuesToFilter = [
      item.coordination_name,
      item.event_type_name,
      item.event_type_abrev,
      item.year,
      item.correlative.toString(), // Convertir a string para filtrar
    ];

    return valuesToFilter.some(value =>
      value && value.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Columnas de la tabla
  const columns = [
    {
      name: 'ID',
      selector: row => row._id,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline text-left"
          onClick={() => handleRowClick(row._id)} // Redirige al detalle del registro
        >
          {row._id}
        </button>
      ),
    },
    {
      name: 'Nombre de la Coordinación',
      selector: row => row.coordination_name,
      sortable: true,
    },
    {
      name: 'Abreviatura del Tipo de Evento',
      selector: row => row.event_type_abrev,
      sortable: true,
    },
    {
      name: 'Nombre del Tipo de Evento',
      selector: row => row.event_type_name,
      sortable: true,      
    },
    {
      name: 'Año',
      selector: row => row.year,
      sortable: true,
    },
    {
      name: 'Correlativo',
      selector: row => row.correlative,
      sortable: true,
    },
  ];

  // Manejador de clic en el nombre
  const handleRowClick = (id) => {
    navigate(`/id-cert-controls/${id}`); // Redirige al componente de detalles
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Control de Correlativos de Certificados</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate('/id-cert-controls/new')} // Redirige a la ruta de agregar registro
        >
          Agregar Registro de Control
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

export default IdCertControlTable;
