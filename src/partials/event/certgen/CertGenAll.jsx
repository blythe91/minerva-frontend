import React, { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, pdf } from '@react-pdf/renderer';
import { Api } from '../../../services/Api';
import { showAlertTopEnd, showAlert } from '../../../components/utils/Alert'; // alertas
import { useNavigate, useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';
import CertificateDocument from './CertificateDocument';


const CertGenAll = () => {
  const { id } = useParams(); // Obtener el ID del evento por parámetros
  const [participantEvent, setParticipantEvent] = useState([]);
  const [participantType, setParticipantType] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch de los participantes y detalles del evento (sin asincronía)
  const fetchData = () => {
    Api.get(`/participant-events/get-participants/${id}`).then(participantResponse => {
      console.log("/////////ParticipantEvent:");
      console.log(participantResponse.data);
      console.log("/////////");
      if (participantResponse.statusCode === 200) {
        setParticipantEvent(participantResponse.data);
      } else {
        alert('Error al cargar los datos de los participantes.');
      }
    });

    Api.get(`/events/${id}`).then(eventResponse => {
      console.log("/////////");
      console.log(eventResponse.data);
      console.log("/////////");
      if (eventResponse.statusCode === 200) {
        setEventDetails(eventResponse.data);
      } else {
        alert('Error al cargar los datos del evento.');
      }
      setIsLoading(false);
    });

    Api.get(`/participant-types`).then(participantTypeResponse => {
      console.log("///participant type//////");
      console.log(participantTypeResponse.data);
      console.log("/////////");
      if (participantTypeResponse.statusCode === 200) {
        setParticipantType(participantTypeResponse.data);
      } else {
        alert('Error al cargar los datos de los participantes.');
      }
    });
  };

  // Llamar a fetchData al iniciar el componente
  React.useEffect(() => {
    fetchData();
  }, [id]);

  const generateAllCertificates = async () => {
      setIsLoading(true);
      for (let i = 0; i < participantEvent.length; i++) {
          try {
              await pdf(
                  <CertificateDocument
                      backgroundImage={`/certificate_templates/${eventDetails.certificate_template_name}`}
                      signature1={`/signatures/${eventDetails.image_signature1}`}
                      signature2={`/signatures/${eventDetails.image_signature2}`}
                      signature3={`/signatures/${eventDetails.image_signature3}`}
                      participantEvent={participantEvent[i]}
                      eventDetails={eventDetails}
                  />
              )
                  .toBlob()
                  .then(pdfBlob => {
                      const fileName = `Certificado_${participantEvent[i].certificate_code}_${participantEvent[i].pri_nom}_${participantEvent[i].pri_ape}.pdf`;
                      saveAs(pdfBlob, fileName);
                  });
          } catch (error) {
              console.error('Error generando el certificado:', error);
              showAlert('Error', 'Error generando el certificado.', 'error');

          }
          setProgress(((i + 1) / participantEvent.length) * 100);
      }
      setIsLoading(false);      
      showAlert('Éxito', 'Todos los certificados han sido generados y descargados con éxito.', 'success');
      navigate(`/events/${id}/certificates/`);
  };

  const generateSomeCertificates = async (participantType) => {
    setIsLoading(true);
    for (let i = 0; i < participantEvent.length; i++) {
        if (participantEvent.name_participant_type===participantType) {
          
        }
          try {
              await pdf(
                  <CertificateDocument
                      backgroundImage={`/certificate_templates/${eventDetails.certificate_template_name}`}
                      signature1={`/signatures/${eventDetails.image_signature1}`}
                      signature2={`/signatures/${eventDetails.image_signature2}`}
                      signature3={`/signatures/${eventDetails.image_signature3}`}
                      participantEvent={participantEvent[i]}
                      eventDetails={eventDetails}
                  />
              )
                  .toBlob()
                  .then(pdfBlob => {
                      const fileName = `Certificado_${eventDetails.event_prefix}_${participantEvent[i].cedula}_${participantEvent[i].pri_nom}_${participantEvent[i].pri_ape}.pdf`;
                      saveAs(pdfBlob, fileName);
                  });
          } catch (error) {
              console.error('Error generando el certificado:', error);
              showAlert('Error', 'Error generando el certificado.', 'error');

          }
        setProgress(((i + 1) / participantEvent.length) * 100);
    }
    setIsLoading(false);      
    showAlert('Éxito', 'Todos los certificados han sido generados y descargados con éxito.', 'success');
    navigate(`/events/${id}/certificates/`);
};

  // Mostrar la barra de progreso
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded">
      <div
        className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
        style={{ width: `${progress}%` }}
      >
        {progress.toFixed(2)}%
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Generar Todos los Certificados</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={generateAllCertificates}
      >
        Generar y descargar todos los certificados
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={generateAllCertificates}
      >
        Generar y Descargar Certificados del tipo 
      </button>
      <div className="mt-4">
        <ProgressBar />
      </div>
    </div>
  );
};

export default CertGenAll;
