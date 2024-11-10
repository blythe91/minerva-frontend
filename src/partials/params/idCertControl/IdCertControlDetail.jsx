import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const IdCertControlDetail = () => {
  const { id } = useParams(); // Obtiene el ID del registro desde la URL
  const [idCertControl, setIdCertControl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchIdCertControl = async () => {
      try {
        const response = await Api.get(`/id-cert-controls/${id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          setIdCertControl(response.data);
        } else {
          showAlertTopEnd('Error', 'No se pudo cargar la información del control de certificación', 'error');
        }
      } catch (error) {
        showAlertTopEnd('Error', 'Hubo un problema al cargar el control de certificación', 'error');
      }
      setIsLoading(false);
    };

    fetchIdCertControl();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!idCertControl) {
    return <div className="p-6">No se encontró el registro de control de certificación.</div>;
  }

  // Funciones de manejo de eventos
  const handleEdit = () => {
    navigate(`/id-cert-controls/edit/${idCertControl._id}`); // Ajusta la ruta de edición según tu estructura
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este registro de control de certificación?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/id-cert-controls/${idCertControl._id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          showAlertTopEnd('Éxito', 'Registro eliminado correctamente', 'success');
          navigate('/id-cert-controls'); // Redirigir a la lista de controles de certificación
        } else {
          showAlertTopEnd('Error', 'No se pudo eliminar el registro', 'error');
        }
      } catch (error) {
        showAlertTopEnd('Error', 'Hubo un problema al eliminar el registro', 'error');
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
          onClick={() => navigate('/id-cert-controls/new')} // Redirige a la ruta de agregar nuevo registro
        >
          Agregar Nuevo Control
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">Detalle del Control de Certificación</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>ID Coordinación:</strong> {idCertControl.coordination_id || 'N/A'}</p>
          <p><strong>Nombre de Coordinación:</strong> {idCertControl.coordination_name || 'N/A'}</p>
          <p><strong>ID Tipo de Evento:</strong> {idCertControl.event_type_id || 'N/A'}</p>
          <p><strong>Abreviatura del Tipo de Evento:</strong> {idCertControl.event_type_abrev || 'N/A'}</p>
        </div>
        <div>
          <p><strong>Nombre del Tipo de Evento:</strong> {idCertControl.event_type_name || 'N/A'}</p>
          <p><strong>Año:</strong> {idCertControl.year || 'N/A'}</p>
          <p><strong>Correlativo:</strong> {idCertControl.correlative || 'N/A'}</p>
          <p><strong>Creado en:</strong> {new Date(idCertControl.created_at).toLocaleDateString() || 'N/A'}</p>
          <p><strong>Actualizado en:</strong> {new Date(idCertControl.updated_at).toLocaleDateString() || 'N/A'}</p>
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

export default IdCertControlDetail;
