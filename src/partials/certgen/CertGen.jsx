import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Api } from '../../services/Api'; // Conexión a la API
import { useParams } from 'react-router-dom';
import backgroundImage from '/cert_template.jpg'; // Ruta a la imagen local
import { Font } from '@react-pdf/renderer';

// Registrar la fuente Roboto
Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto-Regular.ttf', // Reemplaza con la ruta correcta de tu archivo de fuente
});
// Registrar la fuente Roboto
Font.register({
  family: 'Roboto',
  src: '/fonts/Roboto-Bold.ttf', // Reemplaza con la ruta correcta de tu archivo de fuente
  fontWeight: 'bold',
    fontFamily: 'Roboto',
});
Font.register({
  family: 'RobotoBoldCondensed',
  src: '/fonts/Roboto-BoldCondensed.ttf', // Reemplaza con la ruta correcta de tu archivo de fuente
});

Font.register({
  family: 'GreatVibes',
  src: '/fonts/GreatVibes-Regular.ttf',
});
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 2,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    opacity: 1,
  },
  section: {
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 6,
    marginRight: 6,
    padding: 6,
  },
  coordinationName: {
    fontSize: 12,  // Ajusté el tamaño de la fuente a 12
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#050a30', // Azul oscuro
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 85,
    marginLeft: 6,  // Corregí el margen izquierdo
    paddingLeft: 240,
    textTransform: 'uppercase',
    width: '100%',  // Asegura que ocupe todo el ancho disponible
  },
  certificateTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#050a30', // Azul oscuro
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 0,
    textTransform: 'uppercase',
    width: '100%',  // Asegura que ocupe todo el ancho disponible
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#050a30', // Azul oscuro
    textAlign: 'center',
    marginBottom: 15,
    width: '100%',  // Asegura que ocupe todo el ancho disponible
  },
  participantName: {
    fontSize: 40,
    fontFamily: 'GreatVibes',
    color: '#996515', // Dorado
    textAlign: 'center',
    marginBottom: 10,
    width: '100%',  // Asegura que ocupe todo el ancho disponible
  },
  idNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#050a30', // Azul oscuro
    textAlign: 'center',
    marginBottom: 5,
    width: '100%',  // Asegura que ocupe todo el ancho disponible
    marginBottom: 20
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#5db6fa', // Azul claro
    textAlign: 'center',
    marginBottom: 10,
    width: '100%',  // Asegura que ocupe todo el ancho disponible
    textTransform: 'uppercase',
  },
  modalityAndDuration: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#050a30', // Azul oscuro
    textAlign: 'center',
    width: '100%',  // Asegura que ocupe todo el ancho disponible
    textTransform: 'uppercase',
  },
  dateLineText: {
    fontSize: 12,
    fontFamily: 'Roboto',
    color: '#050a30', // Azul oscuro
    textAlign: 'center',
    width: '100%',  // Asegura que ocupe todo el ancho disponible
  },
  preambleEventName: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#050a30', // Azul oscuro
    textAlign: 'center',
    width: '100%',  // Asegura que ocupe todo el ancho disponible

  },
  eventPrefix: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#050a30', // Azul oscuro
    position: 'absolute',
    bottom: 8,
    right: 160,
    width: 'auto',  // Evita que el texto ocupe más espacio de lo necesario
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyLine: {
    marginBottom: 5,
  },
});

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

  // Definir el documento del PDF
  const CertificateDocument = () => (
    <Document>
      {/* Primera cara del certificado */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Image src={backgroundImage} style={styles.background} />
        
        <View style={styles.section}>
          <Text style={styles.coordinationName}>
            {participantEvent.coordination_name || ''}
          </Text>
          <Text style={styles.certificateTitle}>Certificado</Text>
          <Text style={styles.title}>Que se otorga a:</Text>
          <Text style={styles.participantName}>
            {`${participantEvent.pri_nom} ${participantEvent.seg_nom} ${participantEvent.pri_ape} ${participantEvent.seg_ape}`}
          </Text>
          <Text style={styles.idNumber}>
            V.-{participantEvent.cedula}
          </Text>

          <Text style={styles.preambleEventName}>
            Por su participación en la actividad {participantEvent.event_type_name} <br/>
            en calidad de {participantEvent.name_participant_type}:
          </Text>
          <Text style={styles.eventName}>
            {participantEvent.name_event}
          </Text>

          {/* <Text style={styles.preambleEventName}>
            facilitador: "acá va un nombre"
          </Text> */}
          
          <Text style={styles.modalityAndDuration}>
            MODALIDAD: {eventDetails?.event_modality}
          </Text>
          <Text style={styles.modalityAndDuration}>
            Duración: {eventDetails?.academic_hours} horas académicas
          </Text>

          <Text style={styles.emptyLine}>        </Text>

          <Text style={styles.dateLineText}>
            {eventDetails?.date_line_text || ''}
          </Text>
          {/* <Text style={styles.title}>
            Realizado el día {new Date(participantEvent.fecha).toLocaleDateString()} en la {participantEvent.ubicacion}
          </Text> */}

          <Text style={styles.dateLineText}>
            {eventDetails?.address ? eventDetails?.address : ''}
          </Text> 

          {/* Fecha final del evento */}
          {/* <Text style={styles.title}>
            Fecha final: {eventDetails?.end_date ? new Date(eventDetails.end_date).toLocaleDateString() : 'No disponible'}
          </Text> */}
        </View>
  
        {/* Footer */}
        {/* <Text style={styles.footer}>Generado el {new Date().toLocaleDateString()}</Text> */}

        {/* <Text style={styles.footer}>{formattedDate}</Text> */}
        <Text style={styles.eventPrefix}>
            {eventDetails.event_prefix || ''}
          </Text>
      </Page>
  
      {/* Segunda cara del certificado */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Image src={backgroundImage} style={styles.background} />
        <View style={styles.section}>
          <Text style={styles.largeTitle}>Aquí va el programa de la actividad</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Generar Certificado</h2>
      {/* Botón para descargar el PDF */}
      <PDFDownloadLink
        document={<CertificateDocument />}
        fileName={`${participantEvent.cedula}_${eventDetails.event_prefix}_${participantEvent.pri_nom}_${participantEvent.pri_ape}_certificado.pdf`}
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
