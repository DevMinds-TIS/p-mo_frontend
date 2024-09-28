import React, { useState, useEffect } from "react";
import "./semanal.css";

export default function ActividadSemanal() {
  const [userName, setUserName] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [nuevoArchivo, setNuevoArchivo] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para verificar si es edición
  const [editIndices, setEditIndices] = useState({ semanaIndex: null, actividadIndex: null });
  const [semanas, setSemanas] = useState([]);
  const [currentSemanaIndex, setCurrentSemanaIndex] = useState(0);
  const [tipoUsuario, setTipoUsuario] = useState('docent');

  useEffect(() => {
    const userDataString = window.sessionStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
    }
  }, []);

  // Finalizar/Reanudar tarea
  const handleFinalizarReanudar = (indexSemana, indexActividad) => {
    const nuevasSemanas = [...semanas];
    const actividad = nuevasSemanas[indexSemana].actividades[indexActividad];

    if (actividad.estado === "En proceso") {
      actividad.estado = "Finalizado";
      actividad.fechaFin = new Date().toLocaleDateString();
    } else {
      actividad.estado = "En proceso";
      actividad.fechaFin = "";
    }

    setSemanas(nuevasSemanas);
  };

  // Eliminar fila
  const handleEliminar = (indexSemana, indexActividad) => {
    const nuevasSemanas = [...semanas];
    nuevasSemanas[indexSemana].actividades = nuevasSemanas[indexSemana].actividades.filter(
      (_, i) => i !== indexActividad
    );
    setSemanas(nuevasSemanas);
  };

  // Abrir el modal para agregar o editar
  const handleAbrirModal = (index, actividadIndex = null) => {
    setMostrarModal(true);
    setIsEditing(actividadIndex !== null); // Si se está editando, activar el modo edición
    setCurrentSemanaIndex(index);

    if (actividadIndex !== null) {
      const actividad = semanas[index].actividades[actividadIndex];
      setNuevaTarea(actividad.tarea);
      setNuevoArchivo(actividad.archivo);
      setEditIndices({ semanaIndex: index, actividadIndex });
    } else {
      setNuevaTarea("");
      setNuevoArchivo(null);
    }
  };

  // Cerrar el modal
  const handleCerrarModal = () => {
    setMostrarModal(false);
    setIsEditing(false);
  };

  // Manejar carga de archivo
  const handleArchivoSubido = (e) => {
    setNuevoArchivo(e.target.files[0]);
  };

  // Añadir nueva tarea o editar existente
  const handleGuardarTarea = () => {
    const nuevasSemanas = [...semanas];

    if (isEditing) {
      // Editar actividad existente
      const { semanaIndex, actividadIndex } = editIndices;
      nuevasSemanas[semanaIndex].actividades[actividadIndex].tarea = nuevaTarea;
      nuevasSemanas[semanaIndex].actividades[actividadIndex].archivo = nuevoArchivo;
    } else {
      // Agregar nueva actividad
      if (nuevaTarea.trim() !== "" && nuevoArchivo) {
        const nuevaActividad = {
          tarea: nuevaTarea,
          responsable: userName,
          fechaEntrega: new Date().toLocaleDateString(),
          fechaFin: "",
          estado: "En proceso",
          puntaje: 0,
          archivo: nuevoArchivo,
        };
        nuevasSemanas[currentSemanaIndex].actividades.push(nuevaActividad);
      }
    }

    setSemanas(nuevasSemanas);
    setNuevaTarea("");
    setNuevoArchivo(null);
    handleCerrarModal();
  };

  // Añadir nueva semana
  const handleAgregarSemana = () => {
    const nuevaSemana = {
      numero: semanas.length + 1,
      actividades: [],
    };
    setSemanas((prev) => [...prev, nuevaSemana]);
  };

  // Ver archivo
  const handleVerArchivo = (archivo) => {
    if (archivo) {
      const fileURL = URL.createObjectURL(archivo);
      window.open(fileURL, "_blank");
    }
  };

  return (
    <div className="actividad-semanal-container">
      <div className="semanal-titulo">
        <h2>Actividad Semanal</h2>
        {tipoUsuario !== 'docente' && (
          <button onClick={handleAgregarSemana}>Semana +</button>
        )}
      </div>

      {semanas.map((semana, indexSemana) => (
        <div key={indexSemana} className="semana">
          <div className="semana-cabeza">
            <h2>Semana {semana.numero}</h2>
            {tipoUsuario !== 'docente' && (
              <button onClick={() => handleAbrirModal(indexSemana)}>+</button>
            )}
          </div>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Tarea</th>
                <th>Responsable</th>
                <th>Fecha de Entrega</th>
                <th>Fecha de Fin</th>
                <th>Estado</th>
                <th>Puntaje</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {semana.actividades.map((actividad, indexActividad) => (
                <tr key={indexActividad}>
                  <td>{actividad.tarea}</td>
                  <td>{actividad.responsable}</td>
                  <td>{actividad.fechaEntrega}</td>
                  <td>{actividad.fechaFin || "Pendiente"}</td>
                  <td>{actividad.estado}</td>
                  <td>{actividad.puntaje}</td>
                  <td className="botones">
                    {actividad.archivo && (
                      <button onClick={() => handleVerArchivo(actividad.archivo)}>Ver</button>
                    )}
                    {tipoUsuario !== 'docente' && (
                    <>
                      <button onClick={() => handleFinalizarReanudar(indexSemana, indexActividad)}>
                        {actividad.estado === "En proceso" ? "Finalizar" : "Reanudar"}
                      </button>
                      <button onClick={() => handleAbrirModal(indexSemana, indexActividad)}>Editar</button>
                      <button onClick={() => handleEliminar(indexSemana, indexActividad)}>Eliminar</button>
                    </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {mostrarModal && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>{isEditing ? "Editar Actividad" : "Agregar Nueva Actividad"}</h3>
            <label>Nombre de la tarea</label>
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
            />
            <label>Subir archivo</label>
            <input type="file" onChange={handleArchivoSubido} />
            <div className="modal-botones">
              <button onClick={handleGuardarTarea}>{isEditing ? "Guardar cambios" : "Guardar"}</button>
              <button onClick={handleCerrarModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}