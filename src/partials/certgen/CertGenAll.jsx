import React, { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, pdf } from '@react-pdf/renderer';
import { Api } from '../../services/Api';
import { useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';
import backgroundImage from '/cert_template.jpg';
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

// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: '#ffffff',
//     padding: 2,
//     position: 'relative',
//   },
//   background: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -1,
//     opacity: 1,
//   },
//   section: {
//     marginTop: 3,
//     marginBottom: 3,
//     marginLeft: 6,
//     marginRight: 6,
//     padding: 6,
//   },
//   coordinationName: {
//     fontSize: 12,  // Ajusté el tamaño de la fuente a 12
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'left',
//     marginBottom: 10,
//     marginTop: 85,
//     marginLeft: 6,  // Corregí el margen izquierdo
//     paddingLeft: 240,
//     textTransform: 'uppercase',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   certificateTitle: {
//     fontSize: 42,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     marginTop: 20,
//     marginBottom: 0,
//     textTransform: 'uppercase',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   title: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     marginBottom: 15,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   participantName: {
//     fontSize: 28,
//     fontStyle: 'italic',
//     color: '#996515', // Dorado
//     textAlign: 'center',
//     marginBottom: 10,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   idNumber: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     marginBottom: 5,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//     marginBottom: 20
//   },
//   eventName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#5db6fa', // Azul claro
//     textAlign: 'center',
//     marginBottom: 10,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   modalityAndDuration: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   dateLineText: {
//     fontSize: 12,
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   preambleEventName: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible

//   },
//   eventPrefix: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     position: 'absolute',
//     bottom: 8,
//     right: 160,
//     width: 'auto',  // Evita que el texto ocupe más espacio de lo necesario
//   },
//   footer: {
//     fontSize: 12,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   emptyLine: {
//     marginBottom: 5,
//   },
// });


// Componente CertGenAll


const CertGenAll = () => {
  const { id } = useParams(); // Obtener el ID del evento por parámetros
  const [participantEvent, setParticipantEvent] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const formattedDate = new Date(eventDetails?.end_date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Fetch de los participantes y detalles del evento (sin asincronía)
  const fetchData = () => {
    Api.get(`/participant-events?event_id=${id}`).then(participantResponse => {
      console.log("/////////");
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
  };

  // Llamar a fetchData al iniciar el componente
  React.useEffect(() => {
    fetchData();
  }, [id]);

  // Generar el documento PDF para cada participante
  const CertificateDocument = ({ p }) => (
    <Document>
      {/* Primera cara del certificado */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Image src={backgroundImage} style={styles.background} />
        
        <View style={styles.section}>
          <Text style={styles.coordinationName}>
            {p.coordination_name || ''}
          </Text>
          <Text style={styles.certificateTitle}>Certificado</Text>
          <Text style={styles.title}>Que se otorga a:</Text>
          <Text style={styles.participantName}>
            {`${p.pri_nom} ${p.seg_nom} ${p.pri_ape} ${p.seg_ape}`}
          </Text>
          <Text style={styles.idNumber}>
            V.-{p.cedula}
          </Text>
  
          <Text style={styles.preambleEventName}>
            Por su participación en la actividad {p.event_type_name} <br/>
            en calidad de {p.name_participant_type}:
          </Text>
          <Text style={styles.eventName}>
            {p.name_event}
          </Text>
  
          <Text style={styles.preambleEventName}>
            facilitador: "acá va un nombre"
          </Text>
          
          <Text style={styles.modalityAndDuration}>
            Modalidad: {eventDetails?.event_modality}
          </Text>
          <Text style={styles.modalityAndDuration}>
            Duración: {eventDetails?.academic_hours} horas académicas
          </Text>
  
          <Text style={styles.emptyLine}>        </Text>
  
          <Text style={styles.dateLineText}>
            {eventDetails?.date_line_text || ''}
          </Text>
  
          <Text style={styles.dateLineText}>
            {eventDetails?.address ? eventDetails?.address : ''}
          </Text>
        </View>
  
        <Text style={styles.footer}>{formattedDate}</Text>
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
  

  const downloadCertificate = (participant) => {
    pdf(<CertificateDocument p={participant} />)
      .toBlob()
      .then(pdfBlob => {
        const fileName = `${participant.cedula}_${eventDetails.event_prefix}_${participant.pri_nom}_${participant.pri_ape}_certificado.pdf`;
        saveAs(pdfBlob, fileName);
      })
      .catch(error => {
        console.error('Error generando el PDF:', error);
        alert('Hubo un error al generar el certificado.');
      });
  };
  

  // Generar y descargar certificados automáticamente de manera secuencial
  const generateAllCertificates = async () => {
    setIsLoading(true);
    for (let i = 0; i < participantEvent.length; i++) {
      await downloadCertificate(participantEvent[i]); // Espera a que se genere cada certificado
      setProgress(((i + 1) / participantEvent.length) * 100);
    }
    setIsLoading(false);
    alert('Todos los certificados han sido generados y descargados.');
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
        Generar y Descargar Certificados
      </button>
      <div className="mt-4">
        <ProgressBar />
      </div>
    </div>
  );
};

export default CertGenAll;
