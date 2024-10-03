import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { showAlertTopEnd, showAlert } from '../../components/utils/Alert'; // alertas
import { Api } from '../../services/Api'; // conexión a la API
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para la navegación

const StaffTable = () => {
  const [staffList, setStaffList] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  // Fetch de los datos de Staff
  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      try {
        const response = await Api.get('/staff'); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          setStaffList(response.data);
        } else {
          showAlert('Error', 'No se pudieron cargar los datos del personal', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema con la conexión', 'error');
      }
      setIsLoading(false);
    };

    fetchStaff();
  }, []);

  // Función para filtrar los elementos
  const filteredItems = staffList.filter(item => {
    const valuesToFilter = [
      item.pri_nom,
      item.seg_nom,
      item.pri_ape,
      item.seg_ape,
      item.cedula,
      item.celular,
      item.email,
      item.direccion,
      item.codigo_postal,
      item.grado_instruccion,
      item.titulo,
    ];

    return valuesToFilter.some(value =>
      value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Columnas de la tabla
  const columns = [
    {
      name: 'Nombre Completo',
      selector: row => `${row.pri_nom} ${row.seg_nom || ''} ${row.pri_ape} ${row.seg_ape || ''}`,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline text-left"
          onClick={() => handleRowClick(row._id)} // Redirige al detalle del personal
        >
          {row.pri_nom} {row.seg_nom} {row.pri_ape} {row.seg_ape}
        </button>
      ),
    },
    {
      name: 'Cédula',
      selector: row => row.cedula,
      sortable: true,
    },
    {
      name: 'Celular',
      selector: row => row.celular,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Dirección',
      selector: row => row.direccion,
      sortable: true,
    },
    {
      name: 'Grado de Instrucción',
      selector: row => row.grado_instruccion,
      sortable: true,
    },
    {
      name: 'Título',
      selector: row => row.titulo,
      sortable: true,
    },
  ];

  // Manejador de clic en el nombre
  const handleRowClick = (id) => {
    navigate(`/staff/${id}`); // Redirige al componente de detalles
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Personal</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate('/staff/new')} // Redirige a la ruta de agregar personal
        >
          Agregar Personal
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

export default StaffTable;
