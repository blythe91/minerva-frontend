import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Api } from '../../services/Api'; // Conexión a la API
import { useNavigate, useParams } from 'react-router-dom';
import CertificateDocument from './CertificateDocument';
import { showAlert } from '../../components/utils/Alert';


const CertGen = () => {
  const { id } = useParams(); // Obtener el ID del participante por la URL
  const [participantEvent, setParticipantEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iscertificateCode, setIscertificateCode] = useState(false);
  const navigate = useNavigate();
  // const formattedDate = new Date(eventDetails?.end_date).toLocaleDateString('es-ES', {
  //   day: '2-digit',
  //   month: '2-digit',
  //   year: 'numeric',
  // });
  const [certificateCode, setCertificateCode] = useState(null); // Nuevo estado para el código del certificado
  const [Correlative, setNewCorrelative] = useState(null);

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
  
  const generateCertificateCode = async () => {
    try {
      if (!eventDetails) return;

      if (participantEvent.certificate_code){ 
        setCertificateCode(participantEvent.certificate_code);
        console.log("ya existe codigo de certificado: "+certificateCode);
        console.log("objeto recuperado ParticipantEvent: ");
        console.log(participantEvent);
        setIscertificateCode(true);
        return;}


      const { event_type_id, start_date, coordination_id, event_prefix } = eventDetails;

      // Llamar al servicio para obtener el correlativo actual
      const correlativeResponse = await Api.get(
        `/id-cert-control/last-correlative/${event_type_id}/${new Date(start_date).getFullYear()}/${coordination_id}`
      );
      console.log("datos de la consulta al correlativo: "+event_type_id+"-"+new Date(start_date).getFullYear()+"-"+coordination_id);
      if (correlativeResponse.statusCode === 200) {
        const currentCorrelative = parseInt(correlativeResponse.data.last_correlative);

        // Generar el nuevo código de certificado
        const newCorrelative = currentCorrelative + 1;
        const code = `${event_prefix}-${newCorrelative}`;
        setCertificateCode(code);
        setNewCorrelative(newCorrelative);
        console.log("correlativo actual:"+correlativeResponse.data.last_correlative);
        console.log("correlativo nuevo:"+newCorrelative);
        console.log("codigo de certificado nuevo desde PE:"+participantEvent.certificate_code);
        
        return newCorrelative; // Retornar el nuevo correlativo para actualizarlo después
      } else {
        alert('Error al obtener el correlativo.');
      }
    } catch (error) {
      console.error('Error generando el código del certificado:', error);
    }
  };
  const handleDownloadCertificate = async () => {

    if(!iscertificateCode){ 
      try {
        //const newCorrelative = await generateCertificateCode();
        const newCorrelative = Correlative;

        if (!newCorrelative) return;

        const { event_type_id, start_date, coordination_id } = eventDetails;

        // Actualizar el correlativo en el backend
        console.log("codigo de certificado: "+event_type_id+"-"+new Date(start_date).getFullYear()+"-"+coordination_id+"-"+newCorrelative);
        
        participantEvent.certificate_code=certificateCode;

          const updateCorrelative = {
            'eventTypeId': event_type_id,
            'year': new Date(start_date).getFullYear(),
            'coordinationId': coordination_id,
            'correlative': newCorrelative,
          };
          const updateResponse = await Api.post(`/id-cert-control/update-correlative/`,updateCorrelative);

          if (updateResponse.statusCode === 200) {
            
            console.log('Correlativo actualizado correctamente. '+certificateCode);
            
          } else {
            alert('Error al actualizar el correlativo.');
          }

          // actualiza codigo de certificado en participantEvent
          //console.log(participantEvent);

          const updateCorrelativeParticipantEvent = {
            'certificate_code': certificateCode,
          };
          participantEvent.certificate_code = certificateCode;
          console.log("codigo de certificado a actualizar en participantEvent: "+updateCorrelativeParticipantEvent.certificate_code);
          updateResponse = await Api.put(`/participant-events/${participantEvent._id}/update-certificate-code`, updateCorrelativeParticipantEvent);

          if (updateResponse.statusCode === 200) {
            
            
            console.log('Correlativo actualizado correctamente en ParticipantEvent. '+participantEvent.certificate_code);
          } else {
            alert('Error al actualizar el correlativo en Participant Event.');
          }
        
      } catch (error) {
        console.error('Error al actualizar el correlativo2:', error);
      }
    };
    //navigate(`/events/${participantEvent.event_id}/certificates/`);
  };
  
  useEffect(() => {

    fetchParticipantEvent(); 

  }, [id]);

  useEffect(() => {
    generateCertificateCode(); // Generar el código del certificado al cargar

  }, [eventDetails]);
  useEffect(() => {
    

  }, [certificateCode]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!participantEvent) {
    return <div>No se encontró la información del participante.</div>;
  }
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Generar Certificado</h2>
      <h3 className="text-2xl font-bold mb-4">{participantEvent.pri_nom} {participantEvent.pri_ape}</h3>
      {certificateCode && (
        <p className="mb-4 text-gray-700">Código del Certificado: <strong>{certificateCode}</strong></p>
      )}
      {/* Botón para descargar el PDF */}
      <PDFDownloadLink
        document={<CertificateDocument backgroundImage={"/certificate_templates/"+eventDetails.certificate_template_name} signature1={"/signatures/"+eventDetails.image_signature1} signature2={"/signatures/"+eventDetails.image_signature2} signature3={"/signatures/"+eventDetails.image_signature3} participantEvent={participantEvent} eventDetails={eventDetails} certificate_code={certificateCode}/>}
        
        fileName={`Certificado_${eventDetails.event_prefix}_${participantEvent.cedula}_${participantEvent.pri_nom}_${participantEvent.pri_ape}.pdf`}
      >
        {({ loading }) => (
          <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleDownloadCertificate}
          >
            {loading ? 'Generando PDF...' : 'Descargar Certificado'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};


export default CertGen;
