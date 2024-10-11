import React, { useState, useEffect } from "react";

export default function ActividadSemanal() {
  const [userName, setUserName] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [nuevoArchivo, setNuevoArchivo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  // Eliminar semana o corrida
  const handleEliminarSemana = (indexSemana) => {
    const nuevasSemanas = semanas.filter((_, i) => i !== indexSemana);
    setSemanas(nuevasSemanas);
  };

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center">
        <h2 className="w-1/2 text-3xl">Actividad Semanal (Corridas)</h2>
        <div className="w-1/2 flex flex-row-reverse">
          {tipoUsuario !== 'docente' && (
            <button 
              onClick={handleAgregarSemana}
              className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
            >+</button>
          )}
        </div>
      </div>

      {semanas.map((semana, indexSemana) => (
        <div key={indexSemana} className="flex flex-col gap-y-2">
          <div className="flex">
            <h2 className="w-1/2 text-2xl">Corrida {semana.numero}</h2>
            <div className="w-1/2 flex flex-row-reverse gap-x-1">
              {tipoUsuario !== 'docente' && (
                <>
                <button 
                  onClick={() => handleAbrirModal(indexSemana)}
                  className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                >+</button>
                <button
                  onClick={() => handleEliminarSemana(indexSemana)}
                  className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                >X</button>
                </>
              )}
            </div>
          </div>

          <table className="border w-full">
            <thead className="border bg-[#1E1E1E]">
              <tr>
                <th className="border">Tarea</th>
                <th className="border">Responsable</th>
                <th className="border">Fecha de Entrega</th>
                <th className="border">Fecha de Fin</th>
                <th className="border">Estado</th>
                <th className="border">Puntaje</th>
                <th className="border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {semana.actividades.map((actividad, indexActividad) => (
                <tr key={indexActividad}>
                  <td className="border p-1">
                  <a
                    href={actividad.archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {actividad.tarea}
                  </a>
                  </td>
                  <td className="border p-1">{actividad.responsable}</td>
                  <td className="border p-1">{actividad.fechaEntrega}</td>
                  <td className="border p-1">{actividad.fechaFin || "Pendiente"}</td>
                  <td className="border p-1">{actividad.estado}</td>
                  <td className="border p-1">{actividad.puntaje}</td>
                  <td className="border flex justify-center p-1 gap-x-1">
                    {tipoUsuario !== 'docente' && (
                    <>
                      <button 
                        onClick={() => handleFinalizarReanudar(indexSemana, indexActividad)}
                        className="flex items-center justify-center bg-[#FE7F2D]	rounded-md m-0 p-[5px]"
                        >
                        {actividad.estado === "En proceso" ? "Finalizar" : "Reanudar"}
                      </button>
                      <button 
                        onClick={() => handleAbrirModal(indexSemana, indexActividad)}
                        className="flex items-center justify-center bg-[#FE7F2D]	rounded-md m-0 p-[5px]"
                        >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleEliminar(indexSemana, indexActividad)}
                        className="flex items-center justify-center bg-[#FE7F2D]	rounded-md m-0 p-[5px]"
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
        </div>
      ))}

      {mostrarModal && (
        <div className="modalmodal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-[#101010] p-2 rounded-md justify-center gap-y-2">
            <h3 className="text-center text-2xl">{isEditing ? "Editar Actividad" : "Agregar Nueva Actividad"}</h3>
            <label>Nombre de la tarea</label>
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              className="bg-[#1E1E1E] rounded-md h-10 p-1"
            />
            <label>Subir archivo</label>
            <input type="file" onChange={handleArchivoSubido} />
            <div className="flex justify-center items-center gap-x-1">
              <button 
                onClick={handleGuardarTarea}
                className="flex items-center justify-center bg-[#FE7F2D] rounded-md m-0 w-1/2 p-[5px]"
              >{isEditing ? "Guardar cambios" : "Guardar"}</button>
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