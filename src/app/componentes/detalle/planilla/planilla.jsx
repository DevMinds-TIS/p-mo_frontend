import React, { useState } from "react";
import "./planilla.css";

const DOCUMENT_OPTIONS = [
  "reporte sprint",
  "test plan",
  "historias de usuario",
  "actas",
];

export default function Planilla() {
  const [archivosSubidos, setArchivosSubidos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [archivoEnEdicion, setArchivoEnEdicion] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState(""); // Para el nombre del archivo/tarea
  const [archivoSubido, setArchivoSubido] = useState(null); // Para el archivo subido
  const [isEditing, setIsEditing] = useState(false); // Para manejar si se está editando
  const [tipoUsuario, setTipoUsuario] = useState('docent');

  // Abrir/Cerrar modal
  const handleAbrirModal = () => {
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setArchivoEnEdicion(null);
    setNuevaTarea("");
    setArchivoSubido(null);
    setIsEditing(false); // Reiniciar edición si estaba en curso
  };

  // Subir o editar archivo
  const handleGuardarTarea = () => {
    if (isEditing && archivoEnEdicion !== null) {
      const archivosActualizados = archivosSubidos.map((archivo, index) =>
        index === archivoEnEdicion
          ? { ...archivo, nombre: nuevaTarea, archivo: archivoSubido }
          : archivo
      );
      setArchivosSubidos(archivosActualizados);
    } else {
      const nuevoArchivo = {
        nombre: nuevaTarea,
        fechaSubida: new Date().toLocaleDateString(),
        estado: "Pendiente",
        archivo: archivoSubido,
      };
      setArchivosSubidos([...archivosSubidos, nuevoArchivo]);
    }
    handleCerrarModal(); // Cerrar modal después de guardar
  };

  // Guardar archivo subido
  const handleArchivoSubido = (e) => {
    setArchivoSubido(URL.createObjectURL(e.target.files[0])); // Crear URL temporal del archivo subido
  };

  // Eliminar archivo
  const handleEliminarArchivo = (index) => {
    const nuevosArchivos = archivosSubidos.filter((_, i) => i !== index);
    setArchivosSubidos(nuevosArchivos);
  };

  // Editar archivo
  const handleEditarArchivo = (index) => {
    setArchivoEnEdicion(index);
    setNuevaTarea(archivosSubidos[index].nombre);
    setIsEditing(true);
    handleAbrirModal(); // Abrir modal para editar
  };

  // Revisar archivo (actualizar estado y fecha de revisión)
  const handleRevisarArchivo = (index) => {
    const fechaActual = new Date().toLocaleDateString();
    const archivosActualizados = archivosSubidos.map((archivo, i) =>
      i === index
        ? { ...archivo, estado: "Revisado", fechaRevision: fechaActual }
        : archivo
    );
    setArchivosSubidos(archivosActualizados);
  };

  // Verifica si el tipo de documento ya está en uso
  const isDocumentAlreadyUploaded = (documentName) => {
    return archivosSubidos.some((archivo) => archivo.nombre === documentName);
  };

  return (
    <div className="actividad-semanal-container">
      <div className="planilla-titulo">
        <h2>Planilla de seguimiento</h2>
        {tipoUsuario !== 'docente' && (
          <button onClick={handleAbrirModal}>+</button>
        )}
      </div>

      <div className="planilla">
        {archivosSubidos.length > 0 ? (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Nombre del archivo</th>
                <th>Fecha de subida</th>
                <th>Estado</th>
                <th>Fecha de revisión</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {archivosSubidos.map((archivo, index) => (
                <tr key={index}>
                  <td>
                    <a
                      href={archivo.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                    {archivo.nombre}
                    </a>
                  </td>
                  <td>{archivo.fechaSubida}</td>
                  <td>{archivo.estado}</td>
                  <td>{archivo.fechaRevision || "Pendiente"}</td>
                  <td className="botones">
                    <a
                      href={archivo.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button onClick={() => handleRevisarArchivo(index)}>
                        Revisar
                      </button>
                    </a>
                    {tipoUsuario !== 'docente' && (
                      <>
                        <button onClick={() => handleEditarArchivo(index)}>
                          Editar
                        </button>
                        <button onClick={() => handleEliminarArchivo(index)}>
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se han subido archivos todavía.</p>
        )}
      </div>

      {/* Modal para subir/editar archivos */}
      {modalAbierto && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>{isEditing ? "Editar Actividad" : "Agregar Nueva Actividad"}</h3>
            <label>Seleccionar tipo de documento</label>
            <select
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              required
            >
              <option value="" disabled>Seleccione un documento</option>
              {DOCUMENT_OPTIONS.map((option) => (
                <option key={option} value={option} disabled={isDocumentAlreadyUploaded(option)}>
                  {option}
                </option>
              ))}
            </select>
            <label>Subir archivo</label>
            <input type="file" onChange={handleArchivoSubido} />
            <div className="modal-botones">
              <button onClick={handleGuardarTarea}>
                {isEditing ? "Guardar cambios" : "Guardar"}
              </button>
              <button onClick={handleCerrarModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
