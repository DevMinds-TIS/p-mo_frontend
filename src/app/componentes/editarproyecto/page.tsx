"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import HeaderName from '../modals/usuario/nombre.jsx';
import "./editarproyecto.css";
import { updatePartialProyect, getProyectID } from '../../../../api/register.api';

export default function PruevaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState('');
  const [proyecto, setProyecto] = useState(null); // Estado para los datos del proyecto
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  // Obtén el nombre del usuario almacenado en sessionStorage
  useEffect(() => {
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
    }
    console.log("User Data:", userDataString);  // Depuración del usuario
  }, []);

  // Obtén el ID del proyecto desde la URL y luego carga los datos del proyecto
  useEffect(() => {
    const id = searchParams.get('id'); // Obtén el parámetro 'id' desde la query string
    if (id) {
      const fetchProyecto = async () => {
        try {
          const response = await getProyectID(id);
          setProyecto(response.data.proyecto); // Almacena los datos del proyecto
          console.log("Datos del Proyecto:", response.data); // Depuración de los datos del proyecto
        } catch (error) {
          console.error('Error al obtener datos del proyecto:', error);
        }
      };

      fetchProyecto();
    }
  }, [searchParams]);

  const handleCancel = () => {
    router.push(`/componentes/home`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData();
    formData.append('nombreproyecto', form.nombre.value);
    formData.append('codigo', form.codigo.value);
    formData.append('invitacionproyecto', form.archivo1.files[0]);
    formData.append('pliegoproyecto', form.archivo2.files[0]);

    console.log("Form Data to Submit:", formData);  // Depuración de los datos del formulario

    try {
      const response = await updatePartialProyect(proyecto.idproyecto, formData); // Actualiza el proyecto con los datos del formulario
      console.log("Proyecto actualizado:", response.data);  // Depuración de la respuesta de actualización

      setMensajeModal("Se han guardado los cambios correctamente");
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
    }
  };

  if (!proyecto) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <Menu />
      <a href='/componentes/editarperfil'><HeaderName name={userName} /></a>
      <main className="crearproyectos-container">
        <h2>Editar Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="codigo">Código</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              defaultValue={proyecto.codigo} // Rellenar con datos del proyecto
              placeholder="Ingrese el código del proyecto"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              defaultValue={proyecto.nombreproyecto} // Rellenar con datos del proyecto
              placeholder="Ingrese el nombre del proyecto"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="archivo1">Invitación del Proyecto</label>
            <input
              type="file"
              id="archivo1"
              name="archivo1"
            />
            {proyecto.invitacionproyecto && (
              <a href={`/${proyecto.invitacionproyecto}`} target="_blank" rel="noopener noreferrer">Ver invitación actual</a>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="archivo2">Pliego de Especificaciones</label>
            <input
              type="file"
              id="archivo2"
              name="archivo2"
            />
            {proyecto.pliegoproyecto && (
              <a href={`/${proyecto.pliegoproyecto}`} target="_blank" rel="noopener noreferrer">Ver pliego actual</a>
            )}
          </div>
          <div className="fechas-group">
            <div className="fecha-item">
              <label htmlFor="fechaProyecto">Modificar fecha de duración del proyecto</label>
              <div className="fecha-inputs">
                <input
                  type="date"
                  id="fechaIniProyecto"
                  name="fechaIniProyecto"
                  defaultValue={proyecto.fechainicioproyecto ? proyecto.fechainicioproyecto.split('T')[0] : ''} // Rellenar con datos del proyecto
                />
                <input
                  type="date"
                  id="fechaFinProyecto"
                  name="fechaFinProyecto"
                  defaultValue={proyecto.fechafinproyecto ? proyecto.fechafinproyecto.split('T')[0] : ''} // Rellenar con datos del proyecto
                />
              </div>
            </div>

            <div className="fecha-item">
              <label htmlFor="fechaInscripciones">Modificar duración de inscripciones</label>
              <div className="fecha-inputs">
                <input
                  type="date"
                  id="fechaIniInscripciones"
                  name="fechaIniInscripciones"
                  defaultValue={proyecto.fechainicioinscripcion ? proyecto.fechainicioinscripcion.split('T')[0] : ''} // Rellenar con datos del proyecto
                />
                <input
                  type="date"
                  id="fechaFinInscripciones"
                  name="fechaFinInscripciones"
                  defaultValue={proyecto.fechafininscripcion ? proyecto.fechafininscripcion.split('T')[0] : ''} // Rellenar con datos del proyecto
                />
              </div>
            </div>
          </div>

          <button type="submit">Guardar cambios</button>
          <button type="button" onClick={handleCancel} style={{ marginTop: "10px" }}>
            Cancelar
          </button>
        </form>
      </main>
      <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal} />
    </div>
  );
}



// "use client";
// import Image from 'next/image';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Menu from '../modals/menu/menu.jsx';
// import ModalMensaje from '../modals/mensajes/mensaje.jsx';
// import HeaderName from '../modals/usuario/nombre.jsx';
// import "./editarproyecto.css";
// import { updatePartialProyect, getProyectID } from '../../../../api/register.api';

// export default function PruevaPage() {
//   const router = useRouter();
//   const [userName, setUserName] = useState('');

//   const [mostrarModal, setMostrarModal] = useState(false);
//   const [mensajeModal, setMensajeModal] = useState('');
//   const [proyectos, setProyectos] = useState([]);

//   const handleCerrarModal = () => {
//     setMostrarModal(false);
//   };

//   useEffect(() => {
//     const userDataString = window.sessionStorage.getItem('userData');
//     if (userDataString) {
//       const userData = JSON.parse(userDataString);
//       setUserName(`${userData.nombre} ${userData.apellido}`);
//     }
//     console.log("User Data:", userDataString);  // Depuración del usuario
//   }, []);

//   useEffect(() => {
//     const fetchProyectos = async () => {
//       try {
//         const response = await getAllRegisterProyect();
//         console.log("Proyectos Response:", response.data);  // Depuración de los proyectos
//         if (response.data && Array.isArray(response.data.actor)) {
//           setProyectos(response.data.actor);
//         } else {
//           console.error('Formato inesperado de datos:', response.data);
//         }
//       } catch (error) {
//         console.error('Error al obtener proyectos:', error);
//       }
//     };

//     fetchProyectos();
//   }, []);

//   const handleCancel = () => {
//     router.push(`/componentes/home`);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const form = event.target;

//     const formData = new FormData();
//     formData.append('nombreproyecto', form.nombre.value);
//     formData.append('codigo', form.codigo.value);
//     formData.append('invitacionproyecto', form.archivo1.files[0]);
//     formData.append('pliegoproyecto', form.archivo2.files[0]);

//     console.log("Form Data to Submit:", formData);  // Depuración de los datos del formulario

//     try {
//       const response = await createRegisterProyect(formData);
//       console.log("Proyecto creado:", response.data);  // Depuración de la respuesta de creación de proyecto

//       const updatedProyectos = await getAllRegisterProyect();
//       console.log("Updated Proyectos:", updatedProyectos.data);  // Depuración de los proyectos actualizados
//       if (updatedProyectos.data && Array.isArray(updatedProyectos.data.actor)) {
//         setProyectos(updatedProyectos.data.actor);
//       } else {
//         console.error('Formato inesperado de datos:', updatedProyectos.data);
//       }

//       form.reset();
//       setMensajeModal("Se han guardado los cambios correctamente");
//       setMostrarModal(true);
//     } catch (error) {
//       console.error('Error al registrar el proyecto:', error);
//     }
//   };

//   const handleClickProyecto = (idproyecto) => {
//     console.log("Proyecto seleccionado ID:", idproyecto);  // Depuración del ID de proyecto
//     router.push(`/componentes/registrarequipo?id=${idproyecto}`);
//   };

//   return (
//     <div className="container">
//       <Menu />
//       <a href='/componentes/editarperfil'><HeaderName name={userName} /></a>
//       <main className="crearproyectos-container">
//         <h2>Editar Proyecto</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="codigo">Código</label>
//             <input
//               type="text"
//               id="codigo"
//               name="codigo"
//               placeholder="Ingrese el código del proyecto"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="nombre">Nombre</label>
//             <input
//               type="text"
//               id="nombre"
//               name="nombre"
//               placeholder="Ingrese el nombre del proyecto"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="archivo1">Arrastre y suelte la invitación</label>
//             <input
//               type="file"
//               id="archivo1"
//               name="archivo1"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="archivo2">Arrastre y suelte el pliego de especificaciones</label>
//             <input
//               type="file"
//               id="archivo2"
//               name="archivo2"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="archivo2">Arrastre y suelte la lista de inscritos</label>
//             <input
//               type="file"
//               id="archivo3"
//               name="archivo3"
//               required
//             />
//           </div>
//           <div className="fechas-group">
//             <div className="fecha-item">
//               <label htmlFor="fechaProyecto">Modificar fecha de duración del proyecto</label>
//               <div className="fecha-inputs">
//                 <input type="date" id="fechaIniProyecto" name="fechaIniProyecto" placeholder="Fecha Inicio" />
//                 <input type="date" id="fechaFinProyecto" name="fechaFinProyecto" placeholder="Fecha Fin" />
//               </div>
//             </div>

//             <div className="fecha-item">
//               <label htmlFor="fechaInscripciones">Modificar duración de inscripciones</label>
//               <div className="fecha-inputs">
//                 <input type="date" id="fechaIniInscripciones" name="fechaIniInscripciones" placeholder="Fecha Inicio" />
//                 <input type="date" id="fechaFinInscripciones" name="fechaFinInscripciones" placeholder="Fecha Fin" />
//               </div>
//             </div>
//           </div>

//           <button type="submit">Guardar cambios</button>
//           <button type="button" onClick={handleCancel} style={{ marginTop: "10px" }}>
//             Cancelar
//           </button>
//         </form>
//       </main>
//       <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal} />
//     </div>
//   );
// }