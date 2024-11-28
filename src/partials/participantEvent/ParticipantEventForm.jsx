import React, { useEffect, useState } from "react";
import { Api } from "../../services/Api";
import { useParams, useNavigate } from "react-router-dom";
import { showAlertTopEnd, showAlert } from "../../components/utils/Alert";

const ParticipantEventForm = () => {
  const { id } = useParams(); // para obtener el ID si se está editando
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [participantEvent, setParticipantEvent] = useState({
    cedula: "",
    pri_nom: "",
    seg_nom: "", // Campo agregado
    pri_ape: "",
    seg_ape: "", // Campo agregado
    email: "",
    event_prefix: "",
    name_event: "",
    event_type_name: "", // Nuevo campo agregado
    coordination_name: "", // Campo de coordinación agregado
    participant_type_id: "",
  });

  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [participantTypes, setParticipantTypes] = useState([]);

  const [errors, setErrors] = useState({});

  // Fetching data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [participantResponse, eventResponse, participantTypeResponse] = await Promise.all([
          Api.get("/participants"),
          Api.get("/events"),
          Api.get("/participant-types"),
        ]);

        setParticipants(participantResponse.data);
        setEvents(eventResponse.data);
        setParticipantTypes(participantTypeResponse.data);
        
        // Load existing data for editing
        if (id) {
          const { data } = await Api.get(`/participant-events/${id}`);
          setParticipantEvent(data);
        }
      } catch (error) {
        showAlert("Error", "Hubo un problema al cargar los datos", "error");
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParticipantEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (e) => {
    const selectedCedula = e.target.value; // Captura del valor seleccionado
    console.log("Cédula seleccionada:", selectedCedula);
    
    const selectedParticipant = participants.find((p) => String(p.cedula) === String(selectedCedula));
    console.log("Participante encontrado:", selectedParticipant);
    if (selectedParticipant) {
      console.log("selecciono cédula");
      setParticipantEvent({
        ...participantEvent,
        cedula: selectedParticipant.cedula,
        pri_nom: selectedParticipant.pri_nom,
        seg_nom: selectedParticipant.seg_nom || "", // Campo agregado
        pri_ape: selectedParticipant.pri_ape,
        seg_ape: selectedParticipant.seg_ape || "", // Campo agregado
        email: selectedParticipant.email,
      });
    }
  };

  const handleEventChange = (e) => {
    const selectedEvent = events.find((ev) => ev.name_event === e.target.value);
    if (selectedEvent) {
      setParticipantEvent({
        ...participantEvent,
        event_prefix: selectedEvent.event_prefix,
        name_event: selectedEvent.name_event,
        coordination_name: selectedEvent.coordination_name, // Campo de coordinación agregado
        event_type_name: selectedEvent.event_type_name, // Almacena el tipo de evento seleccionado
      });
    }
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validar que todos los campos requeridos estén llenos
        const newErrors = {};
        if (!participantEvent.cedula) newErrors.cedula = "Seleccione un participante.";
        if (!participantEvent.event_prefix) newErrors.event_prefix = "Seleccione un evento.";
        if (!participantEvent.event_type_name) newErrors.event_type_name = "El tipo de evento es requerido.";
        if (!participantEvent.participant_type_id) newErrors.participant_type_id = "Seleccione un tipo de participante.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        // Preparar el objeto para la API
        const payload = {
            participant_id: String(participants.find(p => String(p.cedula) === String(participantEvent.cedula))?._id || ""),
            cedula: String(participantEvent.cedula),
            pri_nom: participantEvent.pri_nom,
            seg_nom: participantEvent.seg_nom,
            pri_ape: participantEvent.pri_ape,
            seg_ape: participantEvent.seg_ape,
            email: participantEvent.email,
            event_id: String(events.find(ev => ev.event_prefix === participantEvent.event_prefix)?._id || ""),
            name_event: participantEvent.name_event,
            event_type_name: participantEvent.event_type_name,
            coordination_name: participantEvent.coordination_name,
            event_prefix: participantEvent.event_prefix,
            participant_type_id: String(participantEvent.participant_type_id || ""),
            name_participant_type: participantTypes.find(pt => pt._id === participantEvent.participant_type_id)?.name_participant_type,
        };

        try {
            let response;
            if (id) {
                // Actualizar registro
                response = await Api.put(`/participant-events/${id}`, payload);
            } else {
                // Crear nuevo registro
                response = await Api.post("/participant-events", payload);
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
                showAlert("Éxito", id ? "Registro actualizado correctamente" : "Registro creado correctamente", "success");
                navigate("/participant-events");
            } else if (response.statusCode === 422 && response.data.errors) {
                // Manejar errores de validación
                Object.keys(response.data.errors).forEach((field) => {
                    const errorMsg = response.data.errors[field].join(" ");
                    showAlert("Error", `${field}: ${errorMsg}`, "error");
                });
            } else {
                // Otro tipo de error
                showAlert("Error", response.data.error + ` (${response.statusCode})`, "error");
            }
        } catch (error) {
            showAlert("Error", "Hubo un problema al guardar el registro", "error");
            console.error(error);
        }

        setIsLoading(false);
    };
 
 
    const handleBack = () => {
      navigate(-1); // Navega a la página anterior
    };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg space-y-6">
    <div className="flex justify-end mb-4">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => navigate('/participants/new')}
      >
        Agregar Participante
      </button>
    </div>

    <h2 className="text-3xl font-bold mb-4">Formulario de Participante en Evento</h2>

    {/* Sección Datos de Participante */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">Cédula</label>
        <select
          name="cedula"
          value={participantEvent.cedula}
          onChange={handleParticipantChange}
          className="form-select"
        >
          <option value="">Seleccione un participante</option>
          {participants.map((p) => (
            <option key={p._id} value={p.cedula}>
              {p.cedula}
            </option>
          ))}
        </select>
        {errors.cedula && <p className="text-red-500 text-sm">{errors.cedula}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Correo Electrónico</label>
        <input
          type="text"
          name="email"
          value={participantEvent.email}
          readOnly
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Primer Nombre</label>
        <input
          type="text"
          name="pri_nom"
          value={participantEvent.pri_nom}
          readOnly
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Primer Apellido</label>
        <input
          type="text"
          name="pri_ape"
          value={participantEvent.pri_ape}
          readOnly
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Segundo Nombre</label>
        <input
          type="text"
          name="seg_nom"
          value={participantEvent.seg_nom}
          readOnly
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Segundo Apellido</label>
        <input
          type="text"
          name="seg_ape"
          value={participantEvent.seg_ape}
          readOnly
          className="form-input"
        />
      </div>
    </div>

    {/* Sección Datos del Evento */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">Nombre del Evento</label>
        <select
          name="name_event"
          value={participantEvent.name_event}
          onChange={handleEventChange}
          className="form-select"
        >
          <option value="">Seleccione un evento</option>
          {events.map((e) => (
            <option key={e._id} value={e.name_event}>
              {e.name_event}
            </option>
          ))}
        </select>
        {errors.name_event && <p className="text-red-500 text-sm">{errors.name_event}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Prefijo del Evento</label>
        <input
          type="text"
          name="event_prefix"
          value={participantEvent.event_prefix}
          readOnly
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tipo de Evento</label>
        <input
          type="text"
          name="event_type_name"
          value={participantEvent.event_type_name}
          readOnly
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Coordinación</label>
        <input
          type="text"
          name="coordination_name"
          value={participantEvent.coordination_name}
          readOnly
          className="form-input"
        />
      </div>
    </div>

    {/* Sección Tipos de Participante y Certificado */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium">Tipo de Participante</label>
        <select
          name="participant_type_id"
          value={participantEvent.participant_type_id}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="">Seleccione un tipo de participante</option>
          {participantTypes.map((pt) => (
            <option key={pt._id} value={pt._id}>
              {pt.name_participant_type}
            </option>
          ))}
        </select>
        {errors.participant_type_id && <p className="text-red-500 text-sm">{errors.participant_type_id}</p>}
      </div>
    </div>

    <div className="flex space-x-4 mb-4">
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={handleBack}
      >
        Volver
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        type="submit"
      >
        {id ? "Actualizar" : "Agregar"} Participante en Evento
      </button>
    </div>
  </form>

  );
  
};

export default ParticipantEventForm;
