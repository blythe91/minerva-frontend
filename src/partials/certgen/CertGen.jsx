import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Api } from '../../services/Api'; // Conexión a la API
import { useParams } from 'react-router-dom';
import backgroundImage2 from '/certificate_templates/20241120_plantilla_seminario.jpg'; // Ruta a la imagen local
import { Font } from '@react-pdf/renderer';
import CertificateDocument from './CertificateDocument';

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
// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: '#ffffff',
//     padding: 2,
//     position: 'relative',
//     borderTop: '2px solid #000', // Borde superior
//     borderBottom: '2px solid #000', // Borde inferior
//     borderLeft: '2px solid #000', // Borde izquierdo
//     borderRight: '2px solid #000', // Borde derecho
//   },
//   background: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -10,
//     opacity: 1,
//   },
  
//   section: {
//     paddingTop: 20,
//     paddingBottom: 20,
//     paddingLeft: 50,
//     paddingRight: 50,
//     // borderTop: '2px solid #000', // Borde superior
//     // borderBottom: '2px solid #000', // Borde inferior
//     // borderLeft: '2px solid #000', // Borde izquierdo
//     // borderRight: '2px solid #000', // Borde derecho
//     height: '95%'
//   },
//   coordinationName: {
//     fontSize: 13,  // Ajusté el tamaño de la fuente a 12
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'left',
//     marginBottom: 10,
//     marginTop: 73,
//     marginLeft:6,  // Corregí el margen izquierdo
//     paddingLeft: 200,
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
//     fontSize: 13,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     marginBottom: 15,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   signatureContainer: {
    
//   },
//   signatureNameAndJobTitle: {
//     fontSize: 11,
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     fontWeight: 'bold',
//   },
//   signatureImage: {
//     width: 80, 
//     height: 'auto', 
//     zIndex: -1,
//   },
//   largeTitle: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     marginTop: 30,
//     marginBottom: 0,
//     textTransform: 'uppercase',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   participantName: {
//     fontSize: 40,
//     fontFamily: 'GreatVibes',
//     color: '#996515', // Dorado
//     textAlign: 'center',
//     marginBottom: 10,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   idNumber: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     marginBottom: 5,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
    
//   },
//   eventName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#5db6fa', // Azul claro
//     textAlign: 'center',
//     marginBottom: 5,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//     textTransform: 'uppercase',
//   },
//   modalityAndDuration: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//     textTransform: 'uppercase',
//   },
//   teacher: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//     // textTransform: 'uppercase',
//     marginTop: '40',
//   },
//   teacherFirstPage: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//     // textTransform: 'uppercase',
    
//   },
//   dateLineText: {
//     fontSize: 13,
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'center',
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//     zIndex: '10'
//   },
//   programaticContent: {
//     fontSize: 14,
//     fontFamily: 'Roboto',
//     color: '#050a30', // Azul oscuro
//     textAlign: 'justify',
//     marginTop: 35,
//     marginLeft: 10,
//     paddingRight: 20,
//     width: '100%',  // Asegura que ocupe todo el ancho disponible
//   },
//   preambleEventName: {
//     fontSize: 13,
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
    
//     textAlign: 'center',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: '100%',
//     padding: '10px 0',
//   },
//   emptyLine: {
//     marginBottom: 5,
//   },
//   emptyLineThin: {
//     marginBottom: 4,
//   },
// });

const CertGen = () => {
  const { id } = useParams(); // Obtener el ID del participante por la URL

  const [participantEvent, setParticipantEvent] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [signature1, setSignature1] = useState('');
  const [signature2, setSignature2] = useState('');
  const [signature3, setSignature3] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const formattedDate = new Date(eventDetails?.end_date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  useEffect(() => {
    
    const getImagesPath = () => {

      console.log("//imágenes rutas//////");
      console.log(backgroundImage);
      console.log(signature1);
      console.log(signature2);
      console.log(signature3);
      console.log("////////");
      // console.log(responseData.certificate_template_name);
      // console.log(responseData.image_signature1);
      // console.log(responseData.image_signature2);
      // console.log(responseData.image_signature3);


    };

    const fetchParticipantEvent = async () => {
      try {
        const response = await Api.get(`/participant-events/${id}`); // Llamada a la API para participante
        if (response.statusCode === 200) {
          setParticipantEvent(response.data);
          
          // Obtener el detalle del evento usando el event_id del participante
          const eventResponse = await Api.get(`/events/${response.data.event_id}`); // Llamada a la API para evento
          if (eventResponse.statusCode === 200) {
            setEventDetails(eventResponse.data);
            setBackgroundImage("/certificate_templates/"+eventResponse.data.certificate_template_name);
            setSignature1("/signatures/"+eventResponse.data.image_signature1);
            setSignature2("/signatures/"+eventResponse.data.image_signature2);
            setSignature3("/signatures/"+eventResponse.data.image_signature3);

            getImagesPath();
            //console.log(eventResponse.data);

            
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
  // const CertificateDocuments = () => (
  //   <Document>
  //     {/* Primera cara del certificado */}
  //     <Page size="A4" orientation="landscape" style={styles.page}>
  //       <Image src={backgroundImage} style={styles.background} />
        
  //       <View style={styles.section}>
  //         <Text style={styles.coordinationName}>
  //           {participantEvent.coordination_name || ''}
  //         </Text>
  //         <Text style={styles.certificateTitle}>Certificado</Text>
  //         <Text style={styles.title}>Que se otorga a:</Text>
  //         <Text style={styles.participantName}>
  //           {`${participantEvent.pri_nom} ${participantEvent.seg_nom} ${participantEvent.pri_ape} ${participantEvent.seg_ape}`}
  //         </Text>
  //         <Text style={styles.idNumber}>
  //           V.-{participantEvent.cedula}
  //         </Text>

  //         <Text style={styles.preambleEventName}>
  //           {eventDetails?.event_open_text} {eventDetails?.event_type_name} <br/>
  //           en calidad de {participantEvent.name_participant_type}:
  //         </Text>

  //         <Text style={styles.eventName}>
  //           {eventDetails?.name_event}
  //         </Text>

  //           {!(eventDetails?.programatic_content) && eventDetails?.teacher && (<Text style={styles.teacherFirstPage}>
  //             {eventDetails.teacher_title || ''}: {eventDetails.teacher || ''}
  //           </Text>)}
  //         <Text style={styles.modalityAndDuration}>
  //           MODALIDAD: {eventDetails?.event_modality}
  //         </Text>
  //         <Text style={styles.modalityAndDuration}>
  //           Duración: {eventDetails?.academic_hours} horas académicas
  //         </Text>
  //         <Text style={styles.emptyLineThin}></Text>
  //         <Text style={styles.dateLineText}>
  //           {eventDetails?.date_line_text || ''}
  //         </Text>
  //         {/* <Text style={styles.title}>
  //           Realizado el día {new Date(participantEvent.fecha).toLocaleDateString()} en la {participantEvent.ubicacion}
  //         </Text> */}

          
  //         <Text style={styles.dateLineText}>
  //           {eventDetails.address ? eventDetails?.address : ''}
  //         </Text> 

  //       {/* Bloque de firmas */}
  //         <View style={{ 
  //           display: 'flex', 
  //           flexDirection: 'row', 
  //           justifyContent: 
  //             eventDetails?.name_signature1 && eventDetails?.name_signature2 && eventDetails?.name_signature3 
  //               ? 'space-between' 
  //               : eventDetails?.name_signature2 && eventDetails?.name_signature3 
  //                 ? 'space-around' 
  //                 : eventDetails?.name_signature1 && eventDetails?.name_signature3 
  //                 ? 'space-around'
  //                   : eventDetails?.name_signature1 && eventDetails?.name_signature2 
  //                   ? 'space-around'  
  //                     : 'center', 
  //           marginTop: 'auto', // Permite empujar las firmas hacia el final
  //           alignItems: 'flex-end', 
  //           height: '120px',
  //           width: '100%',
  //           paddingHorizontal: 50
  //         }}>
  //           {eventDetails?.name_signature1 && (
  //             <View style={{ alignItems: 'center', width: eventDetails?.name_signature2 || eventDetails?.name_signature3 ? '30%' : '100%' }}>
  //               <Image src={signature1} style={ styles.signatureImage} />
  //               <Text style={{ fontFamily: 'Roboto', textAlign: 'center', fontSize: 10 }}>_____________________________</Text>
  //               <Text style={ styles.signatureNameAndJobTitle }>
  //                 {eventDetails?.name_signature1 || ''}
  //               </Text>
  //               <Text style={ styles.signatureNameAndJobTitle }>
  //                 {eventDetails?.jobtitle_signature1 || ''}
  //               </Text>
  //             </View>
  //           )}
  //           {eventDetails?.name_signature2 && (
  //             <View style={{ alignItems: 'center', width: eventDetails?.name_signature1 || eventDetails?.name_signature3 ? '30%' : '100%' }}>
  //               <Image src={signature2} style={ styles.signatureImage} />
  //               <Text style={{ fontFamily: 'Roboto', textAlign: 'center', fontSize: 10 }}>_____________________________</Text>
  //               <Text style={ styles.signatureNameAndJobTitle }>
  //                 {eventDetails?.name_signature2 || ''}
  //               </Text>
  //               <Text style={ styles.signatureNameAndJobTitle }>
  //                 {eventDetails?.jobtitle_signature2 || ''}
  //               </Text>
  //             </View>
  //           )}
  //           {eventDetails?.name_signature3 && (
  //             <View style={{ alignItems: 'center', width: eventDetails?.name_signature1 || eventDetails?.name_signature2 ? '30%' : '100%' }}>
  //               <Image src={signature3} style={ styles.signatureImage} />
  //               <Text style={{ fontFamily: 'Roboto', textAlign: 'center', fontSize: 10 }}>_____________________________</Text>
  //               <Text style={ styles.signatureNameAndJobTitle }>
  //                 {eventDetails?.name_signature3 || ''}
  //               </Text>
  //               <Text style={ styles.signatureNameAndJobTitle }>
  //                 {eventDetails?.jobtitle_signature3 || ''}
  //               </Text>
  //             </View>
  //           )}
  //         </View>
  //       </View>
          
  //       {/* Footer */}

  //       {/* <Text style={styles.footer}>{formattedDate}</Text> */}

  //       <Text style={styles.eventPrefix}>
  //           {eventDetails.event_prefix || ''}
  //       </Text>
  //     </Page>
  
  //     {/* Segunda cara del certificado */}
  //     {eventDetails?.programatic_content &&(
  //       <Page size="A4" orientation="landscape" style={styles.page}>
  //       <Image src={backgroundImage} style={styles.background} />
  //       <View style={styles.section}>
  //         <Text style={styles.coordinationName}>
  //           {eventDetails.coordination_name || ''}
  //         </Text>
  //         <Text style={styles.largeTitle}>CONTENIDO PROGRAMÁTICO</Text>
  //         <Text style={styles.emptyLine}></Text>
  //         <Text style={styles.emptyLine}></Text>

  //         <Text style={styles.programaticContent}>            
  //           {eventDetails.programatic_content || ''}
  //         </Text>

          

          
  //           <Text style={styles.teacher}>
  //             {eventDetails.teacher_title || ''}: {eventDetails.teacher || ''}
  //           </Text>

          
  //       </View>
  //       </Page>)}
  //   </Document>
  // );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Generar Certificado</h2>
      {/* Botón para descargar el PDF */}
      <PDFDownloadLink
        document={<CertificateDocument backgroundImage={backgroundImage} signature1={signature1} signature2={signature2} signature3={signature3} participantEvent={participantEvent} eventDetails={eventDetails}/>}
        
        fileName={`Certificado_${eventDetails.event_prefix}_${participantEvent.cedula}_${participantEvent.pri_nom}_${participantEvent.pri_ape}_certificado.pdf`}
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
