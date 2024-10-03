import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showAlertTopEnd, showAlert } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EventRoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    name_event_role: Yup.string()
      .required('El nombre del rol es requerido')
      .max(255, 'El nombre del rol no puede exceder 255 caracteres'),
    description_event_role: Yup.string()
      .nullable()
      .max(500, 'La descripción no puede exceder 500 caracteres'),
  });

  // Valores iniciales del formulario
  const [initialValues, setInitialValues] = useState({
    name_event_role: '',
    description_event_role: '',
  });

  // Fetch del rol al cargar el componente
  useEffect(() => {
    if (id) {
      const fetchRole = async () => {
        setIsLoading(true);
        const response = await Api.get(`/event-roles/${id}`);
        if (response.statusCode === 200) {
          setInitialValues(response.data);
        } else {
          showAlertTopEnd('Error', 'No se pudo cargar la información del rol', 'error');
        }
        setIsLoading(false);
      };

      fetchRole();
    }
  }, [id]);

  // Función para manejar la creación o edición
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let response;
      if (id) {
        // Actualizar rol
        response = await Api.put(`/event-roles/${id}`, values);
      } else {
        // Crear nuevo rol
        response = await Api.post('/event-roles', values);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        showAlertTopEnd('Éxito', id ? 'Rol actualizado correctamente' : 'Rol agregado correctamente', 'success');
        navigate('/event-roles');
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{id ? 'Editar Rol' : 'Crear Rol'}</h1>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name_event_role" className="block text-sm font-medium text-gray-700">Nombre del Rol</label>
              <Field
                name="name_event_role"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="name_event_role" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="description_event_role" className="block text-sm font-medium text-gray-700">Descripción</label>
              <Field
                name="description_event_role"
                as="textarea"
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="description_event_role" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div className="flex justify space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:blue-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : id ? 'Actualizar Rol' : 'Crear Rol'}
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-gray-400 
                text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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

export default EventRoleForm;
