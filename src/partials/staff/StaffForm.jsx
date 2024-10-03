import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showAlertTopEnd, showAlert } from '../../components/utils/Alert'; // alertas
import { Api } from '../../services/Api'; // conexión a la API
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Listas desplegables para grados de instrucción y títulos
  const gradosInstruccion = [
    'Primaria', 'Secundaria', 'Técnico Medio', 'Técnico Superior', 'Universitario',
    'Maestría', 'Doctorado', 'Postdoctorado'
  ];

  const titulos = [
    'Ingeniero Civil', 'Médico Cirujano', 'Físico', 'Abogado', 'Economista',
    'Psicólogo', 'Arquitecto', 'Diseñador Gráfico', 'Veterinario'
  ];

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    pri_nom: Yup.string()
      .required('El primer nombre es requerido')
      .max(50, 'El primer nombre no puede exceder 50 caracteres'),
    seg_nom: Yup.string()
      .nullable()
      .max(50, 'El segundo nombre no puede exceder 50 caracteres'),
    pri_ape: Yup.string()
      .required('El primer apellido es requerido')
      .max(50, 'El primer apellido no puede exceder 50 caracteres'),
    seg_ape: Yup.string()
      .nullable()
      .max(50, 'El segundo apellido no puede exceder 50 caracteres'),
    cedula: Yup.string()
      .required('La cédula es requerida')
      .matches(/^[0-9]+$/, 'La cédula debe ser un número válido'),
    celular: Yup.string()
      .required('El celular es requerido')
      .matches(/^[0-9]+$/, 'Debe ser un número válido'),
    email: Yup.string()
      .email('Debe ser un email válido')
      .required('El email es requerido'),
    direccion: Yup.string()
      .required('La dirección es requerida')
      .max(255, 'La dirección no puede exceder 255 caracteres'),
    codigo_postal: Yup.string()
      .required('El código postal es requerido')
      .matches(/^[0-9]+$/, 'Debe ser un código postal válido'),
    grado_instruccion: Yup.string()
      .required('El grado de instrucción es requerido')
      .max(100, 'El grado de instrucción no puede exceder 100 caracteres'),
    titulo: Yup.string()
      .nullable()
      .max(255, 'El título no puede exceder 255 caracteres'),
  });

  // Si hay un ID en la URL, cargamos los datos de "Staff" para edición
  useEffect(() => {
    if (id) {
      const fetchStaff = async () => {
        setIsLoading(true);
        const response = await Api.get(`/staff/${id}`);
        if (response.statusCode === 200) {
          const data = response.data;
          setInitialValues({
            pri_nom: data.pri_nom || '',
            seg_nom: data.seg_nom || '',
            pri_ape: data.pri_ape || '',
            seg_ape: data.seg_ape || '',
            cedula: data.cedula || '',
            celular: data.celular || '',
            email: data.email || '',
            direccion: data.direccion || '',
            codigo_postal: data.codigo_postal || '',
            grado_instruccion: data.grado_instruccion || '',
            titulo: data.titulo || '',
          });
        } else {
          showAlertTopEnd('Error', 'No se pudo cargar la información del Staff', 'error');
        }
        setIsLoading(false);
      };

      fetchStaff();
    }
  }, [id]);

  // Valores iniciales del formulario
  const [initialValues, setInitialValues] = useState({
    pri_nom: '',
    seg_nom: '',
    pri_ape: '',
    seg_ape: '',
    cedula: '',
    celular: '',
    email: '',
    direccion: '',
    codigo_postal: '',
    grado_instruccion: '',
    titulo: '',
  });

  // Función para manejar la creación o edición
  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      let response;
      if (id) {
        // Actualizar staff
        response = await Api.put(`/staff/${id}`, values);
      } else {
        // Crear nuevo staff
        response = await Api.post('/staff', values);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        showAlertTopEnd('Éxito', id ? 'Staff actualizado correctamente' : 'Staff agregado correctamente', 'success');
        navigate('/staff');
      } else if (response.statusCode === 422 && response.data.errors) {
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
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">{id ? 'Editar Staff' : 'Agregar Staff'}</h2>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          <Form>
            {/* Información Personal */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Primer Nombre</label>
                  <Field name="pri_nom" className="w-full p-2 border rounded" />
                  <ErrorMessage name="pri_nom" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block mb-2">Segundo Nombre</label>
                  <Field name="seg_nom" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2">Primer Apellido</label>
                  <Field name="pri_ape" className="w-full p-2 border rounded" />
                  <ErrorMessage name="pri_ape" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block mb-2">Segundo Apellido</label>
                  <Field name="seg_ape" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2">Cédula</label>
                  <Field name="cedula" className="w-full p-2 border rounded" />
                  <ErrorMessage name="cedula" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Teléfono</label>
                  <Field name="celular" className="w-full p-2 border rounded" />
                  <ErrorMessage name="celular" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <Field name="email" type="email" className="w-full p-2 border rounded" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Información de Ubicación */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Información de Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Dirección</label>
                  <Field name="direccion" className="w-full p-2 border rounded" />
                  <ErrorMessage name="direccion" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block mb-2">Código Postal</label>
                  <Field name="codigo_postal" className="w-full p-2 border rounded" />
                  <ErrorMessage name="codigo_postal" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Información Académica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Grado de Instrucción</label>
                  <Field name="grado_instruccion" as="select" className="w-full p-2 border rounded">
                    <option value="">Seleccione un grado de instrucción</option>
                    {gradosInstruccion.map((grado) => (
                      <option key={grado} value={grado}>
                        {grado}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="grado_instruccion" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block mb-2">Título</label>
                  <Field name="titulo" as="select" className="w-full p-2 border rounded">
                    <option value="">Seleccione un título</option>
                    {titulos.map((titulo) => (
                      <option key={titulo} value={titulo}>
                        {titulo}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex justify space-x-4">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:blue-offset-2 focus:ring-blue-500">
                    {id ? 'Actualizar' : 'Agregar'} Personal
                </button>
                <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-400 
                text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Volver
                </button>  
            </div>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default StaffForm;
