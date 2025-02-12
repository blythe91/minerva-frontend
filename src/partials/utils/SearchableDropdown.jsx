import { useEffect, useRef, useState } from "react";

const SearchableDropdown = ({
  options, // Lista de participantes
  label, // Propiedad que se mostrará en el dropdown (en este caso, "cedula")
  id, // Identificador único para las opciones
  selectedVal, // Valor seleccionado (cedula)
  handleChange // Función para manejar el cambio de selección
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  // Función para seleccionar una opción
  const selectOption = (option) => {
    setQuery(""); // Limpiar la búsqueda
    handleChange(option[label]); // Llamar a la función handleChange con la cédula seleccionada
    setIsOpen(false); // Cerrar el dropdown
  };

  // Función para abrir/cerrar el dropdown
  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  // Función para obtener el valor que se muestra en el input
  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;
    return "";
  };

  // Función para filtrar las opciones basadas en la búsqueda
  const filter = (options) => {
    return options.filter((option) => {
      const value = option[label];
      return (
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(query.toLowerCase())
      );
    });
  };

  return (
    <div className="dropdown">
      <div className="control">
        <div className="selected-value">
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            onChange={(e) => {
              setQuery(e.target.value); // Actualizar la búsqueda
              handleChange(null); // Limpiar la selección
            }}
            onClick={toggle}
            placeholder="Buscar participante..."
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      {/* Mostrar las opciones filtradas */}
      <div className={`options ${isOpen ? "open" : ""}`}>
        {filter(options).map((option, index) => (
          <div
            onClick={() => selectOption(option)}
            className={`option ${
              option[label] === selectedVal ? "selected" : ""
            }`}
            key={`${id}-${index}`}
          >
            {option[label]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchableDropdown;