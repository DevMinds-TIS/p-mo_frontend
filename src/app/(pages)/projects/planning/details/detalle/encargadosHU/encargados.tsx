import React, { useState, useEffect } from "react";
import axios from "axios";

const ENCARGADOS_OPTIONS: string[] = [
  "Asencio Quintana Michael",
  "Fernandez Ayaviri Liz Ariana",
  "La Serna Mustieles Kevin Santiago",
  "Pacheco Quispe Abel Alejandro",
  "Perez Montes Sisa Eduarda",
  "Severiche Orellana Julio Cesar"
];



// interface ArchivoConCalificacion extends File {
//   nota?: string;
//   comentarios?: string;
// }

interface ErrorResponse {
  errors?: { [key: string]: string[] }; // Estructura para los posibles errores del servidor
}

interface ArchivoConCalificacion {
  id: number; // Asegúrate de que 'id' esté presente
  nombre: string;
  encargado: string;
  archivo: File;
  nota?: string; // Otras propiedades que pueda tener
  comentarios?: string;
}


interface AutoEvaluacionProps {
  //id: string;           // Para el ID real del sprint
  id: number;
  sprintNumber: string; // Para el número del sprint (ej: "Sprint #2")
  onDataSend: (cantidad: number) => void;
  iduser: number;
}


interface Errores {
  nombre: string;
  encargado: string;
  archivo: string;
}

type User = {
  ID_Usuario: number;
  Nombre: string;
  Apellido: string;
  Correo: string;
  Perfil?: string;
  Roles?: Role[];
};
type Role = {
  ID_Rol: number;
  Nombre_Rol: string;
};
interface DataItem {
  iduser: string; // o el tipo correcto, como `number`
  numsprint: number; // o el tipo correcto


}


interface Sprint {
  id: string;
  number: string;
  objective: string;
  startDate: string;
  endDate: string;
  progress: number | string; // Puede ser un número o el estado "waiting"
}

export default function AutoEvaluacion({ id, sprintNumber, onDataSend, iduser }: AutoEvaluacionProps) {
  const [archivosSubidos, setArchivosSubidos] = useState<any[]>([]);
  const [numeroHijo, setNumeroHijo] = useState(0);
  //const [localIdsprint, setLocalIdsprint] = useState<string>(number); // Guardar idsprint en el estado
  const [modalAbierto, setModalAbierto] = useState(false);
  const [calificacionModalAbierto, setCalificacionModalAbierto] = useState(false);
  //const [archivoEnEdicion, setArchivoEnEdicion] = useState(null);

  const [archivoEnEdicion, setArchivoEnEdicion] = useState<number | null>(null);

  const [nuevaTarea, setNuevaTarea] = useState("");
  const [archivoSubido, setArchivoSubido] = useState<File | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [encargado, setEncargado] = useState("");
  //const [errores, setErrores] = useState({ nombre: "", encargado: "", archivo: "" });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [nota, setNota] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [verCalificacion, setVerCalificacion] = useState(false);
  const [notaMostrada, setNotaMostrada] = useState("");
  const [comentariosMostrados, setComentariosMostrados] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoConCalificacion | null>(null);


  const [idNumber, setIdNumber] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [datoHijo, setDatoHijo] = useState("");

  useEffect(() => {
    console.log("Datos del sprint en el hijo:", { id, sprintNumber });
  }, [id, sprintNumber]);

  useEffect(() => {
    console.log("Número de archivos subidos:", numeroHijo);  // Verifica si el número está actualizado

    // Solo se ejecuta cuando numeroHijo cambia
    if (onDataSend && typeof onDataSend === 'function') {
      onDataSend(numeroHijo);
    }
  }, [numeroHijo]);  // Dependemos de numeroHijo para ejecutar el efecto después de que cambie


  useEffect(() => {
    const storedUserData = localStorage.getItem("user");


    if (storedUserData) {
      const userData = JSON.parse(storedUserData);

      // Crear un objeto User y asignarlo al estado
      const userToStore: User = {
        ID_Usuario: userData.ID_Usuario,
        Nombre: userData.Nombre,
        Apellido: userData.Apellido,
        Correo: userData.Correo,
        Perfil: userData.Perfil,
        Roles: userData.Roles
      };


      setUser(userToStore);


      // const isTeacherRole = userToStore.Roles[0]?.Nombre_Rol === 'Docente' ||
      //   (userToStore.Roles && userToStore.Roles.some(role => role.Nombre_Rol.toLowerCase().includes('profesor')));

      // console.log("datosdocente", userToStore.Roles);
      // setIsTeacher(isTeacherRole ?? false);
      // Verifica si userToStore y Roles están definidos
      const isTeacherRole =
        userToStore?.Roles?.[0]?.Nombre_Rol === 'Docente' ||
        userToStore?.Roles?.some(role => role.Nombre_Rol.toLowerCase().includes('profesor'));

      // Registra los datos en la consola solo si Roles está definido
      if (userToStore?.Roles) {
        console.log("datosdocente", userToStore.Roles);
      }

      // Asegura que el valor sea booleano
      setIsTeacher(!!isTeacherRole);


      console.log("aaaaaaaaaaaaaaaaaa", isTeacher);
      console.log('Usuario almacenado en el estado:', userToStore);
      console.log('Es docente:', isTeacherRole);
    } else {
      console.error('No se encontró userData en sessionStorage');
    }
  }, []);


  useEffect(() => {
    console.log("Valor recibido en id:", id);

    if (id) {
      // Limpiamos la cadena para que solo quede el número
      //const cleanedId = id.replace(/[^\d]/g, ""); // Elimina todos los caracteres no numéricos
      const cleanedId = String(id).replace(/[^\d]/g, "");  // Convierte id a string antes de aplicar replace

      console.log("ID limpio:", cleanedId);

      if (cleanedId) {
        setIdNumber(parseInt(cleanedId, 10)); // Guarda el número como entero
      } else {
        console.log("No se encontró un número en el id.");
      }
    }
  }, [id]);

  useEffect(() => {
    console.log("Número recuperado:", idNumber); // Verifica si el número está actualizado
  }, [idNumber]);



  // Fetch user stories when component mounts
  useEffect(() => {
    if (idNumber !== null && user !== null) {
      const fetchUserStories = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/historias-usuario");
          const iduserv = user.ID_Usuario;

          console.log("ssss", response.data);
          //console.log("ss", item.iduser);
          console.log("aaaaaaa", iduserv);
          const filteredData = response.data.filter((item: { iduser: string; numsprint: number }) =>

            String(iduser) == String(iduserv) && item.numsprint == idNumber
          );


          setArchivosSubidos(filteredData.length > 0 ? filteredData : []);
          //setNumeroHijo(filteredData.length);
          // Safely call onDataSend with a default check
          if (onDataSend && typeof onDataSend === 'function') {
            //const canthu = filteredData.length;
            setNumeroHijo(filteredData.length);
            //onDataSend(numeroHijo);
          }
        } catch (error) {
          console.error("Error fetching user stories:", error);
        }
      };

      fetchUserStories();
    }
  }, [id, user, sprintNumber]);


  useEffect(() => {
    if (onDataSend && typeof onDataSend === "function") {
      onDataSend(numeroHijo); // Pasamos el dato actualizado al padre
    }
  }, [numeroHijo, onDataSend]); // Dependemos de `numeroHijo` para que se ejecute cada vez que cambia


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

  const handleAbrirCalificacionModal = (archivo: ArchivoConCalificacion) => {
    setArchivoSeleccionado(archivo);  // Ahora acepta un tipo 'ArchivoConCalificacion'
    setCalificacionModalAbierto(true);
  };



  const handleVerClificacion = (archivo: ArchivoConCalificacion) => {
    setArchivoSeleccionado(archivo);
    setVerCalificacion(true);
    // Aquí podrías hacer una llamada al backend para obtener la calificación específica
    setNotaMostrada(archivo.nota || "");
    setComentariosMostrados(archivo.comentarios || "");
  };

  // const handleCerrarCalificacionModal = () => {
  //   setCalificacionModalAbierto(false);
  //   setNota("");
  //   setComentarios("");
  //   setArchivoSeleccionado(null);
  // };

  const handleCerrarVerNota = () => {
    setVerCalificacion(false);
    setArchivoSeleccionado(null);
  };

  const validarFormulario = () => {
    let errores: { [key: string]: string } = {};  // Tipo de índice
    if (!nuevaTarea) errores.nombre = "Por favor, complete el nombre.";
    if (!encargado) errores.encargado = "Por favor, seleccione un encargado.";
    if (!archivoSubido) errores.archivo = "Por favor, suba un archivo.";
    return errores;
  };


  const handleArchivoSubido = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files ? e.target.files[0] : null;
    setArchivoSubido(archivo);

    // No necesitamos crear URL.createObjectURL aquí si lo enviaremos directamente
  };



  const handleGuardarTarea = async () => {
    // Validación del formulario
    const erroresValidacion = validarFormulario();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);  // Actualiza los errores sin causar problemas
      return;
    }

    // Verificar que un archivo haya sido subido
    if (!archivoSubido) {
      setErrores(prev => ({ ...prev, archivo: "Por favor, suba un archivo." }));
      return;
    }

    try {
      setLoading(true);  // Indicar que el proceso está en marcha

      // Crear FormData para enviar al backend
      const formData = new FormData();
      formData.append('nombre', nuevaTarea);  // Nombre de la tarea
      formData.append('encargado', encargado);  // Encargado de la tarea
      formData.append('archivo', archivoSubido);  // Archivo subido, asegúrate de que no sea null ni undefined
      formData.append('iduser', user?.ID_Usuario?.toString() || '');  // Asegura que el ID de usuario sea un string
      formData.append('numsprint', (idNumber ?? 0).toString());  // Convierte idNumber a string si es necesario

      let response: any;  // Tipo adecuado para la respuesta de Axios

      if (isEditing && archivoEnEdicion !== null) {
        // Actualizar archivo existente
        const archivoActual = archivosSubidos[archivoEnEdicion];
        response = await axios.put(
          `http://localhost:8000/api/historias-usuario/${archivoActual.id}`,  // Asegúrate de que el ID sea correcto
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        // Actualizar los archivos subidos con la nueva respuesta
        const archivosActualizados = archivosSubidos.map((archivo, index) =>
          index === archivoEnEdicion ? response.data : archivo
        );
        setArchivosSubidos(archivosActualizados);

      } else {
        // Crear una nueva tarea con un nuevo archivo
        response = await axios.post(
          'http://localhost:8000/api/historias-usuario',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        // Agregar el nuevo archivo a la lista de archivos subidos
        setArchivosSubidos([...archivosSubidos, response.data]);
      }

      // Cerrar modal y limpiar campos
      handleCerrarModal();
    } catch (error) {
      console.error('Error guardando/actualizando tarea:', error);
      setErrores(prev => ({ ...prev, general: "Hubo un error al guardar/actualizar la tarea." }));
    } finally {
      setLoading(false);  // Detener el estado de carga
    }
  };



  const handleEliminarArchivo = async (index: number) => {
    const archivoAEliminar = archivosSubidos[index];

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/api/historias-usuario/${archivoAEliminar.id}`);

      const nuevosArchivos = archivosSubidos.filter((_, i) => i !== index);
      setArchivosSubidos(nuevosArchivos);
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarArchivo = (index: number) => {
    const archivoAEditar = archivosSubidos[index];

    setArchivoEnEdicion(index);
    setNuevaTarea(archivoAEditar.nombre);
    setEncargado(archivoAEditar.encargado);
    setIsEditing(true);
    handleAbrirModal();
  };

  const handleRevisarArchivo = async (index: number) => {
    const archivoARevizar = archivosSubidos[index];

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8000/api/historias-usuario/${archivoARevizar.id}`,
        { estado: "Terminado", fechaRevision: new Date().toISOString() }
      );

      const archivosActualizados = archivosSubidos.map((archivo, i) =>
        i === index ? response.data : archivo
      );

      setArchivosSubidos(archivosActualizados);
    } catch (error) {
      console.error("Error al actualizar el estado del archivo:", error);
    } finally {
      setLoading(false);
    }
  };



  const emvoiarmensaje = () => {
    if (typeof onDataSend === "function") {
      onDataSend(2);
    } else {
      console.error("La función onDataSend no está definida");
    }
  };

  const handleCalificarGeneral = () => {
    if (archivosSubidos.length === 0) {
      alert("No hay historias de usuario para calificar");
      return;
    }
    // Creamos un objeto que representa todas las HUs
    const historiasCompletas = {
      id: idNumber,
      nombre: "Historias de Usuario Sprint " + idNumber,
      encargado: "Asencio Quintana Michael",  // Valor predeterminado
      archivo: undefined,  // Puede ser undefined si no hay archivo disponible
    };



    setCalificacionModalAbierto(true);
  };

  const handleVerCalificacionGeneral = () => {
    if (archivosSubidos.length === 0) {
      alert("No hay historias de usuario para visualizar");
      return;
    }
    // const historiasCompletas = {
    //   id: idNumber,
    //   nombre: "Historias de Usuario Sprint " + idNumber,
    // };
    const historiasCompletas = {
      id: 1,
      nombre: "Historia de ejemplo",
      encargado: "Asencio Quintana Michael", // Agregar encargado
      archivo: new File(["contenido"], "archivoEjemplo.txt"), // Archivo ficticio
    };


    setArchivoSeleccionado(historiasCompletas);
    setVerCalificacion(true);

    setNotaMostrada(nota || "");
    setComentariosMostrados(comentarios || "");
  };



  const handleCalificar = async () => {
    if (!archivoSeleccionado) {
      console.warn("Archivo no seleccionado");
      return;
    }

    // Asegurarse de que 'nota' es un número entero
    //modificalo
    const notaEntera = parseInt(nota, 10);
    const idsprint = 1;


    if (isNaN(notaEntera)) {
      console.error("La nota debe ser un número entero válido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Log de envío de datos
      console.log("Enviando datos:", {
        nota: notaEntera,
        comentarios,
        user_id: user?.ID_Usuario,  // El ID del usuario
        idsprint: idsprint  // El ID del sprint
      });

      // Realizando la petición POST
      const response = await axios.post('http://localhost:8000/api/calificaciones', {
        nota: notaEntera,
        comentarios,
        user_id: user?.ID_Usuario,
        idsprint: idsprint
      });

      console.log("Respuesta recibida:", response.data);

      // Actualizar el estado local con la nueva calificación
      //setNotaMostrada(notaEntera);
      setNotaMostrada(`${notaEntera}`);

      setComentariosMostrados(comentarios);
      handleCerrarCalificacionModal(); // Llamar a la función para cerrar el modal
    } catch (error: any) {
      console.error("Error al guardar calificación:", error);

      if (error.response) {
        // Verificar detalles del error
        console.error("Error de servidor:", error.response.data);
        if (error.response.data.errors) {
          console.error("Errores específicos del servidor:", error.response.data.errors);
        }
      } else if (error.request) {
        console.error("Sin respuesta del servidor:", error.request);
      } else {
        console.error("Error desconocido:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar el modal de calificación
  const handleCerrarCalificacionModal = () => {
    // Lógica para cerrar el modal (definir la implementación específica)
  };

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center">
        <h2 className="w-1/2 text-3xl">Historias de Usuario</h2>
        <button onClick={emvoiarmensaje}>Enviar</button>
        <div className="w-1/2 flex flex-row-reverse gap-x-1">
          {isTeacher && (
            <>
              <button
                onClick={handleVerCalificacionGeneral}
                className="flex w-[30px] h-[30px] items-center justify-center bg-[#141265] rounded-md m-0 text-white"
                title="Ver calificación general"
              >
                V
              </button>
              <button
                onClick={handleCalificarGeneral}
                className="flex w-[30px] h-[30px] items-center justify-center bg-[#141265] rounded-md m-0 text-white"
                title="Calificar todas las historias"
              >
                C
              </button>
            </>
          )}
          {!isTeacher && (
            <button
              onClick={handleAbrirModal}
              className="flex w-[30px] h-[30px] items-center justify-center bg-[#141265] rounded-md m-0 text-white"
            >
              +
            </button>
          )}
        </div>
      </div>

      {/* Tabla de historias de usuario */}
      {archivosSubidos.length > 0 ? (
        <table className="border w-full">
          <thead className="border bg-[#f0e9e9]">
            <tr className="border">
              <th className="border">Nombre de historia de usuario</th>
              <th className="border">Encargado</th>
              <th className="border">Fecha de creación</th>
              <th className="border">Fecha de Finalización</th>
              <th className="border">Estado</th>
              <th className="border">Archivo</th>
              <th className="border">Acción</th>
            </tr>
          </thead>
          <tbody>
            {archivosSubidos.map((archivo, index) => (
              <tr key={index}>
                <td className="border p-1">
                  <a href={archivo.archivo} target="_blank" rel="noopener noreferrer">
                    {archivo.nombre}
                  </a>
                </td>
                <td className="border p-1">{archivo.encargado}</td>
                <td className="border p-1">{archivo.fechaSubida}</td>
                <td className="border p-1">{archivo.fechaRevision || "Pendiente"}</td>
                <td className="border p-1">{archivo.estado}</td>
                <td className="border p-1">{archivo.archivo}</td>
                <td className="border flex justify-center p-1 gap-x-1">
                  <button
                    onClick={() => handleRevisarArchivo(index)}
                    className="flex items-center justify-center bg-[#141265] rounded-md m-0 p-[5px] text-white"
                  >
                    Finalizar
                  </button>
                  <>
                    <button
                      onClick={() => handleEditarArchivo(index)}
                      className="flex items-center justify-center bg-[#141265] rounded-md m-0 p-[5px] text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarArchivo(index)}
                      className="flex items-center justify-center bg-[#141265] rounded-md m-0 p-[5px] text-white"
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

      {/* Modal para agregar/editar historia de usuario */}
      {modalAbierto && (
        <div className="modalmodal fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="flex flex-col bg-[#d1d6b0] p-2 rounded-md justify-center gap-y-2">
            <h3 className="text-center text-2xl">
              {isEditing ? "Editar Historia de Usuario" : "Agregar Nueva Historia de Usuario"}
            </h3>
            <label>Nombre del documento</label>
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              className="bg-[#d6d0d0] rounded-md h-10 p-1"
            />
            {errores.nombre && <p className="text-red-700">{errores.nombre}</p>}

            <label>Seleccionar encargado</label>
            <select
              value={encargado}
              onChange={(e) => setEncargado(e.target.value)}
              className="bg-[#d6d0d0] rounded-md h-10 p-1"
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
                className="flex items-center justify-center bg-[#352cdc] rounded-md m-0 w-1/2 p-[5px] text-white"
              >
                {isEditing ? "Guardar cambios" : "Guardar"}
              </button>
              <button
                onClick={handleCerrarModal}
                className="flex items-center justify-center bg-[#352cdc] rounded-md m-0 w-1/2 p-[5px] text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de calificación general */}
      {calificacionModalAbierto && (
        <div className="modalmodal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-[#ffffff] p-2 rounded-md justify-center gap-y-2">
            <h3 className="text-center text-2xl">Calificar Historias de Usuario - Sprint {idNumber}</h3>
            <label>Nota (1-100)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="bg-[#e2e2e2] rounded-md h-10 p-1 text-black"
            />
            <label>Comentarios</label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="bg-[#e2e2e2] rounded-md h-20 p-1 resize-none text-black"
            />
            <div className="flex justify-center items-center gap-x-1">
              <button
                onClick={handleCalificar}
                className="flex items-center justify-center bg-[#102255] rounded-md m-0 w-1/2 p-[5px] text-w text-white"
              >
                Calificar
              </button>
              <button
                onClick={handleCerrarCalificacionModal}
                className="flex items-center justify-center bg-[#102255] rounded-md m-0 w-1/2 p-[5px] text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver calificación general */}
      {verCalificacion && (
        <div className="modalmodal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-[#101010] p-2 rounded-md justify-center gap-y-2">
            <h3 className="text-center text-2xl">Calificación Sprint {idNumber}</h3>
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







