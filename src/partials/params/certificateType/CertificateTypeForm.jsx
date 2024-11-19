import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showAlertTopEnd, showAlert } from '../../../components/utils/Alert'; // alertas
import { Api } from '../../../services/Api'; // conexión a la API
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CertificateTypeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Esquema de validación con Yup, basado en el modelo de validación de backend
  const validationSchema = Yup.object({
    name_certificate_type: Yup.string()
      .required('El nombre del tipo de certificado es obligatorio.')
      .max(255, 'El nombre del tipo de certificado no debe exceder los 255 caracteres.'),
    description_certificate_type: Yup.string()
      .nullable()
      .max(500, 'La descripción no debe exceder los 500 caracteres.'),
  });

  // Valores iniciales del formulario
  const [initialValues, setInitialValues] = useState({
    name_certificate_type: '',
    description_certificate_type: '',
  });

  // Fetch de los tipos de certificados al cargar el componente, si existe ID
  useEffect(() => {
    if (id) {
      const fetchCertificateType = async () => {
        setIsLoading(true);
        const response = await Api.get(`/certificate-types/${id}`);
        if (response.statusCode === 200) {
          setInitialValues(response.data);
        } else {
          showAlert('Error', 'No se pudo cargar la información del tipo de certificado', 'error');
        }
        setIsLoading(false);
      };

      fetchCertificateType();
    }
  }, [id]);

  // Función para manejar la creación o edición
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let response;
      if (id) {
        // Actualizar tipo de certificado
        response = await Api.put(`/certificate-types/${id}`, values);
      } else {
        // Crear nuevo tipo de certificado
        response = await Api.post('/certificate-types', values);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        showAlert('Éxito', id ? 'Tipo de certificado actualizado correctamente' : 'Tipo de certificado agregado correctamente', 'success');
        navigate('/certificate-types');
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{id ? 'Editar Tipo de Certificado' : 'Crear Tipo de Certificado'}</h1>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name_certificate_type" className="block text-sm font-medium text-gray-700">Nombre del Tipo de Certificado</label>
              <Field
                name="name_certificate_type"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="name_certificate_type" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="description_certificate_type" className="block text-sm font-medium text-gray-700">Descripción</label>
              <Field
                name="description_certificate_type"
                as="textarea"
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage name="description_certificate_type" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:blue-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : id ? 'Actualizar Tipo de Certificado' : 'Crear Tipo de Certificado'}
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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

export default CertificateTypeForm;
