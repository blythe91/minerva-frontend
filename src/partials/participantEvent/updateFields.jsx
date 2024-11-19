import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Api } from '../../services/Api';
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from 'react-icons/ai';

function UpdateFields() {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [recordCounts, setRecordCounts] = useState({
    participantEvents: 0,
    participants: 0,
    events: 0,
    participantTypes: 0,
    certificateTypes: 0,
  });
  const [participantEventsData, setParticipantEventsData] = useState([]);
  const [participantsData, setParticipantsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [participantTypesData, setParticipantTypesData] = useState([]);
  const [certificateTypesData, setCertificateTypesData] = useState([]);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [showDiscrepancies, setShowDiscrepancies] = useState(false);

  const [updateResults, setUpdateResults] = useState([]);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);


  useEffect(() => {
    const fetchDataCounts = async () => {
      try {
        setCurrentStage('Consultando datos...');
        setProgress(20);

        // Consultar todas las tablas relacionadas
        const [participantEventsRes, participantsRes, eventsRes, participantTypesRes, certificateTypesRes] = await Promise.all([
          Api.get('/participant-events'),
          Api.get('/participants'),
          Api.get('/events'),
          Api.get('/participant-types'),
          Api.get('/certificate-types'),
        ]);

        const participantEvents = participantEventsRes.data;
        const participants = participantsRes.data;
        const events = eventsRes.data;
        const participantTypes = participantTypesRes.data;
        const certificateTypes = certificateTypesRes.data;

        setParticipantEventsData(participantEvents);
        setParticipantsData(participants);
        setEventsData(events);
        setParticipantTypesData(participantTypes);
        setCertificateTypesData(certificateTypes);

        setRecordCounts({
          participantEvents: participantEvents.length,
          participants: participants.length,
          events: events.length,
          participantTypes: participantTypes.length,
          certificateTypes: certificateTypes.length,
        });

        setCurrentStage('Consulta completada');
        setProgress(100);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al consultar datos:', error);
        setCurrentStage('Error al consultar datos');
        setIsLoading(false);
      }
    };

    fetchDataCounts();
  }, []);

  const compareFields = () => {
    const discrepanciesFound = [];

    participantEventsData.forEach((event) => {
      const participant = participantsData.find(p => p._id === event.participant_id);
      const eventData = eventsData.find(e => e._id === event.event_id);
      const participantType = participantTypesData.find(pt => pt._id === event.participant_type_id);
      const certificateType = certificateTypesData.find(ct => ct._id === event.certificate_type_id);

      const discrepancy = {
        participant_id: event.participant_id,
        event_id: event.event_id,
        participant_name: `${participant?.pri_nom} ${participant?.seg_nom} ${participant?.pri_ape} ${participant?.seg_ape}`,
        event_name: event.name_event,
        participant_type_id: event.participant_type_id,
        certificate_type_id: event.certificate_type_id,
        discrepancies: [],
      };

      // Comparar campos
      if (participant && (event.pri_nom !== participant.pri_nom || event.seg_nom !== participant.seg_nom || event.pri_ape !== participant.pri_ape || event.seg_ape !== participant.seg_ape || event.email !== participant.email)) {
        discrepancy.discrepancies.push({
          field: 'Nombre/Apellidos/Correo',
          current: `${event.pri_nom} ${event.seg_nom} ${event.pri_ape} ${event.seg_ape} - ${event.email}`,
          correct: `${participant.pri_nom} ${participant.seg_nom} ${participant.pri_ape} ${participant.seg_ape} - ${participant.email}`,
        });
      }
      if (eventData && event.name_event !== eventData.name_event) {
        discrepancy.discrepancies.push({
          field: 'Evento',
          current: event.name_event,
          correct: eventData.name_event,
        });
      }
      // Verificar discrepancias en event_prefix
        if (event.event_prefix !== eventData.event_prefix) {
            discrepancy.discrepancies.push({
            field: 'Prefijo del Evento',
            current: event.event_prefix,
            correct: eventData.event_prefix,
            });
        }
        // Verificar discrepancias en coordination_name
        if (event.coordination_name !== eventData.coordination_name) {
            discrepancy.discrepancies.push({
                field: 'Nombre de Coordinación',
                current: event.coordination_name,
                correct: eventData.coordination_name,
            });
        }
        // Verificar discrepancias en event_type_name
        if (event.event_type_name !== eventData.event_type_name) {
            discrepancy.discrepancies.push({
                field: 'Tipo de Evento',
                current: event.event_type_name,
                correct: eventData.event_type_name,
            });
        }
      
      if (participantType && event.name_participant_type !== participantType.name_participant_type) {
        discrepancy.discrepancies.push({
          field: 'Tipo de Participante',
          current: event.name_participant_type,
          correct: participantType.name_participant_type,
        });
      }
      if (certificateType && event.name_certificate_type !== certificateType.name_certificate_type) {
        discrepancy.discrepancies.push({
          field: 'Tipo de Certificado',
          current: event.name_certificate_type,
          correct: certificateType.name_certificate_type,
        });
      }

      if (discrepancy.discrepancies.length > 0) {
        discrepanciesFound.push(discrepancy);
      }
    });

    setDiscrepancies(discrepanciesFound);
    setShowDiscrepancies(true);
  };


//   const updateDiscrepancies = () => {
//     setIsLoading(true);
//     setCurrentStage('Preparando datos para actualización...');
  
//     const discrepantRecords = discrepancies.filter((discrepancy) => {
//       return discrepancy.discrepancies && discrepancy.discrepancies.length > 0;
//     });
  
//     let totalRecords = discrepantRecords.length;
//     let processedRecords = 0;
//     let successes = 0;
//     let failures = 0;
//     let results = [];
  
//     if (totalRecords === 0) {
//       setCurrentStage('No se encontraron discrepancias para actualizar');
//       setIsLoading(false);
//       return;
//     }
  
//     for (let i = 0; i < discrepantRecords.length; i++) {
//       const discrepancy = discrepantRecords[i];
//       const participantEvent = participantEventsData.find(
//         (event) => event.participant_id === discrepancy.participant_id && event.event_id === discrepancy.event_id
//       );
  
//       if (!participantEvent) continue;
  
//       let updateRecord = { ...participantEvent };
  
//       const participantData = participantsData.find(p => p._id === discrepancy.participant_id);
//       const eventData = eventsData.find(e => e._id === discrepancy.event_id);
//       const participantTypeData = participantTypesData.find(pt => pt._id === discrepancy.participant_type_id);
//       const certificateTypeData = certificateTypesData.find(ct => ct._id === discrepancy.certificate_type_id);

//     console.log("////////////////////////////////////////////////////");
//     console.log("///////////////certificateTypesData//////////////////");
//     console.log(certificateTypesData);
//     console.log("///////////////id de discrepancia://////////////////");
//     console.log(discrepancy.certificate_type_id);
//     console.log("////////////////////////////////////////////////////");

//     console.log("////////////////////////////////////////////////////");
//     console.log("///////////////participantTypesData//////////////////");
//     console.log(participantTypesData);
//     console.log("///////////////id de discrepancia://////////////////");
//     console.log(discrepancy.participant_type_id);
//     console.log("////////////////////////////////////////////////////");
  
//       for (const field of discrepancy.discrepancies) {
//         if (field.field === 'Nombre/Apellidos/Correo') {
//           updateRecord.pri_nom = participantData?.pri_nom || updateRecord.pri_nom;
//           updateRecord.seg_nom = participantData?.seg_nom || updateRecord.seg_nom;
//           updateRecord.pri_ape = participantData?.pri_ape || updateRecord.pri_ape;
//           updateRecord.seg_ape = participantData?.seg_ape || updateRecord.seg_ape;
//           updateRecord.email = participantData?.email || updateRecord.email;
//         }
  
//         if (field.field === 'Evento') {
//           updateRecord.name_event = eventData?.name_event || updateRecord.name_event;
//         }
  
//         if (field.field === 'Prefijo del Evento') {
//           updateRecord.event_prefix = eventData?.event_prefix || updateRecord.event_prefix;
//         }
  
//         if (field.field === 'Nombre de Coordinación') {
//           updateRecord.coordination_name = eventData?.coordination_name || updateRecord.coordination_name;
//         }
  
//         if (field.field === 'Tipo de Evento') {
//           updateRecord.event_type_name = eventData?.event_type_name || updateRecord.event_type_name;
//         }
  
//         if (field.field === 'Tipo de Participante') {
//             updateRecord.participant_type_id = discrepancy.participant_type_id || updateRecord.participant_type_id;
//             updateRecord.name_participant_type = participantTypeData?.name_participant_type || updateRecord.name_participant_type;
//             console.log("////////////////////////////////////////////////////");
//             console.log("////////////////////////////////////////////////////");
//             console.log("registro a actualizar tipo particip.: "+updateRecord.name_participant_type+"; nuevo valor: "+participantTypeData?.name_participant_type);
//             console.log("////////////////////////////////////////////////////");
//             console.log("////////////////////////////////////////////////////");
//           }
  
//         if (field.field === 'Tipo de Certificado') {
//           updateRecord.certificate_type_id = discrepancy.certificate_type_id || updateRecord.certificate_type_id;
//           updateRecord.name_certificate_type = certificateTypeData?.name_certificate_type || updateRecord.name_certificate_type;

//           console.log("////////////////////////////////////////////////////");
//             console.log("////////////////////////////////////////////////////");
//             console.log("registro a actualizar tipo cert: "+updateRecord.name_certificate_type+"; nuevo valor: "+certificateTypeData?.name_certificate_type);
//             console.log("////////////////////////////////////////////////////");
//             console.log("////////////////////////////////////////////////////");
//         }
  
//         updateRecord.cedula = String(participantData?.cedula || updateRecord.cedula);
//       }
  
//       // Intento de actualización
//       try {
//         // Ejecución directa de actualización sin async/await
//         Api.put(`/participant-events/${participantEvent._id}`, updateRecord)
        
//         successes++;
//         results.push(`Registro actualizado: ${participantEvent._id}`);
//         setCurrentStage(`Actualizando datos (${i + 1} de ${totalRecords})`);
//       } catch (error) {
//         console.error('Error al actualizar registro:', participantEvent._id, error);
//         failures++;
//         results.push(`Error al actualizar registro: ${participantEvent._id}`);
//       }
  
//       processedRecords++;
//     }
  
//     // Actualizar estado y finalizar
//     setUpdateResults(results);
//     setSuccessCount(successes);
//     setFailCount(failures);
//     setCurrentStage('Actualización completada');
//     setIsLoading(false);
//   };

const updateDiscrepancies = async () => {
  try {
      setIsLoading(true);
      setCurrentStage('Preparando datos para actualización...');

      const discrepantRecords = discrepancies.filter((discrepancy) => {
          return discrepancy.discrepancies && discrepancy.discrepancies.length > 0;
      });

      let totalRecords = discrepantRecords.length;
      let processedRecords = 0;
      let successes = 0;
      let failures = 0;
      let results = [];

      if (totalRecords === 0) {
          setCurrentStage('No se encontraron discrepancias para actualizar');
          setIsLoading(false);
          return;
      }

      for (let i = 0; i < discrepantRecords.length; i++) {
          const discrepancy = discrepantRecords[i];
          const participantEvent = participantEventsData.find(
              (event) =>
                  event.participant_id === discrepancy.participant_id &&
                  event.event_id === discrepancy.event_id
          );

          if (!participantEvent) continue;

          // Crear un registro actualizado basado en los datos actuales
          let updateRecord = { ...participantEvent };

          // Buscar datos relacionados
          const participantData = participantsData.find((p) => p._id === discrepancy.participant_id);
          const eventData = eventsData.find((e) => e._id === discrepancy.event_id);
          const participantTypeData = participantTypesData.find(
              (pt) => pt._id === discrepancy.participant_type_id
          );
          const certificateTypeData = certificateTypesData.find(
              (ct) => ct._id === discrepancy.certificate_type_id
          );

          // Actualizar todos los campos
          if (participantData) {
              updateRecord = {
                  ...updateRecord,
                  pri_nom: participantData.pri_nom || updateRecord.pri_nom,
                  seg_nom: participantData.seg_nom || updateRecord.seg_nom,
                  pri_ape: participantData.pri_ape || updateRecord.pri_ape,
                  seg_ape: participantData.seg_ape || updateRecord.seg_ape,
                  cedula: String(participantData.cedula || updateRecord.cedula),
                  email: participantData.email || updateRecord.email,
                  celular: participantData.celular,
                  nacionalidad: participantData.nacionalidad,
                  pais: participantData.pais,
                  estado: participantData.estado,
                  ciudad: participantData.ciudad,
                  direccion: participantData.direccion,
                  codigo_postal: participantData.codigo_postal,
                  organizacion: participantData.organizacion,
                  cargo: participantData.cargo,
              };
          }

          if (eventData) {
              updateRecord = {
                  ...updateRecord,
                  name_event: eventData.name_event,
                  event_prefix: eventData.event_prefix,
                  coordination_name: eventData.coordination_name,
                  event_type_name: eventData.event_type_name,
                  academic_hours: eventData.academic_hours,
                  start_date: eventData.start_date,
                  end_date: eventData.end_date,
                  address: eventData.address,
                  event_modality: eventData.event_modality,
              };
          }

          if (participantTypeData) {
              updateRecord = {
                  ...updateRecord,
                  participant_type_id: discrepancy.participant_type_id,
                  name_participant_type: participantTypeData.name_participant_type,
              };
          }

          if (certificateTypeData) {
              updateRecord = {
                  ...updateRecord,
                  certificate_type_id: discrepancy.certificate_type_id,
                  name_certificate_type: certificateTypeData.name_certificate_type,
              };
          }

          try {
              // Llamada a la API para actualizar el registro
              const response = await Api.put(`/participant-events/${participantEvent._id}`, updateRecord);

              if (response.status === 204) {
                  successes++;
                  results.push(`Registro actualizado correctamente: ${participantEvent._id}`);
              } else {
                  failures++;
                  results.push(`Error al actualizar registro (respuesta inesperada ${response.status}): ${participantEvent._id}`);
              }

              const progressPercentage = Math.round(((i + 1) / totalRecords) * 100);
              setProgress(progressPercentage);
              setCurrentStage(`Actualizando datos (${i + 1} de ${totalRecords})`);
          } catch (error) {
              console.error(`Error al actualizar registro: ${participantEvent._id}`, error);
              failures++;
              results.push(`Error al actualizar registro: ${participantEvent._id}`);
          }

          processedRecords++;
      }

      // Actualizar estado y finalizar
      setUpdateResults(results);
      setSuccessCount(successes);
      setFailCount(failures);
      setCurrentStage('Actualización completada');
      setIsLoading(false);
  } catch (error) {
      console.error('Error general al procesar las discrepancias:', error);
      setCurrentStage('Error al actualizar los campos');
      setIsLoading(false);
  }
};

  
  const columns = [
    {
      name: 'Nombre del Participante',
      selector: row => row.participant_name,
      sortable: true,
    },
    {
      name: 'Evento',
      selector: row => row.event_name,
      sortable: true,
    },
    {
      name: 'Campo a Actualizar',
      selector: row => row.field,
      sortable: true,
    },
    {
      name: 'Dato Actual',
      selector: row => row.current,
      sortable: true,
    },
    {
      name: 'Dato Correcto',
      selector: row => row.correct,
      sortable: true,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Consulta de Registros de Tablas</h2>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Estado actual de la consulta */}
      <p className="text-lg mb-4">{currentStage}</p>

      {/* Icono de progreso */}
      <div className="flex items-center mb-6">
        {isLoading && progress < 100 && (
          <AiOutlineExclamationCircle className="h-6 w-6 text-yellow-500" />
        )}
        {!isLoading && progress === 100 && (
          <AiOutlineCheckCircle className="h-6 w-6 text-green-500" />
        )}
        <span className="ml-2">{progress}% completado</span>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Cantidad de Registros por Tabla</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Participant Events:</span>
            <span>{recordCounts.participantEvents}</span>
          </li>
          <li className="flex justify-between">
            <span>Participants:</span>
            <span>{recordCounts.participants}</span>
          </li>
          <li className="flex justify-between">
            <span>Events:</span>
            <span>{recordCounts.events}</span>
          </li>
          <li className="flex justify-between">
            <span>Participant Types:</span>
            <span>{recordCounts.participantTypes}</span>
          </li>
          <li className="flex justify-between">
            <span>Certificate Types:</span>
            <span>{recordCounts.certificateTypes}</span>
          </li>
        </ul>
      </div>

      {/* Botón para mostrar discrepancias */}
      <button
        onClick={compareFields}
        className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Campos por actualizar
      </button>

      {/* Mostrar discrepancias */}
      {showDiscrepancies && discrepancies.length == 0 &&(
            <h3 className="text-xl font-semibold mb-4">No hay discrepancias encontradas</h3>
      )}
      {showDiscrepancies && discrepancies.length > 0 && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Discrepancias encontradas</h3>
          <DataTable
            columns={columns}
            data={discrepancies.flatMap(discrepancy =>
              discrepancy.discrepancies.map(d => ({
                participant_name: discrepancy.participant_name,
                event_name: discrepancy.event_name,
                field: d.field,
                current: d.current,
                correct: d.correct,
              }))
            )}
            pagination
            highlightOnHover
            progressPending={isLoading}
            persistTableHead
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
          />
          {/* Botón para finalizar actualización */}
            <button
            onClick={updateDiscrepancies}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
               Finalizar actualización
            </button>
            <div style={{ marginTop: '20px' }}>
                <h3>Resultados de la actualización:</h3>
                {updateResults.map((result, index) => (
                    <p key={index}>{result}</p>
                ))}
                <p>
                    <strong>Registros actualizados correctamente:</strong> {successCount}
                </p>
                <p>
                    <strong>Registros con fallos:</strong> {failCount}
                </p>
            </div>
            

        </div>
      )}
    </div>
  );
}

export default UpdateFields;
