import React, { useState, useEffect } from "react";

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
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [archivoSubido, setArchivoSubido] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("docent");

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    const tareasGuardadas = localStorage.getItem("archivosSubidos");
    if (tareasGuardadas) {
      setArchivosSubidos(JSON.parse(tareasGuardadas));
    }
  }, []);

  // Guardar en localStorage cada vez que cambie archivosSubidos
  useEffect(() => {
    localStorage.setItem("archivosSubidos", JSON.stringify(archivosSubidos));
  }, [archivosSubidos]);

  const handleAbrirModal = () => setModalAbierto(true);

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
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center">
        <h2 className="w-1/2 text-3xl">Planilla de seguimiento</h2>
        <div className="w-1/2 flex flex-row-reverse">
          {tipoUsuario !== 'docente' && (
            <button
              onClick={handleAbrirModal}
              className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
            >+</button>
          )}
        </div>
      </div>

      {archivosSubidos.length > 0 ? (
        <table className="border w-full">
          <thead className="border bg-[#1E1E1E]">
            <tr className="border">
              <th className="border">Nombre del archivo</th>
              <th className="border">Fecha de subida</th>
              <th className="border">Estado</th>
              <th className="border">Fecha de revisión</th>
              <th className="border">Acción</th>
            </tr>
          </thead>
          <tbody>
            {archivosSubidos.map((archivo, index) => (
              <tr key={index}>
                <td className="border p-1">
                  <a
                    href={archivo.archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {archivo.nombre}
                  </a>
                </td>
                <td className="border p-1">{archivo.fechaSubida}</td>
                <td className="border p-1">{archivo.estado}</td>
                <td className="border p-1">{archivo.fechaRevision || "Pendiente"}</td>
                <td className="border flex justify-center p-1 gap-x-1">
                  <a
                    href={archivo.archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      onClick={() => handleRevisarArchivo(index)}
                      className="flex items-center justify-center bg-[#FE7F2D]	rounded-md m-0 p-[5px]"
                    >
                      Revisar
                    </button>
                  </a>
                  {tipoUsuario !== 'docente' && (
                    <>
                      <button
                        onClick={() => handleEditarArchivo(index)}
                        className="flex items-center justify-center bg-[#FE7F2D]	rounded-md m-0 p-[5px]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarArchivo(index)}
                        className="flex items-center justify-center bg-[#FE7F2D] rounded-md m-0 p-[5px]"
                      >
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

      {/* Modal para subir/editar archivos */}
      {modalAbierto && (
        <div className="modalmodal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-[#101010] p-2 rounded-md justify-center gap-y-2">
            <h3 className="text-center text-2xl">{isEditing ? "Editar Actividad" : "Agregar Nueva Actividad"}</h3>
            <label>Seleccionar tipo de documento</label>
            <select
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              required
              className="bg-[#1E1E1E] rounded-md h-10"
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
            <div className="flex justify-center items-center gap-x-1">
              <button
                onClick={handleGuardarTarea}
                className="flex items-center justify-center bg-[#FE7F2D] rounded-md m-0 w-1/2 p-[5px]"
              >
                {isEditing ? "Guardar cambios" : "Guardar"}
              </button>
              <button
                onClick={handleCerrarModal}
                className="flex items-center justify-center bg-[#FE7F2D] rounded-md m-0 w-1/2 p-[5px]"
              >Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
