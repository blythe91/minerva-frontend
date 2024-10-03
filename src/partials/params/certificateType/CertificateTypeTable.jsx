import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { showAlert } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para la navegación

const CertificateTypeTable = () => {
  const [certificateTypes, setCertificateTypes] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  // Fetch Certificate Types
  useEffect(() => {
    const fetchCertificateTypes = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching certificate types...");
        const response = await Api.get('/certificate-types'); // Ajusta el endpoint según sea necesario
        console.log("API response received");
        if (response.statusCode === 200) {
          setCertificateTypes(response.data);
        } else {
          showAlert('Error', 'No se pudieron cargar los tipos de certificados', 'error');
          console.log(response);
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema con la conexión', 'error');
      }
      setIsLoading(false);
    };

    fetchCertificateTypes();
  }, []);

  // Función para filtrar los elementos
  const filteredItems = certificateTypes.filter(item => {
    const valuesToFilter = [
      item.name_certificate_type,
      item.description_certificate_type,
    ];

    return valuesToFilter.some(value =>
      value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Columnas de la tabla
  const columns = [
    {
      name: 'ID',
      selector: row => row._id,
      sortable: true,
    },
    {
      name: 'Nombre del Certificado',
      selector: row => row.name_certificate_type,
      sortable: true,
      cell: row => (
        <button
          className="text-blue-500 hover:underline text-left"
          onClick={() => handleRowClick(row._id)} // Redirige al detalle del tipo de certificado
        >
          {row.name_certificate_type}
        </button>
      ),
    },
    {
      name: 'Descripción',
      selector: row => row.description_certificate_type,
      sortable: true,
    },
  ];

  // Manejador de clic en el nombre
  const handleRowClick = (id) => {
    navigate(`/certificate-types/${id}`); // Redirige al componente de detalles
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Tipos de Certificados</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate('/certificate-types/new')} // Redirige a la ruta de agregar tipo de certificado
        >
          Agregar Tipo de Certificado
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

export default CertificateTypeTable;
