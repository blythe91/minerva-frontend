import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVImportPE = () => {
    const [step, setStep] = useState(1); // Controla la etapa actual
    const [progress, setProgress] = useState(0); // Controla el progreso de la importación
    const [fileData, setFileData] = useState(null);
    const [csvError, setCsvError] = useState('');
    const [columns, setColumns] = useState([]);

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
                        </div>
                    }
                    {step === 2 && <p>Aquí puedes conectar las cabeceras del archivo con los campos de la base de datos.</p>}
                    {step === 3 && <p>Aquí puedes iniciar la inserción de registros.</p>}
                    {step === 4 && <p>Aquí puedes seleccionar el evento al que deseas añadir los participantes.</p>}
                    {step === 5 && <p>Aquí se insertarán los registros en la colección `ParticipantEvent`.</p>}
                    {step === 6 && <p>Aquí se mostrarán los resultados del proceso de importación.</p>}
                </div>
            </div>

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
    );
};

export default CSVImportPE;
