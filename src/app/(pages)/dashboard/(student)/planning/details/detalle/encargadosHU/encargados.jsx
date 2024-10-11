import React, { useState } from "react";

const ENCARGADOS_OPTIONS = ["Participante 1", "Participante 2", "Participante 3"];

export default function AutoEvaluacion() {
  const [archivosSubidos, setArchivosSubidos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [calificacionModalAbierto, setCalificacionModalAbierto] = useState(false); // Estado para el modal de calificación
  const [archivoEnEdicion, setArchivoEnEdicion] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [archivoSubido, setArchivoSubido] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [encargado, setEncargado] = useState("");
  const [errores, setErrores] = useState({ nombre: "", encargado: "", archivo: "" });
  const [nota, setNota] = useState(""); // Estado para la nota
  const [comentarios, setComentarios] = useState(""); // Estado para los comentarios
  const [verCalificacion, setVerCalificacion] = useState(false);
  const [notaMostrada, setNotaMostrada] = useState("");
  const [comentariosMostrados, setComentariosMostrados] = useState("");

  const handleAbrirModal = () => {
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setArchivoEnEdicion(null);
    setNuevaTarea("");
    setArchivoSubido(null);
    setEncargado("");
    setErrores({ nombre: "", encargado: "", archivo: "" });
    setIsEditing(false);
  };

  const handleAbrirCalificacionModal = () => {
    setCalificacionModalAbierto(true);
  };

  const handleVerClificacion =() => {
    setVerCalificacion(true);
  }

  const handleCerrarCalificacionModal = () => {
    setCalificacionModalAbierto(false);
    setNota("");
    setComentarios("");
  };

  const handleCerrarVerNota = () => {
    setVerCalificacion(false);
  }

  const validarFormulario = () => {
    let errores = {};
    if (!nuevaTarea) errores.nombre = "Por favor, complete el nombre.";
    if (!encargado) errores.encargado = "Por favor, seleccione un encargado.";
    if (!archivoSubido) errores.archivo = "Por favor, suba un archivo.";
    return errores;
  };

  const handleGuardarTarea = () => {
    const erroresValidacion = validarFormulario();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    if (isEditing && archivoEnEdicion !== null) {
      const archivosActualizados = archivosSubidos.map((archivo, index) =>
        index === archivoEnEdicion
          ? { ...archivo, nombre: nuevaTarea, archivo: archivoSubido, encargado }
          : archivo
      );
      setArchivosSubidos(archivosActualizados);
    } else {
      const nuevoArchivo = {
        nombre: nuevaTarea,
        fechaSubida: new Date().toLocaleDateString(),
        estado: "Pendiente",
        archivo: archivoSubido,
        encargado,
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
    setEncargado(archivosSubidos[index].encargado);
    setIsEditing(true);
    handleAbrirModal();
  };

  const handleRevisarArchivo = (index) => {
    const fechaActual = new Date().toLocaleDateString();
    const archivosActualizados = archivosSubidos.map((archivo, i) =>
      i === index
        ? { ...archivo, estado: "Terminado", fechaRevision: fechaActual }
        : archivo
    );
    setArchivosSubidos(archivosActualizados);
  };

  const handleCalificar = () => {
    console.log(`Nota: ${nota}, Comentarios: ${comentarios}`);
    setNotaMostrada(nota); // Guardar la nota mostrada
    setComentariosMostrados(comentarios); // Guardar los comentarios mostrados
    handleCerrarCalificacionModal(); // Cerrar el modal después de calificar
  };

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center">
        <h2 className="w-1/2 text-3xl">Historias de Usuario</h2>
        <div className="w-1/2 flex flex-row-reverse gap-x-1">
          <button 
            onClick={handleVerClificacion}
            className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
          >V</button>
          <button 
            onClick={handleAbrirCalificacionModal}
            className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
          >C</button>
          <button 
            onClick={handleAbrirModal}
            className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
          >+</button>
        </div>
      </div>
      
      {archivosSubidos.length > 0 ? (
        <table className="border w-full">
          <thead className="border bg-[#1E1E1E]">
            <tr className="border">
              <th className="border">Nombre del archivo</th>
              <th className="border">Encargado</th>
              <th className="border">Fecha de creación</th>
              <th className="border">Fecha de Finalización</th>
              <th className="border">Estado</th>
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
                <td className="border p-1">{archivo.encargado}</td>
                <td className="border p-1">{archivo.fechaSubida}</td>
                <td className="border p-1">{archivo.fechaRevision || "Pendiente"}</td>
                <td className="border p-1">{archivo.estado}</td>               
                <td className="border flex justify-center p-1 gap-x-1">
                  <button 
                    onClick={() => handleRevisarArchivo(index)}
                    className="flex items-center justify-center bg-[#FE7F2D]	rounded-md m-0 p-[5px]"
                  >
                    Finalizar
                  </button>
                  <>
                    <button 
                      onClick={() => handleEditarArchivo(index)}
                      className="flex items-center justify-center bg-[#FE7F2D]	rounded-md m-0 p-[5px]"
                      >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarArchivo(index)}
                      className="flex items-center justify-center bg-[#FE7F2D]	rounded-md m-0 p-[5px]"
                      >
                      Eliminar
                    </button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se han subido archivos todavía.</p>
      )}
      
      {modalAbierto && (
        <div className="modalmodal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-[#101010] p-2 rounded-md justify-center gap-y-2">
            <h3 className="text-center text-2xl">{isEditing ? "Editar Actividad" : "Agregar Nueva Actividad"}</h3>
            <label>Nombre del documento</label>
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              className="bg-[#1E1E1E] rounded-md h-10 p-1"
            />
            {errores.nombre && <p className="text-red-700">{errores.nombre}</p>}
            
            <label>Seleccionar encargado</label>
            <select
              value={encargado}
              onChange={(e) => setEncargado(e.target.value)}
              className="bg-[#1E1E1E] rounded-md h-10 p-1"
              required
            >
              <option value="" disabled>Seleccione un encargado</option>
              {ENCARGADOS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errores.encargado && <p className="text-red-700">{errores.encargado}</p>}

            <label>Subir archivo</label>
            <input type="file" onChange={handleArchivoSubido} />
            {errores.archivo && <p className="text-red-700">{errores.archivo}</p>}

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
                >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {calificacionModalAbierto && (
        <div className="modalmodal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-[#101010] p-2 rounded-md justify-center gap-y-2">
            <h3 className="text-center text-2xl">Calificar</h3>
            <label>Nota (1-100)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="bg-[#1E1E1E] rounded-md h-10 p-1"
            />
            <label>Comentarios</label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="bg-[#1E1E1E] rounded-md h-20 p-1 resize-none"
            />
            <div className="flex justify-center items-center gap-x-1">
              <button 
                onClick={handleCalificar}
                className="flex items-center justify-center bg-[#FE7F2D] rounded-md m-0 w-1/2 p-[5px]"
                >
                Calificar
              </button>
              <button 
                onClick={handleCerrarCalificacionModal}
                className="flex items-center justify-center bg-[#FE7F2D] rounded-md m-0 w-1/2 p-[5px]"
                >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {verCalificacion && (
        <div className="modalmodal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-[#101010] p-2 rounded-md justify-center gap-y-2">
            <h3 className="text-center text-2xl">Calificación</h3>
            <label>Nota (1-100)</label>
            <input
              type="text"
              value={notaMostrada}
              readOnly
              className="bg-[#1E1E1E] rounded-md h-10"
            />
            <label>Comentarios</label>
            <textarea
              value={comentariosMostrados}
              readOnly
              className="bg-[#1E1E1E] rounded-md h-20 resize-none"
            />
            <div className="flex justify-center items-center gap-x-1">
              <button 
                onClick={handleCerrarVerNota}
                className="flex items-center justify-center bg-[#FE7F2D] rounded-md m-0 w-1/2 p-[5px]"
                >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
