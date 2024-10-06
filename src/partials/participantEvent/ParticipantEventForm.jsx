import React, { useEffect, useState } from "react";
import { Api } from "../../services/Api";
import { useParams, useNavigate } from "react-router-dom";
import { showAlertTopEnd } from "../../components/utils/Alert";

const ParticipantEventForm = () => {
  const { id } = useParams(); // para obtener el ID si se está editando
  const navigate = useNavigate();
  
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
    certificate_type_id: "",
  });

  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [participantTypes, setParticipantTypes] = useState([]);
  const [certificateTypes, setCertificateTypes] = useState([]);

  const [errors, setErrors] = useState({});

  // Fetching data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [participantResponse, eventResponse, participantTypeResponse, certificateTypeResponse] = await Promise.all([
          Api.get("/participants"),
          Api.get("/events"),
          Api.get("/participant-types"),
          Api.get("/certificate-types"),
        ]);

        setParticipants(participantResponse.data);
        setEvents(eventResponse.data);
        setParticipantTypes(participantTypeResponse.data);
        setCertificateTypes(certificateTypeResponse.data);
        
        // Load existing data for editing
        if (id) {
          const { data } = await Api.get(`/participant-events/${id}`);
          setParticipantEvent(data);
        }
      } catch (error) {
        showAlertTopEnd("Error", "Hubo un problema al cargar los datos", "error");
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
    const selectedEvent = events.find((ev) => ev.event_prefix === e.target.value);
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
    // Validar que todos los campos requeridos estén llenos
    const newErrors = {};
    if (!participantEvent.cedula) newErrors.cedula = "Seleccione un participante.";
    if (!participantEvent.event_prefix) newErrors.event_prefix = "Seleccione un evento.";
    if (!participantEvent.event_type_name) newErrors.event_type_name = "El tipo de evento es requerido.";
    if (!participantEvent.participant_type_id) newErrors.participant_type_id = "Seleccione un tipo de participante.";
    if (!participantEvent.certificate_type_id) newErrors.certificate_type_id = "Seleccione un tipo de certificado.";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
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
        certificate_type_id: String(participantEvent.certificate_type_id || ""),
        name_certificate_type: certificateTypes.find(ct => ct._id === participantEvent.certificate_type_id)?.name_certificate_type,
      };
  
      try {
        if (id) {
          await Api.put(`/participant-events/${id}`, payload);
          showAlertTopEnd("Éxito", "Registro actualizado correctamente", "success");
        } else {
          await Api.post("/participant-events", payload);
          showAlertTopEnd("Éxito", "Registro creado correctamente", "success");
        }
        navigate("/participant-events");
      } catch (error) {
        showAlertTopEnd("Error", "Hubo un problema al guardar el registro", "error");
        console.error(error);
      }
  };
 
  

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold">Formulario de Participante en Evento</h2>
  
      {/* Sección Datos de Participante */}
      <div>
        <h3 className="font-bold mb-2">Datos de Participante</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
  
      {/* Sección Datos del Evento */}
      <div>
        <h3 className="font-bold mb-2">Datos del Evento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Prefijo del Evento</label>
            <select
              name="event_prefix"
              value={participantEvent.event_prefix}
              onChange={handleEventChange}
              className="form-select"
            >
              <option value="">Seleccione un evento</option>
              {events.map((e) => (
                <option key={e._id} value={e.event_prefix}>
                  {e.event_prefix}
                </option>
              ))}
            </select>
            {errors.event_prefix && <p className="text-red-500 text-sm">{errors.event_prefix}</p>}
          </div>
  
          <div>
            <label className="block text-sm font-medium">Nombre del Evento</label>
            <input
              type="text"
              name="name_event"
              value={participantEvent.name_event}
              readOnly
              className="form-input"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium">Tipo de Evento</label>
            <input
              type="text"
              name="event_type_name"
              value={participantEvent.event_type_name} // Campo agregado
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
      </div>
  
      {/* Sección Tipos de Participante y Certificado */}
      <div>
        <h3 className="font-bold mb-2">Datos de Certificación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Tipo de Participante</label>
            <select
                name="participant_type_id"
                value={participantEvent.participant_type_id}
                onChange={handleInputChange} // Esto se mantuvo igual
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
  
          <div>
            <label className="block text-sm font-medium">Tipo de Certificado</label>
            <select
                name="certificate_type_id"
                value={participantEvent.certificate_type_id}
                onChange={handleInputChange} // Esto se mantuvo igual
                className="form-select"
                >
                <option value="">Seleccione un tipo de certificado</option>
                {certificateTypes.map((ct) => (
                    <option key={ct._id} value={ct._id}>
                    {ct.name_certificate_type}
                    </option>
                ))}
            </select>
            {errors.certificate_type_id && <p className="text-red-500 text-sm">{errors.certificate_type_id}</p>}
          </div>
        </div>
      </div>
  
      <button type="submit" className="btn btn-primary">
        {id ? "Actualizar" : "Agregar"} Participante en Evento
      </button>
    </form>
  );
  
};

export default ParticipantEventForm;
