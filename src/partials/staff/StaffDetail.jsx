import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../components/utils/Alert'; // alertas
import { Api } from '../../services/Api'; // conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const StaffDetail = () => {
  const { id } = useParams(); // Obtiene el ID del personal desde la URL
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchStaff = async () => {
      const response = await Api.get(`/staff/${id}`); // Ajusta el endpoint según sea necesario
      if (response.statusCode === 200) {
        setStaff(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar la información del personal', 'error');
      }
      setIsLoading(false);
    };

    fetchStaff();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!staff) {
    return <div className="p-6">No se encontró el personal.</div>;
  }

  // Funciones de manejo de eventos
  const handleEdit = () => {
    navigate(`/staff/edit/${staff._id}`); // Redirige a la ruta de edición del personal
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este miembro del personal?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/staff/${staff._id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          showAlert('Éxito', 'Personal eliminado correctamente', 'success');
          navigate('/staff'); // Redirige a la lista de personal
        } else {
          showAlert('Error', 'No se pudo eliminar el personal', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema al eliminar el personal', 'error');
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
          onClick={() => navigate('/staff/new')} // Redirige a la ruta de agregar personal
        >
          Agregar Personal
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">
        {staff.pri_nom} {staff.seg_nom} {staff.pri_ape} {staff.seg_ape}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Cédula:</strong> {staff.cedula}</p>
          <p><strong>Teléfono:</strong> {staff.celular}</p>
          <p><strong>Email:</strong> {staff.email}</p>
        </div>
        <div>
          <p><strong>Dirección:</strong> {staff.direccion}</p>
          <p><strong>Código Postal:</strong> {staff.codigo_postal}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Grado de Instrucción:</strong> {staff.grado_instruccion}</p>
          <p><strong>Título:</strong> {staff.titulo || 'N/A'}</p>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Creado:</strong> {new Date(staff.created_at).toLocaleDateString()}</p>
          <p><strong>Última Actualización:</strong> {new Date(staff.updated_at).toLocaleDateString()}</p>
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

export default StaffDetail;
