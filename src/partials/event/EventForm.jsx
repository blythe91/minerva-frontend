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

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    name_event: Yup.string()
      .required('El nombre del evento es requerido')
      .max(255, 'El nombre del evento no puede exceder 255 caracteres'),
    academic_hours: Yup.number()
      .required('Las horas académicas son requeridas')
      .min(0, 'Las horas académicas deben ser un número positivo'),
    event_type_id: Yup.number()
      .required('El ID del tipo de evento es requerido')
      .integer('Debe ser un número entero válido')
      .min(1, 'Debe ser un número entero válido'),
    event_type_name: Yup.string()
      .required('El nombre del tipo de evento es requerido')
      .max(255, 'El nombre del tipo de evento no puede exceder 255 caracteres'),
    event_prefix: Yup.string()
      .nullable()
      .max(10, 'El prefijo del evento no puede exceder 10 caracteres'),
    coordination_id: Yup.number()
      .required('El ID de la coordinación es requerido')
      .integer('Debe ser un número entero válido')
      .min(1, 'Debe ser un número entero válido'),
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
  });

  // Si hay un ID en la URL, cargamos los datos del evento para edición
  useEffect(() => {
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
        // Éxito en la operación
        showAlertTopEnd('Éxito', id ? 'Evento actualizado correctamente' : 'Evento agregado correctamente', 'success');
        navigate('/events');
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
    } catch (error) {
      // Error general
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
                <label htmlFor="event_type_id" className="block text-sm font-medium text-gray-700">ID Tipo de Evento</label>
                <Field
                name="event_type_id"
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="event_type_id" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
                <label htmlFor="event_type_name" className="block text-sm font-medium text-gray-700">Nombre Tipo de Evento</label>
                <Field
                name="event_type_name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="event_type_name" component="div" className="text-red-600 text-sm mt-1" />
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
                <label htmlFor="coordination_id" className="block text-sm font-medium text-gray-700">ID Coordinación</label>
                <Field
                name="coordination_id"
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="coordination_id" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
                <label htmlFor="coordination_name" className="block text-sm font-medium text-gray-700">Nombre de la Coordinación</label>
                <Field
                name="coordination_name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="coordination_name" component="div" className="text-red-600 text-sm mt-1" />
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

            <div className="flex justify-between items-center mt-4">
                <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                {isLoading ? 'Cargando...' : id ? 'Actualizar' : 'Crear'}
                </button>
                <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-400 
                text-white rounded"
                >
                Volver
                </button>
            </div>
            </Form>
        </Formik>
    </div>

  );
};

export default EventForm;
