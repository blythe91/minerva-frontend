import React from 'react';
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';
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
      borderTop: '2px solid #000', // Borde superior
      borderBottom: '2px solid #000', // Borde inferior
      borderLeft: '2px solid #000', // Borde izquierdo
      borderRight: '2px solid #000', // Borde derecho
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -10,
      opacity: 1,
    },
    
    section: {
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 50,
      paddingRight: 50,
      // borderTop: '2px solid #000', // Borde superior
      // borderBottom: '2px solid #000', // Borde inferior
      // borderLeft: '2px solid #000', // Borde izquierdo
      // borderRight: '2px solid #000', // Borde derecho
      height: '95%'
    },
    coordinationName: {
      fontSize: 13,  // Ajusté el tamaño de la fuente a 12
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'left',
      marginBottom: 10,
      marginTop: 73,
      marginLeft:6,  // Corregí el margen izquierdo
      paddingLeft: 200,
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
      fontSize: 13,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'center',
      marginBottom: 15,
      width: '100%',  // Asegura que ocupe todo el ancho disponible
    },
    signatureContainer: {
      
    },
    signatureNameAndJobTitle: {
      fontSize: 11,
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      fontWeight: 'bold',
    },
    signatureImage: {
      width: 80, 
      height: 'auto', 
      zIndex: -1,
    },
    largeTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'center',
      marginTop: 30,
      marginBottom: 0,
      textTransform: 'uppercase',
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
      fontSize: 13,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'center',
      width: '100%',  // Asegura que ocupe todo el ancho disponible
      marginBottom: 20
    },
    eventName: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#114081', // Azul oscuro
      textAlign: 'center',
      marginBottom: 5,
      width: '100%',  // Asegura que ocupe todo el ancho disponible
      textTransform: 'uppercase',
    },
    modalityAndDuration: {
      fontSize: 13,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'center',
      width: '100%',  // Asegura que ocupe todo el ancho disponible
      // textTransform: 'uppercase',
    },
    modalityAndDurationText: {
      fontWeight: 'normal',
    },
    teacher: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'center',
      width: '100%',  // Asegura que ocupe todo el ancho disponible
      // textTransform: 'uppercase',
      marginTop: '40',
    },
    teacherFirstPage: {
      fontSize: 13,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'center',
      width: '100%',  // Asegura que ocupe todo el ancho disponible
      // textTransform: 'uppercase',
      
    },
    teacherFirstPageName: {
      fontWeight: 'normal',
    },
    dateLineText: {
      fontSize: 13,
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'center',
      width: '100%',  // Asegura que ocupe todo el ancho disponible
      zIndex: '10'
    },
    programaticContent: {
      fontSize: 14,
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'justify',
      marginTop: 35,
      marginLeft: 10,
      paddingRight: 20,
      width: '100%',  // Asegura que ocupe todo el ancho disponible
    },
    preambleEventName: {
      fontSize: 13,
      fontWeight: 'normal',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      textAlign: 'center',
      width: '100%',  // Asegura que ocupe todo el ancho disponible
    },
    preambleParticipantType: {
      fontWeight: 'bold',
      textTransform: 'uppercase',

    },
    eventPrefix: {
      fontSize: 10,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      color: '#050a30', // Azul oscuro
      position: 'absolute',
      bottom: 8,
      right: 25,
      width: 'auto',  // Evita que el texto ocupe más espacio de lo necesario
    },
    footer: {
      
      textAlign: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      padding: '10px 0',
    },
    emptyLine: {
      marginBottom: 5,
    },
    emptyLineThin: {
      marginBottom: 4,
    },
  });

function CertificateDocument({
  backgroundImage,
  signature1,
  signature2,
  signature3,
  participantEvent,
  eventDetails,
  certificate_code
}) {
  
  return (
    <Document>
      {/* Primera cara del certificado */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Image src={backgroundImage} style={styles.background} />

        <View style={styles.section}>
          <Text style={styles.coordinationName}>
            {/* {participantEvent?.coordination_name || ''} */}
          </Text>
          <Text style={styles.certificateTitle}>Certificado</Text>
          <Text style={styles.title}>Que se otorga a:</Text>
          <Text style={styles.participantName}>
            {`${participantEvent?.pri_nom || ''} ${participantEvent?.seg_nom || ''} ${participantEvent?.pri_ape || ''} ${participantEvent?.seg_ape || ''}`}
          </Text>
          <Text style={styles.idNumber}>
            {participantEvent?.cedula || ''}
          </Text>

          <Text style={styles.preambleEventName}>
          En calidad de <Text style={styles.preambleParticipantType}> {participantEvent?.name_participant_type || ''} </Text> {eventDetails?.event_open_text}:
          
          {eventDetails?.event_type_name}
          
          </Text>

          <Text style={styles.eventName}>
            {eventDetails?.name_event || ''}
          </Text>

          {
         (participantEvent.name_participant_type.toLowerCase().localeCompare(eventDetails.teacher_title.toLowerCase())) && 
          !eventDetails?.programatic_content && eventDetails?.teacher &&  (
            <Text style={styles.teacherFirstPage}>
              {eventDetails?.teacher_title || ''}: <Text style={styles.teacherFirstPageName}>{eventDetails?.teacher || ''}</Text>
            </Text>
          )}
          <Text style={styles.modalityAndDuration}>
            Modalidad: <Text style={styles.modalityAndDurationText}>{eventDetails?.event_modality || ''} </Text>
          </Text>
          <Text style={styles.modalityAndDuration}>
            Duración: <Text style={styles.modalityAndDurationText}>{eventDetails?.academic_hours || ''} horas académicas</Text>
          </Text>
          <Text style={styles.emptyLineThin}></Text>
          <Text style={styles.dateLineText}>
            {eventDetails?.date_line_text || ''}
          </Text>
          <Text style={styles.dateLineText}>
            {eventDetails?.address || ''}
          </Text>

          {/* Bloque de firmas */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent:
                eventDetails?.name_signature1 && eventDetails?.name_signature2 && eventDetails?.name_signature3
                  ? 'space-between'
                  : 'center',
              marginTop: 'auto',
              alignItems: 'flex-end',
              height: '120px',
              width: '100%',
              paddingHorizontal: 50,
            }}
          >
            {eventDetails?.name_signature1 && (
              <View style={{ alignItems: 'center', width: '30%' }}>
                <Image src={signature1} style={styles.signatureImage} />
                <Text style={{ fontFamily: 'Roboto', textAlign: 'center', fontSize: 10 }}>
                  _____________________________
                </Text>
                <Text style={styles.signatureNameAndJobTitle}>
                  {eventDetails?.name_signature1 || ''}
                </Text>
                <Text style={styles.signatureNameAndJobTitle}>
                  {eventDetails?.jobtitle_signature1 || ''}
                </Text>
              </View>
            )}
            {eventDetails?.name_signature2 && (
              <View style={{ alignItems: 'center', width: '30%' }}>
                <Image src={signature2} style={styles.signatureImage} />
                <Text style={{ fontFamily: 'Roboto', textAlign: 'center', fontSize: 10 }}>
                  _____________________________
                </Text>
                <Text style={styles.signatureNameAndJobTitle}>
                  {eventDetails?.name_signature2 || ''}
                </Text>
                <Text style={styles.signatureNameAndJobTitle}>
                  {eventDetails?.jobtitle_signature2 || ''}
                </Text>
              </View>
            )}
            {eventDetails?.name_signature3 && (
              <View style={{ alignItems: 'center', width: '30%' }}>
                <Image src={signature3} style={styles.signatureImage} />
                <Text style={{ fontFamily: 'Roboto', textAlign: 'center', fontSize: 10 }}>
                  _____________________________
                </Text>
                <Text style={styles.signatureNameAndJobTitle}>
                  {eventDetails?.name_signature3 || ''}
                </Text>
                <Text style={styles.signatureNameAndJobTitle}>
                  {eventDetails?.jobtitle_signature3 || ''}
                </Text>
              </View>
            )}
          </View>
          
        </View>
        {/* código de certificado */}
        <Text style={styles.eventPrefix}>
                {/* {participantEvent?.certificate_code || 'sin codigo'} */}
                D.I.: {participantEvent?.certificate_code || certificate_code}
                
            </Text>
      </Page>

      {/* Segunda cara del certificado */}
      {eventDetails?.programatic_content && (
        <Page size="A4" orientation="landscape" style={styles.page}>
          <Image src={backgroundImage} style={styles.background} />
          <View style={styles.section}>
            <Text style={styles.coordinationName}>
              {/* {eventDetails?.coordination_name || ''} */}
            </Text>
            <Text style={styles.largeTitle}>CONTENIDO PROGRAMÁTICO</Text>
            <Text style={styles.emptyLine}></Text>
            <Text style={styles.emptyLine}></Text>

            <Text style={styles.programaticContent}>
              {eventDetails?.programatic_content || ''}
            </Text>

            <Text style={styles.teacher}>
              {eventDetails?.teacher_title || ''}: {eventDetails?.teacher || ''}
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

export default CertificateDocument;
