import React, { useEffect, useState } from 'react';
import { showAlertTopEnd, showAlert } from '../../components/utils/Alert'; //alertas
import { Api } from '../../services/Api'; //conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const ParticipantDetail = () => {
  const { id } = useParams(); // Obtiene el ID del participante desde la URL
  const [participant, setParticipant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchParticipant = async () => {
      const response = await Api.get(`/participants/${id}`); // Ajusta el endpoint según sea necesario
      if (response.statusCode === 200) {
        setParticipant(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar la información del participante', 'error');
      }
      setIsLoading(false);
    };

    fetchParticipant();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!participant) {
    return <div className="p-6">No se encontró el participante.</div>;
  }

  // Funciones de manejo de eventos
  const handleEdit = () => {
    navigate(`/participants/edit/${participant._id}`); // Ajusta la ruta de edición según tu estructura
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este participante?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/participants/${participant._id}`); // Ajusta el endpoint según sea necesario 
        if (response.statusCode === 200) {
          showAlert('Éxito', 'Participante eliminado correctamente', 'success');
          navigate('/participants'); // Redirigir a la lista de participantes
        } else {
          showAlert('Error', 'No se pudo eliminar el participante', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema al eliminar el participante', 'error');
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
          onClick={() => navigate('/participants/new')} // Redirige a la ruta de agregar participante
        >
          Agregar Participante
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">{participant.pri_nom} {participant.seg_nom} {participant.pri_ape} {participant.seg_ape}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Cédula:</strong> {participant.cedula}</p>
          <p><strong>Teléfono:</strong> {participant.celular}</p>
          <p><strong>Email:</strong> {participant.email}</p>
        </div>
        <div>          
          <p><strong>Nacionalidad:</strong> {participant.nacionalidad}</p>
          <p><strong>País:</strong> {participant.pais}</p>
          <p><strong>Estado:</strong> {participant.estado}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Ciudad:</strong> {participant.ciudad}</p>
          <p><strong>Dirección:</strong> {participant.direccion}</p>
        </div>
        <div>
          <p><strong>Código Postal:</strong> {participant.codigo_postal}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Organismo:</strong> {participant.organismo}</p>
          <p><strong>Cargo:</strong> {participant.cargo}</p>
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

export default ParticipantDetail;
