import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showAlertTopEnd, showAlert } from '../../components/utils/Alert'; // alertas
import { Api } from '../../services/Api'; // conexión a la API
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState([]); // Estado para tipos de evento
  const [coordinations, setCoordinations] = useState([]); // Estado para coordinaciones

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    name_event: Yup.string()
      .required('El nombre del evento es requerido')
      .max(255, 'El nombre del evento no puede exceder 255 caracteres'),
    academic_hours: Yup.number()
      .required('Las horas académicas son requeridas')
      .min(0, 'Las horas académicas deben ser un número positivo'),
    event_type_id: Yup.string()
      .required('El ID del tipo de evento es requerido'),
    event_type_name: Yup.string()
      .required('El nombre del tipo de evento es requerido')
      .max(255, 'El nombre del tipo de evento no puede exceder 255 caracteres'),
    event_prefix: Yup.string()
      .nullable()
      .max(10, 'El prefijo del evento no puede exceder 10 caracteres'),
    coordination_id: Yup.string()
      .required('El ID de la coordinación es requerido'),
    coordination_name: Yup.string()
      .required('El nombre de la coordinación es requerido')
      .max(255, 'El nombre de la coordinación no puede exceder 255 caracteres'),
    start_date: Yup.date()
      .required('La fecha de inicio es requerida')
      .min(new Date(), 'La fecha de inicio debe ser igual o posterior a hoy'),
    end_date: Yup.date()
      .required('La fecha de finalización es requerida')
      .min(Yup.ref('start_date'), 'La fecha de finalización debe ser posterior a la fecha de inicio'),
    address: Yup.string()
      .nullable()
      .max(255, 'La dirección no puede exceder 255 caracteres'),
    font_file: Yup.mixed()
      .nullable()
      .test('fileType', 'El archivo debe ser un archivo de fuente (ttf, otf)', (value) => {
        if (!value) return true; // Permitir que el campo sea opcional
        const allowedTypes = ['font/ttf', 'font/otf'];
        return value && allowedTypes.includes(value.type);
      })
      .test('fileSize', 'El archivo no puede exceder los 10 MB', (value) => {
        return !value || (value && value.size <= 10000000);
      }),
    certificate_template: Yup.mixed()
      .nullable()
      .test('fileType', 'La plantilla debe ser una imagen (jpeg, png)', (value) => {
        if (!value) return true; // Permitir que el campo sea opcional
        const allowedTypes = ['image/jpeg', 'image/png'];
        return value && allowedTypes.includes(value.type);
      })
      .test('fileSize', 'La imagen no puede exceder los 2 MB', (value) => {
        return !value || (value && value.size <= 2000000);
      }),
  });

  // Fetch de tipos de evento y coordinaciones al cargar el componente
  useEffect(() => {
    const fetchEventTypes = async () => {
      const response = await Api.get('/event-types'); // Ajusta la ruta según tu API
      if (response.statusCode === 200) {
        setEventTypes(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar los tipos de evento', 'error');
      }
    };

    const fetchCoordinations = async () => {
      const response = await Api.get('/coordinations'); // Ajusta la ruta según tu API
      if (response.statusCode === 200) {
        setCoordinations(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar las coordinaciones', 'error');
      }
    };

    fetchEventTypes();
    fetchCoordinations();

    if (id) {
      const fetchEvent = async () => {
        setIsLoading(true);
        const response = await Api.get(`/events/${id}`);
        if (response.statusCode === 200) {
          setInitialValues(response.data);
        } else {
          showAlertTopEnd('Error', 'No se pudo cargar la información del evento', 'error');
        }
        setIsLoading(false);
      };

      fetchEvent();
    }
  }, [id]);

  // Valores iniciales del formulario
  const [initialValues, setInitialValues] = useState({
    name_event: '',
    academic_hours: '',
    event_type_id: '',
    event_type_name: '',
    event_prefix: '',
    coordination_id: '',
    coordination_name: '',
    start_date: '',
    end_date: '',
    address: '',
  });

  // Función para manejar la creación o edición
  const handleSubmit = async (values) => {
    

    const formData = new FormData();
    const e=0;

    // Añadir campos al FormData
    Object.keys(values).forEach((key) => {
      if (key === 'font_file' || key === 'certificate_template') {
        // Solo añadir los archivos si existen
        if (values[key]) {
          formData.append(key, values[key]);
          console.log(key + ':', values[key]);
        }
      } else {
        formData.append(key, values[key]);
        console.log(key + ':', values[key]);
      }
    });

  // Debug: Mostrar contenido del FormData
  console.log("Contenido del formData luego de Iterar");
  for (let pair of formData.entries()) {
    console.log(pair[0] + ':', pair[1]);
  }
      
    setIsLoading(true);

    try {
      let response;
      if (id) {
        // Actualizar evento
        response = await Api.put(`/events/${id}`, values);
      } else {
        // Crear nuevo evento
        response = await Api.post('/events', values);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        showAlertTopEnd('Éxito', id ? 'Evento actualizado correctamente' : 'Evento agregado correctamente', 'success');
        navigate('/events');
      } else if (response.statusCode === 422 && response.data.errors) {
        // Manejar errores de validación del backend (código 400)
        Object.keys(response.data.errors).forEach((field) => {
          const errorMsg = response.data.errors[field].join(' ');
          showAlert('Error', `${field}: ${errorMsg}`, 'error');
        });
      } else {
        showAlert('Error', response.data.error + ` (${response.statusCode})`, 'error');
      }
    } catch (error) {
      showAlert('Error', 'Hubo un problema al guardar los datos', 'error');
    }

    setIsLoading(false);
  };

  // Función para volver a la página anterior
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{id ? 'Editar Evento' : 'Crear Evento'}</h1>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name_event" className="block text-sm font-medium text-gray-700">Nombre del Evento</label>
              <Field
                name="name_event"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="name_event" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="academic_hours" className="block text-sm font-medium text-gray-700">Horas Académicas</label>
              <Field
                name="academic_hours"
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="academic_hours" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="event_type_id" className="block text-sm font-medium text-gray-700">Tipo de Evento</label>
              <Field
                as="select"
                name="event_type_id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={ (e) => {
                  const selectedId = e.target.value;
                  const selectedType = eventTypes.find(type => type._id === selectedId);
                  if (selectedType) {
                    setFieldValue("event_type_name", selectedType.name_event_type);
                  }
                  setFieldValue("event_type_id", selectedId);
                }}
              >
                <option value="" label="Seleccione un tipo de evento" />
                {eventTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name_event_type}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="event_type_id" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="event_prefix" className="block text-sm font-medium text-gray-700">Prefijo del Evento (opcional)</label>
              <Field
                name="event_prefix"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="event_prefix" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="coordination_id" className="block text-sm font-medium text-gray-700">Coordinación</label>
              <Field
                as="select"
                name="coordination_id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={ (e) => {
                  const selectedId = e.target.value;
                  const selectedCoordination = coordinations.find(coord => coord._id === selectedId);
                  if (selectedCoordination) {
                    setFieldValue("coordination_name", selectedCoordination.name_coordination);
                  }
                  setFieldValue("coordination_id", String(selectedId));
                }}
              >
                <option value="" label="Seleccione una coordinación" />
                {coordinations.map((coord) => (
                  <option key={coord._id} value={coord._id}>
                    {coord.name_coordination}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="coordination_id" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <Field
                name="start_date"
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="start_date" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
              <Field
                name="end_date"
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="end_date" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección (opcional)</label>
              <Field
                name="address"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="address" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="event_modality" className="block text-sm font-medium text-gray-700">Modalidad del Evento</label>
              <Field
                type="text"
                name="event_modality"
                id="event_modality"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="event_modality" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="font_file" className="block text-sm font-medium text-gray-700">Archivo de Fuente</label>
              <input
                name="font_file"
                type="file"
                accept=".ttf,.otf"
                onChange={(event) => {
                  
                  const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                  setFieldValue("font_file", file);
                  /* const file = event.currentTarget.files[0];
                  console.log("Selected file font:", file); */
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="font_file" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="certificate_template" className="block text-sm font-medium text-gray-700">Plantilla de Certificado</label>
              <input
                name="certificate_template"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(event) => {
                  const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                  setFieldValue("certificate_template", file);
                  /* const file = event.currentTarget.files[0];
                  console.log("Selected file image:", file); */
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="certificate_template" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div className="flex justify space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:blue-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Cargando...' : id ? 'Actualizar Evento' : 'Crear Evento'}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-400 
                text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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

export default EventForm;
