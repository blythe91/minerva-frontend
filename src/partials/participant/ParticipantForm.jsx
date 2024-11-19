import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showAlertTopEnd, showAlert } from '../../components/utils/Alert'; // alertas
import { Api } from '../../services/Api'; // conexión a la API
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ParticipantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Listas desplegables para países
  const paises = [
    'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 
    'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 'Guatemala', 'Honduras', 
    'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Portugal', 'República Dominicana', 
    'Uruguay', 'Venezuela', 'Alemania', 'Francia', 'Italia', 'Reino Unido', 'Rusia', 
    'Japón', 'China', 'India', 'Australia', 'Canadá', 'Sudáfrica', 'Egipto', 
    'Nigeria', 'Arabia Saudita', 'Corea del Sur', 'Irlanda', 'Filipinas', 
    'Tailandia', 'Malasia', 'Nueva Zelanda', 'Turquía', 'Suecia', 'Noruega', 
    'Dinamarca', 'Finlandia', 'Suiza', 'Polonia', 'Países Bajos'
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
    nacionalidad: Yup.string()
      .required('La nacionalidad es requerida')
      .max(50, 'La nacionalidad no puede exceder 50 caracteres'),
    pais: Yup.string()
      .required('El país es requerido')
      .max(50, 'El país no puede exceder 50 caracteres'),
    estado: Yup.string()
      .required('El estado es requerido')
      .max(50, 'El estado no puede exceder 50 caracteres'),
    ciudad: Yup.string()
      .required('La ciudad es requerida')
      .max(50, 'La ciudad no puede exceder 50 caracteres'),
    direccion: Yup.string()
      .required('La dirección es requerida')
      .max(255, 'La dirección no puede exceder 255 caracteres'),
    codigo_postal: Yup.string()
      .required('El código postal es requerido')
      .matches(/^[0-9]+$/, 'Debe ser un código postal válido'),
    organizacion: Yup.string()
      .required('La organización es requerida')
      .max(255, 'La organización no puede exceder 255 caracteres'),
    cargo: Yup.string()
      .required('El cargo es requerido')
      .max(255, 'El cargo no puede exceder 255 caracteres'),
  });

  // Si hay un ID en la URL, cargamos los datos del participante para edición
  useEffect(() => {
    if (id) {
      const fetchParticipant = async () => {
        setIsLoading(true);
        const response = await Api.get(`/participants/${id}`);
        if (response.statusCode === 200) {
          setInitialValues(response.data);
        } else {
          showAlert('Error', 'No se pudo cargar la información del participante', 'error');
        }
        setIsLoading(false);
      };

      fetchParticipant();
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
    nacionalidad: '',
    pais: '',
    estado: '',
    ciudad: '',
    direccion: '',
    codigo_postal: '',
    organizacion: '', // Nuevo campo
    cargo: '', // Nuevo campo
  });

  // Función para manejar la creación o edición
  const handleSubmit = async (values) => {
    setIsLoading(true);
  
    try {
      let response;
      if (id) {
        // Actualizar participante
        response = await Api.put(`/participants/${id}`, values);
      } else {
        // Crear nuevo participante
        response = await Api.post('/participants', values);
      }
  
      if (response.statusCode === 200 || response.statusCode === 201) {
        // Éxito en la operación
        showAlert('Éxito', id ? 'Participante actualizado correctamente' : 'Participante agregado correctamente', 'success');
        navigate('/participants');
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
    <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-4">{id ? 'Editar Participante' : 'Agregar Participante'}</h2>
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
                    <Field 
                        name="cedula" 
                        className="w-full p-2 border rounded" 
                        type="text" 
                        pattern="[0-9]*" 
                        inputMode="numeric" 
                    />
                    <ErrorMessage name="cedula" component="div" className="text-red-500 text-sm" />
                    </div>
                </div>
                </div>

                {/* Información de Contacto */}
                <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block mb-2">Celular</label>
                    <Field 
                        name="celular" 
                        className="w-full p-2 border rounded" 
                        type="text" 
                        pattern="[0-9]*" 
                        inputMode="numeric" 
                    />
                    <ErrorMessage name="celular" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                    <label className="block mb-2">Email</label>
                    <Field name="email" type="email" className="w-full p-2 border rounded" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                    <label className="block mb-2">Nacionalidad</label>
                    <Field name="nacionalidad" className="w-full p-2 border rounded" />
                    <ErrorMessage name="nacionalidad" component="div" className="text-red-500 text-sm" />
                    </div>
                </div>
                </div>

                {/* Domicilio */}
                <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">Domicilio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block mb-2">País</label>
                    <Field as="select" name="pais" className="w-full p-2 border rounded">
                        <option value="">Seleccione un país</option>
                        {paises.map((pais, index) => (
                        <option key={index} value={pais}>{pais}</option>
                        ))}
                    </Field>
                    <ErrorMessage name="pais" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                    <label className="block mb-2">Estado</label>
                    <Field name="estado" className="w-full p-2 border rounded" />
                    <ErrorMessage name="estado" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                    <label className="block mb-2">Ciudad</label>
                    <Field name="ciudad" className="w-full p-2 border rounded" />
                    <ErrorMessage name="ciudad" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                    <label className="block mb-2">Dirección</label>
                    <Field name="direccion" className="w-full p-2 border rounded" />
                    <ErrorMessage name="direccion" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                    <label className="block mb-2">Código Postal</label>
                    <Field 
                        name="codigo_postal" 
                        className="w-full p-2 border rounded" 
                        type="text" 
                        pattern="[0-9]*" 
                        inputMode="numeric" 
                    />
                    <ErrorMessage name="codigo_postal" component="div" className="text-red-500 text-sm" />
                    </div>
                </div>
                </div>

                {/* Información Adicional */}
                <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">Información Adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block mb-2">Organización</label>
                    <Field name="organizacion" className="w-full p-2 border rounded" />
                    <ErrorMessage name="organizacion" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div>
                    <label className="block mb-2">Cargo</label>
                    <Field name="cargo" className="w-full p-2 border rounded" />
                    <ErrorMessage name="cargo" component="div" className="text-red-500 text-sm" />
                    </div>
                </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between">
                <button type="button" className="bg-gray-500 text-white p-2 rounded" onClick={handleBack}>Volver</button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">{id ? 'Actualizar' : 'Agregar'}</button>
                </div>
            </Form>
            </Formik>
        )}
    </div>
  );
};

export default ParticipantForm;
