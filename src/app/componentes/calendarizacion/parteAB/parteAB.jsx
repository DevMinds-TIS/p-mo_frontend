import React, { useState } from "react";
import "./parteAB.css";

const DOCUMENT_OPTIONS = [
  "Parte A",
  "Parte B",
];

export default function ParteAB() {
  const [archivosSubidos, setArchivosSubidos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [archivoEnEdicion, setArchivoEnEdicion] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState(""); 
  const [archivoSubido, setArchivoSubido] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [tipoUsuario, setTipoUsuario] = useState('docent');

  const handleAbrirModal = () => {
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setArchivoEnEdicion(null);
    setNuevaTarea("");
    setArchivoSubido(null);
    setIsEditing(false); 
  };

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
    handleCerrarModal(); 
  };

  const handleArchivoSubido = (e) => {
    setArchivoSubido(URL.createObjectURL(e.target.files[0])); 
  };

  const handleEliminarArchivo = (index) => {
    const nuevosArchivos = archivosSubidos.filter((_, i) => i !== index);
    setArchivosSubidos(nuevosArchivos);
  };

  const handleEditarArchivo = (index) => {
    setArchivoEnEdicion(index);
    setNuevaTarea(archivosSubidos[index].nombre);
    setIsEditing(true);
    handleAbrirModal(); 
  };

  const handleRevisarArchivo = (index) => {
    const fechaActual = new Date().toLocaleDateString();
    const archivosActualizados = archivosSubidos.map((archivo, i) =>
      i === index
        ? { ...archivo, estado: "Revisado", fechaRevision: fechaActual }
        : archivo
    );
    setArchivosSubidos(archivosActualizados);
  };

  const isDocumentAlreadyUploaded = (documentName) => {
    return archivosSubidos.some((archivo) => archivo.nombre === documentName);
  };

  return (
    <div className="actividad-semanal-container">
      <div className="planilla-titulo">
        <h2>Documentos del equipo</h2>
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
