import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../components/utils/Alert'; //alertas
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
        showAlertTopEnd('Error', 'No se pudo cargar la información del participante', 'error');
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
          showAlertTopEnd('Éxito', 'Participante eliminado correctamente', 'success');
          navigate('/participants'); // Redirigir a la lista de participantes
        } else {
          showAlertTopEnd('Error', 'No se pudo eliminar el participante', 'error');
        }
      } catch (error) {
        showAlertTopEnd('Error', 'Hubo un problema al eliminar el participante', 'error');
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">{participant.pri_nom} {participant.seg_nom}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Primer Apellido:</strong> {participant.pri_ape}</p>
          <p><strong>Segundo Apellido:</strong> {participant.seg_ape}</p>
          <p><strong>Cédula:</strong> {participant.cedula}</p>
          <p><strong>Teléfono:</strong> {participant.celular}</p>
        </div>
        <div>
          <p><strong>Email:</strong> {participant.email}</p>
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
          <p><strong>Grado de Instrucción:</strong> {participant.grado_instruccion}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Título:</strong> {participant.titulo}</p>
          <p><strong>Universidad:</strong> {participant.universidad}</p>
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
