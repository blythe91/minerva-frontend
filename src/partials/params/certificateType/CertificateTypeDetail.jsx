import React, { useEffect, useState } from 'react';
import { showAlertTopEnd } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { useParams, useNavigate } from 'react-router-dom';

const CertificateTypeDetail = () => {
  const { id } = useParams(); // Obtiene el ID del tipo de certificado desde la URL
  const [certificateType, setCertificateType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const fetchCertificateType = async () => {
      const response = await Api.get(`/certificate-types/${id}`); // Ajusta el endpoint según sea necesario
      if (response.statusCode === 200) {
        setCertificateType(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar la información del tipo de certificado', 'error');
      }
      setIsLoading(false);
    };

    fetchCertificateType();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!certificateType) {
    return <div className="p-6">No se encontró el tipo de certificado.</div>;
  }

  // Funciones de manejo de eventos
  const handleEdit = () => {
    navigate(`/certificate-types/edit/${certificateType._id}`); // Ajusta la ruta de edición según tu estructura
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este tipo de certificado?');
    if (confirmDelete) {
      try {
        const response = await Api.delete(`/certificate-types/${certificateType._id}`); // Ajusta el endpoint según sea necesario
        if (response.statusCode === 200) {
          showAlert('Éxito', 'Tipo de certificado eliminado correctamente', 'success');
          navigate('/certificate-types'); // Redirigir a la lista de tipos de certificados
        } else {
          showAlert('Error', 'No se pudo eliminar el tipo de certificado', 'error');
        }
      } catch (error) {
        showAlert('Error', 'Hubo un problema al eliminar el tipo de certificado', 'error');
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
          onClick={() => navigate('/certificate-types/new')} // Redirige a la ruta de agregar nuevo tipo de certificado
        >
          Agregar Tipo de Certificado
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-4">{certificateType.name_certificate_type}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Nombre del Tipo de Certificado:</strong> {certificateType.name_certificate_type}</p>
          <p><strong>Descripción:</strong> {certificateType.description_certificate_type || 'No tiene descripción.'}</p>
          <p><strong>Creado en:</strong> {new Date(certificateType.created_at).toLocaleDateString()}</p>
          <p><strong>Actualizado en:</strong> {new Date(certificateType.updated_at).toLocaleDateString()}</p>
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

export default CertificateTypeDetail;
