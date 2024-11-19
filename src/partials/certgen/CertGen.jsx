import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Api } from '../../services/Api'; // Conexión a la API
import { useParams } from 'react-router-dom';
import CertificateDocument from './CertificateDocument';

const CertGen = () => {
  const { id } = useParams(); // Obtener el ID del participante por la URL
  const [participantEvent, setParticipantEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const formattedDate = new Date(eventDetails?.end_date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  useEffect(() => {


    const fetchParticipantEvent = async () => {
      try {
        const response = await Api.get(`/participant-events/${id}`); // Llamada a la API para participante
        if (response.statusCode === 200) {
          setParticipantEvent(response.data);
          
          // Obtener el detalle del evento usando el event_id del participante
          const eventResponse = await Api.get(`/events/${response.data.event_id}`); // Llamada a la API para evento
          if (eventResponse.statusCode === 200) {
            setEventDetails(eventResponse.data);
          } else {
            alert('Error al cargar la información del evento.');
          }
        } else {
          alert('Error al cargar la información del participante.');
        }
      } catch (error) {
        alert('Error de conexión.');
      }
      
      setIsLoading(false);
    };
  
    fetchParticipantEvent(); 

  }, [id]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!participantEvent) {
    return <div>No se encontró la información del participante.</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Generar Certificado</h2>
      {/* Botón para descargar el PDF */}
      <PDFDownloadLink
        document={<CertificateDocument backgroundImage={"/certificate_templates/"+eventDetails.certificate_template_name} signature1={"/signatures/"+eventDetails.image_signature1} signature2={"/signatures/"+eventDetails.image_signature2} signature3={"/signatures/"+eventDetails.image_signature3} participantEvent={participantEvent} eventDetails={eventDetails}/>}
        
        fileName={`Certificado_${eventDetails.event_prefix}_${participantEvent.cedula}_${participantEvent.pri_nom}_${participantEvent.pri_ape}.pdf`}
      >
        {({ loading }) => (
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {loading ? 'Generando PDF...' : 'Descargar Certificado'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};


export default CertGen;
