import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showAlertTopEnd, showAlert } from '../../../components/utils/Alert';
import { Api } from '../../../services/Api';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const IdCertControlForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [coordinations, setCoordinations] = useState([]);
  const [initialValues, setInitialValues] = useState({
    coordination_id: '',
    coordination_name: '',
    event_type_id: '',
    event_type_name: '',
    event_type_abrev: '',
    year: new Date().getFullYear(),
    correlative: '',
  });

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    coordination_id: Yup.string().required('La coordinación es obligatoria.'),
    event_type_id: Yup.string().required('El tipo de evento es obligatorio.'),
    year: Yup.number()
      .required('El año es obligatorio.')
      .min(2000, 'El año no puede ser anterior al 2000.')
      .max(2100, 'El año no puede ser posterior al 2100.'),
    correlative: Yup.string().required('El correlativo es obligatorio.'),
  });

  // Cargar tipos de eventos y coordinaciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventTypesResponse, coordinationsResponse] = await Promise.all([
          Api.get('/event-types'),
          Api.get('/coordinations'),
        ]);

        setEventTypes(eventTypesResponse.data || []);
        setCoordinations(coordinationsResponse.data || []);
      } catch (error) {
        showAlert('Error', 'No se pudieron cargar los datos necesarios.', 'error');
      }
    };

    fetchData();
  }, []);

  // Cargar datos del registro si se está editando
  useEffect(() => {
    if (id) {
      const fetchIdCertControl = async () => {
        setIsLoading(true);
        const response = await Api.get(`/id-cert-controls/${id}`);
        if (response.statusCode === 200) {
          setInitialValues(response.data);
        } else {
          showAlert('Error', 'No se pudo cargar el registro', 'error');
        }
        setIsLoading(false);
      };
      fetchIdCertControl();
    }
  }, [id]);

  // Manejar la selección de Tipo de Evento y actualizar campos relacionados
  const handleEventTypeChange = (event, setFieldValue) => {
    const selectedId = event.target.value;
    const selectedEventType = eventTypes.find((type) => type._id === selectedId);
    if (selectedEventType) {
      setFieldValue('event_type_id', selectedId);
      setFieldValue('event_type_name', selectedEventType.name_event_type);
      setFieldValue('event_type_abrev', selectedEventType.abrev);
    }
  };

  // Manejar la selección de Coordinación y actualizar campos relacionados
  const handleCoordinationChange = (event, setFieldValue) => {
    const selectedId = event.target.value;
    const selectedCoordination = coordinations.find((coord) => coord._id === selectedId);
    if (selectedCoordination) {
      setFieldValue('coordination_id', selectedId);
      setFieldValue('coordination_name', selectedCoordination.name_coordination); // Actualiza con el nombre de la coordinación
    }
  };

  // Función para manejar la creación o edición
  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Añadir campos al FormData
    console.log("Contenido del formData luego de Iterar en idCertControlForm");
    Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
        console.log(key + ':', values[key]);
    });

    setIsLoading(true);
    try {
      let response;
      if (id) {
        response = await Api.put(`/id-cert-controls/${id}`, values);
      } else {
        response = await Api.post('/id-cert-controls', values);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        showAlert('Éxito', id ? 'Registro actualizado correctamente' : 'Registro agregado correctamente', 'success');
        navigate('/id-cert-controls');
      } else {
        showAlert('Error', 'Error al guardar los datos.', 'error');
      }
    } catch (error) {
      showAlert('Error', 'Hubo un problema al guardar los datos.', 'error');
    }
    setIsLoading(false);
  };

  // Función para volver a la página anterior
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Editar Registro' : 'Crear Registro'}</h1>
    
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6">
    
            {/* Select de Coordinación */}
            <div>
              <label htmlFor="coordination_id" className="block text-sm font-medium text-gray-700">
                Coordinación
              </label>
              <Field as="select" name="coordination_id" className="mt-1 block w-full" onChange={(e) => handleCoordinationChange(e, setFieldValue)}>
                <option value="">Seleccione una coordinación</option>
                {coordinations.map((coord) => (
                  <option key={coord._id} value={coord._id}>
                    {coord.name_coordination}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="coordination_id" component="div" className="text-red-600 text-sm mt-1" />
            </div>
    
            {/* ID de la Coordinación (readonly) */}
            <div>
              <label htmlFor="coordination_id_display" className="block text-sm font-medium text-gray-700">
                ID de Coordinación
              </label>
              <Field
                name="coordination_id"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                readOnly
              />
            </div>

            {/* Nombre de la Coordinación (readonly) */}
            <div>
              <label htmlFor="coordination_name" className="block text-sm font-medium text-gray-700">
                Nombre de Coordinación
              </label>
              <Field
                name="coordination_name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                readOnly
              />
            </div>
    
            {/* Select de Tipo de Evento */}
            <div>
              <label htmlFor="event_type_id" className="block text-sm font-medium text-gray-700">
                Tipo de Evento
              </label>
              <Field as="select" name="event_type_id" className="mt-1 block w-full" onChange={(e) => handleEventTypeChange(e, setFieldValue)}>
                <option value="">Seleccione un tipo de evento</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType._id} value={eventType._id}>
                    {eventType.name_event_type}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="event_type_id" component="div" className="text-red-600 text-sm mt-1" />
            </div>
    
            {/* Nombre del Tipo de Evento (readonly) */}
            <div>
              <label htmlFor="event_type_name" className="block text-sm font-medium text-gray-700">
                Nombre del Tipo de Evento
              </label>
              <Field
                name="event_type_name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                readOnly
              />
            </div>
    
            {/* Abreviatura del Tipo de Evento (readonly) */}
            <div>
              <label htmlFor="event_type_abrev" className="block text-sm font-medium text-gray-700">
                Abreviatura del Tipo de Evento
              </label>
              <Field
                name="event_type_abrev"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                readOnly
              />
            </div>
    
            {/* Año (editable) */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Año
              </label>
              <Field
                name="year"
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <ErrorMessage name="year" component="div" className="text-red-600 text-sm mt-1" />
            </div>
    
            {/* Correlativo (editable) */}
            <div>
              <label htmlFor="correlative" className="block text-sm font-medium text-gray-700">
                Correlativo
              </label>
              <Field
                name="correlative"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              <ErrorMessage name="correlative" component="div" className="text-red-600 text-sm mt-1" />
            </div>
    
            {/* Botones de acción */}
            <div className="flex justify-between space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none"
                onClick={handleBack}
              >
                Volver
              </button>
            </div>
    
          </Form>
        )}
      </Formik>
    </div>
  

  );
};

export default IdCertControlForm;
