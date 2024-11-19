import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const EventRoleDetail = () => {
  const { id } = useParams(); // Obtiene el ID del rol desde la URL
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchRole = async () => {
      const response = await Api.get(`/event-roles/${id}`); // Ajusta el endpoint según sea necesario
      if (response.statusCode === 200) {
        setRole(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar la información del rol', 'error');
      }
      setIsLoading(false);
    };

    fetchRole();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!role) {
    return <div className="p-6">No se encontró el rol.</div>;
  }

  // Funciones de manejo de eventos
  const handleEdit = () => {
    navigate(`/event-roles/edit/${role._id}`); // Ajusta la ruta de edición según tu estructura
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este rol?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/event-roles/${role._id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          showAlert('Éxito', 'Rol eliminado correctamente', 'success');
          navigate('/event-roles'); // Redirigir a la lista de roles
        } else {
          showAlert('Error', 'No se pudo eliminar el rol', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema al eliminar el rol', 'error');
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
          onClick={() => navigate('/event-roles/new')} // Redirige a la ruta de agregar rol
        >
          Agregar Rol
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">{role.name_event_role}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Nombre del Rol:</strong> {role.name_event_role}</p>
          <p><strong>Descripción:</strong> {role.description_event_role}</p>
          <p><strong>Creado en:</strong> {new Date(role.created_at).toLocaleDateString()}</p>
          <p><strong>Actualizado en:</strong> {new Date(role.updated_at).toLocaleDateString()}</p>
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

export default EventRoleDetail;
