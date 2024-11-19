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
  const [eventTypes, setEventTypes] = useState([]);
  const [coordinations, setCoordinations] = useState([]);

  const [eventPrefix, setEventPrefix] = useState({
    coordinationID: '',
    currentYear: new Date().getFullYear(),
    eventTypeAbrev: ''
  });

  // ** NUEVAS FUNCIONES AGREGADAS ** //

  // Actualiza el prefijo del evento en base a los cambios en coordinación o tipo de evento
  const updateEventPrefix = (field, value) => {
    setEventPrefix(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Genera el prefijo del evento dinámicamente
  const generateEventPrefix = () => {
    return `${eventPrefix.coordinationID}-${eventPrefix.currentYear}-${eventPrefix.eventTypeAbrev}`;
  };

  // ** FUNCIONES DE FETCH DE DATOS ** //

  useEffect(() => {
    const fetchEventTypes = async () => {
      const response = await Api.get('/event-types');
      if (response.statusCode === 200) {
        setEventTypes(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar los tipos de evento', 'error');
      }
    };

    const fetchCoordinations = async () => {
      const response = await Api.get('/coordinations');
      if (response.statusCode === 200) {
        setCoordinations(response.data);
      } else {
        showAlert('Error', 'No se pudo cargar las coordinaciones', 'error');
      }
    };

    // Nueva función para actualizar el prefijo cuando cambian los datos de coordinación o tipo de evento
    const updatePrefixFromInitialValues = (data) => {
      updateEventPrefix('coordinationID', data.coordination_id || '');
      updateEventPrefix('eventTypeAbrev', data.event_type_name ? data.event_type_name.substring(0, 3).toUpperCase() : '');
    };

    fetchEventTypes();
    fetchCoordinations();

    if (id) {
      const fetchEvent = async () => {
        setIsLoading(true);
        const response = await Api.get(`/events/${id}`);
        if (response.statusCode === 200) {
          setInitialValues(response.data);
          updatePrefixFromInitialValues(response.data); // Actualiza el prefijo al cargar el evento
        } else {
          showAlertTopEnd('Error', 'No se pudo cargar la información del evento', 'error');
        }
        setIsLoading(false);
      };

      fetchEvent();
    }
  }, [id]);

  const [initialValues, setInitialValues] = useState({
    name_event: '',
    academic_hours: '',
    event_type_id: '',
    event_type_name: '',
    event_prefix: generateEventPrefix(),
    coordination_id: '',
    coordination_name: '',
    start_date: '',
    end_date: '',
    address: '',
    event_modality: '', // Agregado
    date_line_text: '',
    certificate_template_name: '', // Agregado
    event_open_text: '', // Agregado
    programatic_content: '', // Agregado
    teacher: '', // Agregado
    teacher_title: '', // Agregado
  
    // Firmas
    name_signature1: '', 
    jobtitle_signature1: '', 
    image_signature1: '', 
    name_signature2: '', 
    jobtitle_signature2: '', 
    image_signature2: '', 
    name_signature3: '', 
    jobtitle_signature3: '', 
    image_signature3: '',
  
    // Archivos
    font_file: '',
    certificate_template: '',
  });

  // ** VALIDACIÓN DEL FORMULARIO ** //

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
      .required('La fecha de inicio es requerida'),
    end_date: Yup.date()
      .required('La fecha de finalización es requerida')
      .min(Yup.ref('start_date'), 'La fecha de finalización debe ser posterior a la de inicio'),
    address: Yup.string()
      .nullable()
      .max(500, 'La dirección no puede exceder 500 caracteres'),
  
    // Campos adicionales
    event_modality: Yup.string()
      .required('La modalidad del evento es requerida')
      .max(50, 'La modalidad no puede exceder 50 caracteres'),
    date_line_text: Yup.string()
      .required('El texto de la línea de fecha es obligatorio')
      .max(255, 'El texto de la línea de fecha no puede exceder 255 caracteres'),
    certificate_template_name: Yup.string()
      .required('El nombre de la plantilla del certificado es obligatorio')
      .max(255, 'El nombre no puede exceder 255 caracteres'),
    event_open_text: Yup.string()
      .required('El texto introductorio del evento es obligatorio')
      .max(255, 'El texto introductorio no puede exceder 255 caracteres'),
    programatic_content: Yup.string()
      .nullable()
      .max(5000, 'El contenido programático no puede exceder 5000 caracteres'),
    teacher: Yup.string()
      .nullable()
      .max(255, 'El nombre del facilitador no puede exceder 255 caracteres'),
    teacher_title: Yup.string()
      .nullable()
      .max(100, 'El título del facilitador no puede exceder 100 caracteres'),
  
    // Validación de firmas
    // name_signature1: Yup.string()
    //   .required('El nombre del primer firmante es obligatorio')
    //   .max(255, 'El nombre no puede exceder 255 caracteres'),
    // jobtitle_signature1: Yup.string()
    //   .required('El cargo del primer firmante es obligatorio')
    //   .max(255, 'El cargo no puede exceder 255 caracteres'),
    // image_signature1: Yup.string()
    //   .required('El nombre de la imagen de la firma del primer firmante es obligatoria')
    //   .max(255, 'El nombre de la imagen de la firma del primer firmante no puede exceder 255 caracteres'),
  
    // name_signature2: Yup.string()
    //   .required('El nombre del segundo firmante es obligatorio')
    //   .max(255, 'El nombre no puede exceder 255 caracteres'),
    // jobtitle_signature2: Yup.string()
    //   .required('El cargo del segundo firmante es obligatorio')
    //   .max(255, 'El cargo no puede exceder 255 caracteres'),
    // image_signature2: Yup.string()
    //   .required('El nombre de la imagen de la firma del segundo firmante es obligatoria')
    //   .max(255, 'El nombre de la imagen de la firma del segundo firmante no puede exceder 255 caracteres'),
  
    // name_signature3: Yup.string()
    //   .required('El nombre del tercer firmante es obligatorio')
    //   .max(255, 'El nombre no puede exceder 255 caracteres'),
    // jobtitle_signature3: Yup.string()
    //   .required('El cargo del tercer firmante es obligatorio')
    //   .max(255, 'El cargo no puede exceder 255 caracteres'),
    // image_signature3: Yup.string()
    //   .required('El nombre de la imagen de la firma del tercer firmante es obligatoria')
    //   .max(255, 'El nombre de la imagen de la firma del tercer firmante no puede exceder 255 caracteres'),
  
    // Archivos de fuente y plantilla
    font_file: Yup.mixed()
      .nullable()
      .test('fileType', 'El archivo debe ser un archivo de fuente (ttf, otf)', (value) => {
        if (!value) return true;
        const allowedTypes = ['font/ttf', 'font/otf'];
        return allowedTypes.includes(value.type);
      })
      .test('fileSize', 'El archivo no puede exceder los 10 MB', (value) => !value || value.size <= 10000000),
    certificate_template: Yup.mixed()
      .nullable()
      .test('fileType', 'La plantilla debe ser una imagen (jpeg, png)', (value) => {
        if (!value) return true;
        const allowedTypes = ['image/jpeg', 'image/png'];
        return allowedTypes.includes(value.type);
      })
      .test('fileSize', 'La imagen no puede exceder los 2 MB', (value) => !value || value.size <= 2000000),
  });

  // ** FUNCIONES DE SUBMIT Y NAVEGACIÓN ** //

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Iterar y añadir campos al FormData
    Object.keys(values).forEach((key) => {
      if (key === 'font_file' || key === 'certificate_template') {
        if (values[key]) formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    setIsLoading(true);

    try {
      let response;
      if (id) {
        response = await Api.put(`/events/${id}`, values);
      } else {
        response = await Api.post('/events', values);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        showAlertTopEnd('Éxito', id ? 'Evento actualizado correctamente' : 'Evento agregado correctamente', 'success');
        navigate('/events');
      } else if (response.statusCode === 422 && response.data.errors) {
        Object.entries(response.data.errors).forEach(([field, messages]) => {
          showAlert('Error', `${field}: ${messages.join(' ')}`, 'error');
        });
      } else {
        showAlert('Error', `(${response.statusCode}) ${response.data.error}`, 'error');
      }
    } catch {
      showAlert('Error', 'Hubo un problema al guardar los datos', 'error');
    }

    setIsLoading(false);
  };

  const handleBack = () => navigate(-1);



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
              <label htmlFor="coordination_id" className="block text-sm font-medium text-gray-700">Coordinación</label>
              <Field
                as="select"
                name="coordination_id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedCoordination = coordinations.find(
                    (coord) => coord._id === selectedId
                  );

                  if (selectedCoordination) {
                    setFieldValue("coordination_name", selectedCoordination.name_coordination);
                    setFieldValue("coordination_id", String(selectedId));

                    // Actualizar `coordinationID` en el estado de `eventPrefix`
                    updateEventPrefix("coordinationID", selectedId);

                    // Establecer el valor del prefijo de evento
                    const newPrefix = generateEventPrefix();
                    setFieldValue("event_prefix", newPrefix);
                    console.log(`Nuevo Prefijo: ${newPrefix}`);
                  }
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
              <label htmlFor="event_type_id" className="block text-sm font-medium text-gray-700">Tipo de Evento</label>
              <Field
                as="select"
                name="event_type_id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedType = eventTypes.find(
                    (type) => type._id === selectedId
                  );
  
                  if (selectedType) {
                    setFieldValue("event_type_name", selectedType.name_event_type);
                    setFieldValue("event_type_id", selectedId);
  
                    // Actualizar `eventTypeAbrev` en el estado de `eventPrefix`
                    updateEventPrefix("eventTypeAbrev", selectedType.abrev);
  
                    // Establecer el valor del prefijo de evento
                    const newPrefix = generateEventPrefix();
                    setFieldValue("event_prefix", newPrefix);
                    console.log(`Nuevo Prefijo: ${newPrefix}`);
                  }
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
              <label htmlFor="event_prefix" className="block text-sm font-medium text-gray-700">Prefijo del Evento</label>
              <Field
                name="event_prefix"
                type="text"
                readOnly
                value={generateEventPrefix()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="event_prefix" component="div" className="text-red-600 text-sm mt-1" />
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

            

            <div className="mb-4">
              <label htmlFor="event_modality" className="block text-sm font-medium text-gray-700">
                Modalidad del Evento
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <Field
                  type="radio"
                  name="event_modality"
                  value="Presencial"
                  id="modality_presencial"
                  className="mr-2"
                />
                <label htmlFor="modality_presencial" className="text-gray-700">Presencial</label>

                <Field
                  type="radio"
                  name="event_modality"
                  value="Online"
                  id="modality_online"
                  className="mr-2"
                />
                <label htmlFor="modality_online" className="text-gray-700">Online</label>
              </div>
              <ErrorMessage name="event_modality" component="div" className="text-red-600 text-sm mt-1" />
            </div>
            <div>
              <label htmlFor="date_line_text" className="block text-sm font-medium text-gray-700">
                Texto de la línea de fecha [Certificado]
              </label>
              <Field
                name="date_line_text"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="date_line_text" component="div" className="text-red-600 text-sm mt-1" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección (o plataforma virtual en caso de ser ONLINE)</label>
              <Field
                name="address"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="address" component="div" className="text-red-600 text-sm mt-1" />
            </div>
            <div>
              <label htmlFor="certificate_template_name" className="block text-sm font-medium text-gray-700">
                Nombre de la Plantilla del Certificado
              </label>
              <Field
                name="certificate_template_name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="certificate_template_name" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="event_open_text" className="block text-sm font-medium text-gray-700">
                Texto libre sobre el nombre del evento [Certificado]
              </label>
              <Field
                name="event_open_text"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="event_open_text" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            

            <div>
              <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">
                Nombre del Facilitador (opcional)
              </label>
              <Field
                name="teacher"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="teacher" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="teacher_title" className="block text-sm font-medium text-gray-700">
                Cargo del Expositor (opcional)
              </label>
              <Field
                name="teacher_title"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="teacher_title" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            {/* Campos de firmas */}
            <div>
              <label htmlFor="name_signature1" className="block text-sm font-medium text-gray-700">
                Nombre del Firmante 1
              </label>
              <Field
                name="name_signature1"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="name_signature1" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="jobtitle_signature1" className="block text-sm font-medium text-gray-700">
                Cargo del Firmante 1
              </label>
              <Field
                name="jobtitle_signature1"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="jobtitle_signature1" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="image_signature1" className="block text-sm font-medium text-gray-700">
                Nombre de la Imagen de Firma 1
              </label>
              <Field
                name="image_signature1"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="image_signature1" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="name_signature2" className="block text-sm font-medium text-gray-700">
                Nombre del Firmante 2
              </label>
              <Field
                name="name_signature2"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="name_signature2" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="jobtitle_signature2" className="block text-sm font-medium text-gray-700">
                Cargo del Firmante 2
              </label>
              <Field
                name="jobtitle_signature2"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="jobtitle_signature2" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="image_signature2" className="block text-sm font-medium text-gray-700">
                Nombre de la Imagen de Firma 2
              </label>
              <Field
                name="image_signature2"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="image_signature2" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="name_signature3" className="block text-sm font-medium text-gray-700">
                Nombre del Firmante 3
              </label>
              <Field
                name="name_signature3"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="name_signature3" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="jobtitle_signature3" className="block text-sm font-medium text-gray-700">
                Cargo del Firmante 3
              </label>
              <Field
                name="jobtitle_signature3"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="jobtitle_signature3" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="image_signature3" className="block text-sm font-medium text-gray-700">
                Nombre de la Imagen de Firma 3
              </label>
              <Field
                name="image_signature3"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="image_signature3" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="programatic_content" className="block text-sm font-medium text-gray-700">
                Contenido Programático (opcional)
              </label>
              <Field
                as="textarea"
                name="programatic_content"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows="4"
              />
              <ErrorMessage name="programatic_content" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            {/* campos de archivo de fuente y de plantilla de certificado */}
            {/* <div>
              <label htmlFor="font_file" className="block text-sm font-medium text-gray-700">Archivo de Fuente</label>
              <input
                name="font_file"
                type="file"
                accept=".ttf,.otf"
                onChange={(event) => {
                  
                  const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                  setFieldValue("font_file", file);
                  /* const file = event.currentTarget.files[0];
                  console.log("Selected file font:", file); 
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
                  console.log("Selected file image:", file); 
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="certificate_template" component="div" className="text-red-600 text-sm mt-1" />
            </div> */}

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
