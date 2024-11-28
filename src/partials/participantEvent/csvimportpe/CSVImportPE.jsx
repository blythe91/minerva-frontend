import React, { useState, useEffect } from 'react';
import { Api } from "../../../services/Api";
import { showAlertTopEnd, showAlert } from "../../../components/utils/Alert";
import Papa from 'papaparse';

const CSVImportPE = () => {
    const [step, setStep] = useState(1); // Controla la etapa actual
    const [progress, setProgress] = useState(0); // Controla el progreso de la importación 
    const [fileData, setFileData] = useState(null);
    const [csvError, setCsvError] = useState('');
    const [columns, setColumns] = useState([]);
    const [mappings, setMappings] = useState({});
    const [missingColumns, setMissingColumns] = useState([]);
    const [mappingError, setMappingError] = useState('');
    const [Cedulas, setCedulas] = useState([]); // para almacenar las cédulas

    const [uniqueData, setUniqueData] = useState([]); // Datos únicos
    const [duplicateData, setDuplicateData] = useState([]); // Datos duplicados
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [events, setEvents] = useState([]); // Lista de eventos disponibles
    const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado
    const [eventError, setEventError] = useState(''); // Error en la selección de eventos

    const [participantTypes, setParticipantTypes] = useState([]); // Lista de tipos de participante

    const participantFields = [
        'pri_nom', 'seg_nom', 'pri_ape', 'seg_ape', 'cedula', 'celular', 'email',
        'nacionalidad', 'pais', 'estado', 'ciudad', 'direccion', 'codigo_postal',
        'organismo', 'cargo', "event_id", "participant_type_id"
    ];

    useEffect(() => {
        const fetchCedulas = async () => {
            try {
                const response = await Api.get('/participants'); // Llama al servicio para obtener los participantes
                if (response && response.data) {
                    // Asumiendo que response.data es un array de participantes
                    const cedulasList = response.data.map(participant => participant.cedula); // Extrae las cédulas
                    setCedulas(cedulasList); // Actualiza el estado con las cédulas
                }
            } catch (error) {
                console.error("Error al obtener las cédulas:", error);
                // Manejo de errores si es necesario
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await Api.get('/events'); // Llama al endpoint para obtener eventos
                if (response && response.data) {
                    setEvents(response.data); // Asigna la lista de eventos
                    console.log(events);
                } else {
                    setEventError("No se pudieron cargar los eventos. Intenta de nuevo.");
                }
            } catch (error) {
                console.error("Error al obtener los eventos:", error);
                setEventError("Error al cargar los eventos.");
            }
        };

        const fetchParticipantTypes = async () => {
            try {
                const response = await Api.get('/participant-types'); // Llama al endpoint para obtener tipos de participante
                if (response && response.data) {
                    setParticipantTypes(response.data); // Asigna la lista de tipos de participante
                } else {
                    showAlert("error","No se pudieron cargar los tipos de participante. Intenta de nuevo.", Error);
                }
            } catch (error) {
                console.error("Error al obtener los evetipos de participantentos:", error);
                showAlert("error","Error al cargar los tipos de participante.", Error);
            }
        };
        fetchParticipantTypes();
        fetchEvents(); // Obtiene los eventos al montar el componente

        fetchCedulas(); // Llama a la función para obtener las cédulas
    }, []); // Se ejecuta una vez al montar el componente

    const handleNext = () => {
        if (step < 6) {
            setStep(step + 1);
            // Animación suave para el progreso
            setProgress((prev) => Math.min(prev + 20, 100)); // Incrementa según el número total de pasos
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setProgress((prev) => Math.max(prev - 20, 0)); // Decrementa el progreso
        }
    };

    const renderStepTitle = () => {
        switch (step) {
            case 1:
                return "Paso 1: Importar Archivo CSV";
            case 2:
                return "Paso 2: Conectar Cabeceras del Archivo";
            case 3:
                return "Paso 3: Iniciar Inserción de Registros";
            case 4:
                return "Paso 4: Seleccionar Evento para Participantes";
            case 5:
                return "Paso 5: Insertar Registros en ParticipantEvent";
            case 6:
                return "Paso 6: Resultado del Proceso de Importación";
            default:
                return "";
        }
    };
    // Función del Paso 1: Cargar archivo CSV
    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            Papa.parse(file, {
                header: true, // Lee las cabeceras del archivo
                skipEmptyLines: true, // Ignora líneas vacías
                complete: function (results) {
                    const { data, errors } = results;

                    if (errors.length) {
                        setCsvError('Error procesando el archivo CSV. Verifica su formato.');
                        console.error(errors);
                        return;
                    }

                    // Validar que las columnas esperadas estén presentes
                    const expectedColumns = ['cedula', 'pri_nom', 'pri_ape', 'email', 'event_id', 'participant_type_id'];
                    const csvColumns = Object.keys(data[0] || {});
                    const missingColumns = expectedColumns.filter(col => !csvColumns.includes(col));

                    if (missingColumns.length) {
                        setCsvError(`Faltan las siguientes columnas en el archivo: ${missingColumns.join(', ')}`);
                        return;
                    }

                    // Almacenar datos y columnas
                    setFileData(data);
                    setColumns(csvColumns);
                    setCsvError('');
                },
                error: function (err) {
                    setCsvError('Hubo un error al leer el archivo CSV.');
                    console.error(err);
                },
            });
        }
    };


    // Función del paso 2: Guardar el mapeo seleccionado para cada campo

    const handleMappingChange = (field, value) => {
        setMappings((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleValidateMapping = () => {
        // Verifica si los campos obligatorios tienen un mapeo
        const requiredFields = ["pri_nom", "pri_ape", "cedula", "event_id", "participant_type_id"];
        const missingFields = requiredFields.filter((field) => !mappings[field]);

        if (missingFields.length > 0) {
            setMappingError(`Los siguientes campos son obligatorios y no tienen mapeo: ${missingFields.join(", ")}`);
            return false;
        }

        setMappingError("");
        return true;
    };

    const handlePrepareData = () => {
        if (!fileData) {
            console.error("No se encontraron datos cargados para procesar.");
            return { unique: [], duplicates: [] };
        }

        const uniqueData = [];
        const duplicateData = [];

        const mappedData = fileData.map((row) => {
            const record = {};
            participantFields.forEach((field) => {
                const column = mappings[field];
                record[field] = column ? row[column] || "" : ""; // Asigna cadena vacía si la columna no existe
            });

            // Clasifica entre únicos y duplicados
            if (Cedulas.includes(record.cedula)) {
                duplicateData.push(record);
                console.log("duplicado:"+record);
            } else {
                uniqueData.push(record);
                console.log("único:"+record);
            }

            return record;
        });

        setUniqueData(uniqueData);
        setDuplicateData(duplicateData);

        return { unique: uniqueData, duplicates: duplicateData };
    };
    

    // función del paso 3: insertar y actualizar
    const handleInsertAndUpdate = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        const response='';
        const response2='';
        try {
            
            //Operación de actualización de registros en un solo lote.

            if(duplicateData.length){
                const response = await Api.putArray('/participants/multiple', duplicateData);

                if (response.statusCode === 200 || response.statusCode === 201) {
                    // Éxito en la operación
                    showAlert('Éxito','Participantes actualizados correctamente', 'success');
                    
                } else if (response.statusCode === 422 && response.data.errors) {
                    // Manejar errores de validación del backend (código 400)
                    Object.keys(response.data.errors).forEach((field) => {
                    const errorMsg = response.data.errors[field].join(' ');
                    showAlert('Error', `${field}: ${errorMsg}`, 'error');
                    });
                } else {
                    // Otro tipo de error
                    showAlert('Error', response.data.error + ` (${response.statusCode})`, 'error');
                }
            } else {
                // Si no hay duplicados, insertar los únicos
            }
              //Operación de inserción de registros en un solo lote.
            if(uniqueData.length){
                const response2 = await Api.postArray('/participants/multiple', uniqueData);

                if (response2.statusCode === 200 || response2.statusCode === 201) {
                    // Éxito en la operación
                    showAlert('Éxito','Participantes agregados correctamente', 'success');
                    
                } else if (response2.statusCode === 422 && response2.data.errors) {
                    // Manejar errores de validación del backend (código 400)
                    Object.keys(response2.data.errors).forEach((field) => {
                    const errorMsg = response2.data.errors[field].join(' ');
                    showAlert('Error', `${field}: ${errorMsg}`, 'error');
                    });
                } else {
                    // Otro tipo de error
                    showAlert('Error', response2.data.error + ` (${response2.statusCode})`, 'error');
                }
                }

              


            setSuccessMessage(
                `¡Proceso completado! Se insertaron ${uniqueData.length} registros y se actualizaron ${duplicateData.length} registros.`
            );
            // setUniqueData([]);
            // setDuplicateData([]);
            setStep(step + 1);
        } catch (err) {
            setError('Hubo un error al procesar los datos. Por favor, intente nuevamente2.');
            console.error(err);
            console.log(response);
            console.log(response2);
        } finally {
            setLoading(false);
        }
    };

    // funciones del paso 4: seleccionar evento
    // Maneja el cambio de selección de eventos
    const handleEventSelection = (eventId) => {
        setSelectedEvent(eventId);
        setEventError(''); // Limpia cualquier error previo
    };

    // Validar la selección antes de avanzar
    const validateEventSelection = () => {
        if (!selectedEvent) {
            setEventError("Debes seleccionar un evento para continuar.");
            return false;
        }
        return true;
    };

    // Función para avanzar al siguiente paso con validación
    const handleNextWithValidation = () => {
        if (validateEventSelection()) {
            handleNext();
        }
    };

    // Función del paso 5: Prepara para inserción en ParticipantEvent
    const handleInsertCompleteParticipantEvents = async () => {
        if (!uniqueData.length) {
            showAlert('Error', 'No hay datos únicos para asociar al evento.', 'error');
            return;
        }
    
        if (!selectedEvent) {
            showAlert('Error', 'No se ha seleccionado un evento. Por favor, selecciona uno en el paso anterior.', 'error');
            return;
        }
    
        setLoading(true);
        setError('');
        setSuccessMessage('');
    
        try {
            // Obtener información del evento seleccionado
            // const eventResponse = await Api.get(`/events/${selectedEvent}`);
            // 
            
            const eventData = events.find((ev) => ev._id === selectedEvent);
    
            // Preparar los datos para la inserción
            const completeData = uniqueData.map((participant) => {
                // Agregar datos complementarios de la tabla ParticipantType
                const participantTypeName = participantTypes.find(
                    (type) => type._id === participant.participant_type_id
                )?.name_participant_type || '';
    
                return {
                    participant_id: '', // ID único del participante
                    cedula: participant.cedula,
                    pri_nom: participant.pri_nom,
                    seg_nom: participant.seg_nom,
                    pri_ape: participant.pri_ape,
                    seg_ape: participant.seg_ape,
                    email: participant.email,
                    event_id: selectedEvent,
                    name_event: eventData.name_event || '',
                    event_type_name: eventData.event_type_name || '',
                    coordination_name: eventData.coordination_name || '',
                    event_prefix: eventData.event_prefix || '',
                    certificate_code: participant.certificate_code || '', // Código de certificado único
                    participant_type_id: participant.participant_type_id,
                    name_participant_type: participantTypeName,
                };
            });
    
            // Insertar los datos completos en la tabla ParticipantEvent
            const response = await Api.postArray('/participant-events/multiple', completeData);
    
            if (response.statusCode === 200 || response.statusCode === 201) {
                showAlert('Éxito', 'Participantes asociados correctamente al evento.', 'success');
                setSuccessMessage(`¡Se insertaron ${completeData.length} registros en ParticipantEvent correctamente!`);
                handleNext(); // Avanzar al siguiente paso
            } else {
                // Manejo de errores del backend
                if (response.statusCode === 422 && response.data.errors) {
                    Object.keys(response.data.errors).forEach((field) => {
                        const errorMsg = response.data.errors[field].join(' ');
                        showAlert('Error', `${field}: ${errorMsg}`, 'error');
                    });
                } else {
                    showAlert('Error', response.data.error || 'Error inesperado durante la asociación.', 'error');
                }
            }
        } catch (err) {
            setError('Ocurrió un error durante la inserción. Por favor, intenta nuevamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="max-w-2xl mx-auto p-5 bg-gray-100 rounded-lg min-h-[50vh] shadow-md flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold text-blue-700 mb-4">{renderStepTitle()}</h2>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                        className={`h-4 rounded-full transition-all duration-500 ${step === 6 ? 'bg-green-500' : 'bg-blue-700'}`} 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Aquí podrías agregar el contenido específico de cada paso según el estado */}
                <div className="mb-5">
                    {step === 1 && 
                        <div>
                            <p className="mb-4">Selecciona el archivo CSV que deseas importar:</p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                            />
                            {csvError && <p className="text-red-500 mt-2">{csvError}</p>}
                            {fileData && (
                                <div className="mt-4">
                                    <p className="text-green-500 font-semibold">Archivo cargado exitosamente.</p>
                                    <p>Columnas detectadas: {columns.join(', ')}</p>
                                </div>
                            )}
                                <div className="flex justify-between mt-auto">
                                    <button 
                                        onClick={handleBack} 
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300"
                                    >
                                        Volver
                                    </button>
                                    <button 
                                        onClick={handleNext} 
                                        className={`text-white py-2 px-4 rounded transition-colors duration-300 ${step === 6 ? 'bg-green-500' : 'bg-blue-700 hover:bg-blue-800'}`}
                                        disabled={(step === 1 && !fileData)}
                                    >
                                        {step === 6 ? 'Finalizar' : 'Siguiente'}
                                    </button>
                                </div>
                        </div>
                    }
                    {step === 2 && 
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Mapeo de Columnas</h3>
                            <div className="overflow-auto">
                                <table className="table-auto w-full border border-gray-300 rounded">
                                    <thead>
                                        <tr className="bg-blue-200">
                                            <th className="px-4 py-2 border">Campo del Sistema</th>
                                            <th className="px-4 py-2 border">Columna del Archivo CSV</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participantFields.map((field) => (
                                            <tr key={field}>
                                                <td className="px-4 py-2 border bg-gray-100">{field}</td>
                                                <td className="px-4 py-2 border">
                                                    <select
                                                        className="border border-gray-400 rounded px-2 py-1 w-full"
                                                        value={mappings[field] || ''}
                                                        onChange={(e) => handleMappingChange(field, e.target.value)}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        {columns.map((column) => (
                                                            <option key={column} value={column}>
                                                                {column}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {mappingError && (
                                <p className="text-red-600 font-medium mt-2">{mappingError}</p>
                            )}
                             <div className="flex justify-between mt-auto">
                                    <button 
                                        onClick={handleBack} 
                                        disabled={loading}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300"
                                    >
                                        Volver
                                    </button>
                                    <button
                                        className="text-white py-2 px-4 rounded transition-colors duration-300 bg-blue-700 hover:bg-blue-800"
                                        disabled={loading}
                                        onClick={() => {
                                            if (handleValidateMapping()) {
                                                const { unique, duplicates } = handlePrepareData();
                                                console.log("Datos únicos para insertar:", unique);
                                                console.log("Datos duplicados para actualizar:", duplicates);
                                                handleNext();
                                            }
                                        }}
                                    >
                                        Siguiente
                                    </button>
                            </div>
             
                        </div>
                    }
                    {step === 3 && 
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Procesar Datos</h3>
                            <p>En este paso, los registros se enviarán para su inserción o actualización en la base de datos.</p>
                            <ul className="list-disc ml-6 my-2">
                                <li>Registros únicos a insertar: {uniqueData.length}</li>
                                <li>Registros duplicados a actualizar: {duplicateData.length}</li>
                            </ul>

                            {loading && <p className="text-blue-600">Procesando, por favor espere...</p>}
                            {error && <p className="text-red-600">{error}</p>}
                            {successMessage && <p className="text-green-600">{successMessage}</p>}

                            <div className="flex justify-between mt-auto">
                                <button 
                                    onClick={handleBack} 
                                    disabled={loading}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300"
                                >
                                    Volver
                                </button>
                                
                                <button
                                    className="text-white py-2 px-4 rounded transition-colors duration-300 bg-blue-700 hover:bg-blue-800"
                                    onClick={handleInsertAndUpdate}
                                    disabled={loading}
                                >
                                    Siguiente
                                </button>
                            </div>
                            
                            
                        </div>
                    }
                    {step === 4 && 
                        <div>
                            <h2>Selecciona un evento</h2>
                            {eventError && <p style={{ color: 'red' }}>{eventError}</p>}
                            <select
                                value={selectedEvent || ''}
                                onChange={(e) => handleEventSelection(e.target.value)}
                            >
                                <option value="" disabled>Selecciona un evento...</option>
                                {events.map((event) => (
                                    <option key={event._id} value={event._id}>
                                        {event.name_event}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-between mt-auto">
                                <button 
                                    onClick={handleBack} 
                                    disabled={loading}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300"
                                >
                                    Volver
                                </button>
                                
                                <button
                                    className="text-white py-2 px-4 rounded transition-colors duration-300 bg-blue-700 hover:bg-blue-800"
                                    onClick={handleNextWithValidation}
                                    disabled={loading}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    }
                    {step === 5 && 
                        <div>
                            <h2>Asociar Participantes Completos al Evento</h2>
                            {loading && <p>Cargando... Por favor espera.</p>}
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                            <p>
                                Se completarán los registros con datos del evento y tipos de participantes antes de asociarlos. 
                                Total participantes: {uniqueData.length}.
                            </p>

                            
                            <div className="flex justify-between mt-auto">
                                <button 
                                    onClick={handleBack} 
                                    disabled={loading}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300"
                                >
                                    Volver
                                </button>
                                
                                <button
                                    className="text-white py-2 px-4 rounded transition-colors duration-300 bg-blue-700 hover:bg-blue-800"
                                    onClick={handleInsertCompleteParticipantEvents}
                                    disabled={loading}
                                >
                                    Asociar Participantes
                                </button>
                            </div>

                        </div>
                    }
                    {step === 6 && <p>Aquí se mostrarán los resultados del proceso de importación.</p>}
                </div>
            </div>


        </div>
    );
};

export default CSVImportPE;
