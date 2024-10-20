import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Api } from '../../services/Api'; // Conexión a la API
import { useParams } from 'react-router-dom';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    margin: 10,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  largeTitle: {
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyLine: {
    marginBottom: 10,
  },
});

const CertGen = () => {
  const { id } = useParams(); // Obtener el ID del participante por la URL
  const [participantEvent, setParticipantEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantEvent = async () => {
      try {
        const response = await Api.get(`/participant-events/${id}`); // Llamada a la API
        if (response.statusCode === 200) {
          setParticipantEvent(response.data);
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
        <View style={styles.section}>
          <Text style={styles.title}>Universidad Nacional Experimental del Táchira</Text>
          <Text style={styles.title}>Decanato de Investigación</Text>
          <Text style={styles.title}>
            {participantEvent.coordinacion || ''}
          </Text>
          <View style={styles.emptyLine} />
          <View style={styles.emptyLine} />
          <Text style={styles.largeTitle}>Certificado</Text>
          <Text style={styles.title}>Que se otorga a</Text>
          <Text style={styles.largeTitle}>
            {`${participantEvent.pri_nom} ${participantEvent.seg_nom} ${participantEvent.pri_ape} ${participantEvent.seg_ape}`}
          </Text>
          <Text style={styles.title}>
            En calidad de {participantEvent.name_participant_type} en el {participantEvent.name_event}
          </Text>
          <Text style={styles.title}>{participantEvent.name_event}</Text>
          <Text style={styles.title}>
            Modalidad {participantEvent.tipo_modalidad} - Duración {participantEvent.horas}
          </Text>
          <Text style={styles.title}>
            Realizado el día {new Date(participantEvent.fecha).toLocaleDateString()} en la {participantEvent.ubicacion}
          </Text>
          <Text style={styles.title}>
            {participantEvent.ubicacion_geografica}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Generado el {new Date().toLocaleDateString()}</Text>
      </Page>

      {/* Segunda cara del certificado */}
      <Page size="A4" orientation="landscape" style={styles.page}>
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
        fileName={`Certificado_${participantEvent.pri_nom}_${participantEvent.pri_ape}.pdf`}
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
