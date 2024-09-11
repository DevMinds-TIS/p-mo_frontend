// "use client";
// import Image from 'next/image';
// import React, { useState, useEffect } from "react";
// import "./home.css";
// import { getAllRegisterProyect, createRegisterProyect } from '../../../../api/register.api';

// export default function PruevaPage() {


//   const [selected, setSelected] = useState(null);
//   const [showCrearProyecto, setShowCrearProyecto] = useState(false);
//   //const getproyect = await getAllRegisterProyect();
//   const [proyectos, setProyectos] = useState([]);

//   useEffect(() => {
//     // Función para obtener proyectos
//     const fetchProyectos = async () => {
//       try {
//         const response = await getAllRegisterProyect();
//         setProyectos(response.data.proyectos); // Asumiendo que la respuesta tiene la forma { proyectos: [...] }
//       } catch (error) {
//         console.error('Error al obtener proyectos:', error);
//       }
//     };

//     fetchProyectos();
//   }, []);

//   const handleClick = (index) => {
//     setSelected(index);
//     console.log(`Botón ${index} presionado`);
//   };

//   const handleAgregarProyecto = () => {
//     setShowCrearProyecto(true);

//   };

//   const handleCancel = () => {
//     setShowCrearProyecto(false);
//   };


//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const form = event.target;

//     const formData = new FormData();
//     formData.append('nombreproyecto', form.nombre.value);
//     formData.append('codigo', form.codigo.value);
//     formData.append('invitacionproyecto', form.archivo1.files[0]);
//     formData.append('pliegoproyecto', form.archivo2.files[0]);

//     try {
//       const response = await createRegisterProyect(formData);

//       console.log('Proyecto registrado exitosamente:', response.data);

//       const nuevoProyecto = {
//         nombre: form.nombre.value,
//         id: form.codigo.value
//       };

//       setProyectos([...proyectos, nuevoProyecto]);

//       form.reset();
//       setShowCrearProyecto(false);
//       console.log("Proyecto creado:", nuevoProyecto);
//     } catch (error) {
//       console.error('Error al registrar el proyecto:', error);
//       // Puedes manejar los errores aquí, como mostrar un mensaje al usuario
//     }
//   };
//   // const handleSubmit = (event) => {
//   //   event.preventDefault();
//   //   const form = event.target;
//   //   // const nuevoProyecto = {
//   //   //   nombre: form.nombre.value,
//   //   //   id: form.codigo.value
//   //   // };


//   //   createRegisterProyect
//   //   setProyectos([...proyectos, nuevoProyecto]);

//   //   form.reset();
//   //   setShowCrearProyecto(false);
//   //   console.log("Proyecto creado:", nuevoProyecto);
//   // };

//   // return (
//   //   <div className="container">
//   //     <aside className="menu">
//   //       <div className='imagen'>
//   //         <a href='/componentes/home'>
//   //           <Image
//   //             src="/iconos/logo.png"
//   //             alt="Logo de la aplicación"
//   //             width={40}
//   //             height={50}
//   //           />
//   //         </a>
//   //       </div>
//   //       {[1, 2, 3, 4, 5].map((num, index) => (
//   //         <button
//   //           key={index}
//   //           className={`menu-button ${selected === index ? 'active' : ''}`}
//   //           onClick={() => handleClick(index)}
//   //         >
//   //           <Image
//   //             src={`/iconos/icon${num}.svg`}
//   //             alt={`Icono ${num}`}
//   //             width={40}
//   //             height={48}
//   //           />
//   //         </button>
//   //       ))}
//   //     </aside>

//   //     {showCrearProyecto ? (
//   //       <main className="crearproyectos-container">
//   //         <h2>Crear Proyecto</h2>
//   //         <form onSubmit={handleSubmit}>
//   //           <div className="form-group">
//   //             <label htmlFor="codigo">Código</label>
//   //             <input
//   //               type="text"
//   //               id="codigo"
//   //               name="codigo"
//   //               placeholder="Ingrese el código del proyecto"
//   //               required
//   //             />
//   //           </div>
//   //           <div className="form-group">
//   //             <label htmlFor="nombre">Nombre</label>
//   //             <input
//   //               type="text"
//   //               id="nombre"
//   //               name="nombre"
//   //               placeholder="Ingrese el nombre del proyecto"
//   //               required
//   //             />
//   //           </div>
//   //           <div className="form-group">
//   //             <label htmlFor="archivo1">Arrastre y suelte la invitación</label>
//   //             <input
//   //               type="file"
//   //               id="archivo1"
//   //               name="archivo1"
//   //               required
//   //             />
//   //           </div>
//   //           <div className="form-group">
//   //             <label htmlFor="archivo2">Arrastre y suelte el pliego de especificaciones</label>
//   //             <input
//   //               type="file"
//   //               id="archivo2"
//   //               name="archivo2"
//   //               required
//   //             />
//   //           </div>
//   //           <button type="submit">Crear Proyecto</button>
//   //           {/* Botón de cancelar */}
//   //           <button type="button" onClick={handleCancel} style={{ marginTop: "10px" }}>
//   //             Cancelar
//   //           </button>
//   //         </form>
//   //       </main>
//   //     ) : (
//   //       <main className="content">
//   //         <div className='titulo-home'>
//   //           <h1>Proyectos</h1>
//   //         </div>
//   //         <div className="proyectos-container">
//   //           {proyectos.map((proyecto) => (
//   //             <div key={proyecto.id} className="proyecto-item">
//   //               <Image
//   //                 src={`/iconos/folder.svg`}
//   //                 alt={`Folder`}
//   //                 width={40}
//   //                 height={48}
//   //               />
//   //               <div className='proyecto-item-info'>
//   //                 <a href='/componentes/registrarequipo'>
//   //                   <h2>{proyecto.nombre}</h2>
//   //                   <p>ID: {proyecto.id}</p>
//   //                 </a>
//   //               </div>
//   //               <Image
//   //                 src={`/iconos/puntos.svg`}
//   //                 alt={`Menu`}
//   //                 width={40}
//   //                 height={48}
//   //               />
//   //             </div>
//   //           ))}
//   //         </div>
//   //         <div className="boton-fijo">
//   //           <button onClick={handleAgregarProyecto}><b>Agregar proyecto</b></button>
//   //         </div>
//   //       </main>
//   //     )}
//   //   </div>
//   // );



//   return (
//     <div className="container">
//       <aside className="menu">
//         <div className='imagen'>
//           <a href='/componentes/home'>
//             <Image
//               src="/iconos/logo.png"
//               alt="Logo de la aplicación"
//               width={40}
//               height={50}
//             />
//           </a>
//         </div>
//         {[1, 2, 3, 4, 5].map((num, index) => (
//           <button
//             key={index}
//             className={`menu-button ${selected === index ? 'active' : ''}`}
//             onClick={() => handleClick(index)}
//           >
//             <Image
//               src={`/iconos/icon${num}.svg`}
//               alt={`Icono ${num}`}
//               width={40}
//               height={48}
//             />
//           </button>
//         ))}
//       </aside>

//       {showCrearProyecto ? (
//         <main className="crearproyectos-container">
//           <h2>Crear Proyecto</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label htmlFor="codigo">Código</label>
//               <input
//                 type="text"
//                 id="codigo"
//                 name="codigo"
//                 placeholder="Ingrese el código del proyecto"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="nombre">Nombre</label>
//               <input
//                 type="text"
//                 id="nombre"
//                 name="nombre"
//                 placeholder="Ingrese el nombre del proyecto"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="archivo1">Arrastre y suelte la invitación</label>
//               <input
//                 type="file"
//                 id="archivo1"
//                 name="archivo1"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="archivo2">Arrastre y suelte el pliego de especificaciones</label>
//               <input
//                 type="file"
//                 id="archivo2"
//                 name="archivo2"
//                 required
//               />
//             </div>
//             <button type="submit">Crear Proyecto</button>
//             <button type="button" onClick={handleCancel} style={{ marginTop: "10px" }}>
//               Cancelar
//             </button>
//           </form>
//         </main>
//       ) : (
//         <main className="content">
//           <div className='titulo-home'>
//             <h1>Proyectos</h1>
//           </div>
//           <div className="proyectos-container">
//             {proyectos.map((proyecto) => (
//               <div key={proyecto.id} className="proyecto-item">
//                 <Image
//                   src={`/iconos/folder.svg`}
//                   alt={`Folder`}
//                   width={40}
//                   height={48}
//                 />
//                 <div className='proyecto-item-info'>
//                   <a href='/componentes/registrarequipo'>
//                     <h2>{proyecto.nombre}</h2>
//                     <p>ID: {proyecto.id}</p>
//                   </a>
//                 </div>
//                 <Image
//                   src={`/iconos/puntos.svg`}
//                   alt={`Menu`}
//                   width={40}
//                   height={48}
//                 />
//               </div>
//             ))}
//           </div>
//           <div className="boton-fijo">
//             <button onClick={handleAgregarProyecto}><b>Agregar proyecto</b></button>
//           </div>
//         </main>
//       )}
//     </div>
//   );



// }


//*************************************
"use client";
//import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import "./home.css";
import { getAllRegisterProyect, createRegisterProyect } from '../../../../api/register.api';

export default function PruevaPage() {
  const [selected, setSelected] = useState(null);
  const [showCrearProyecto, setShowCrearProyecto] = useState(false);
  const [proyectos, setProyectos] = useState([]); // Inicializa como array vacío

  useEffect(() => {
    // Función para obtener proyectos
    const fetchProyectos = async () => {
      try {
        const response = await getAllRegisterProyect();
        // Verifica que la respuesta tenga la estructura esperada
        if (response.data && Array.isArray(response.data.actor)) {
          setProyectos(response.data.actor);
        } else {
          console.error('Formato inesperado de datos:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener proyectos:', error);
      }
    };

    fetchProyectos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const handleClick = (index) => {
    setSelected(index);
    console.log(`Botón ${index} presionado`);
  };

  const handleAgregarProyecto = () => {
    setShowCrearProyecto(true);
  };

  const handleCancel = () => {
    setShowCrearProyecto(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData();
    formData.append('nombreproyecto', form.nombre.value);
    formData.append('codigo', form.codigo.value);
    formData.append('invitacionproyecto', form.archivo1.files[0]);
    formData.append('pliegoproyecto', form.archivo2.files[0]);

    try {
      const response = await createRegisterProyect(formData);
      const nuevoProyecto = {
        nombre: form.nombre.value,
        id: form.codigo.value
      };

      setProyectos([...proyectos, nuevoProyecto]);

      form.reset();
      setShowCrearProyecto(false);
      console.log("Proyecto creado:", nuevoProyecto);
    } catch (error) {
      console.error('Error al registrar el proyecto:', error);
    }
  };

  return (
    <div className="container">
      <aside className="menu">
        <div className='imagen'>
          <a href='/componentes/home'>
            <Image
              src="/iconos/logo.png"
              alt="Logo de la aplicación"
              width={40}
              height={50}
            />
          </a>
        </div>
        {[1, 2, 3, 4, 5].map((num, index) => (
          <button
            key={index}
            className={`menu-button ${selected === index ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            <Image
              src={`/iconos/icon${num}.svg`}
              alt={`Icono ${num}`}
              width={40}
              height={48}
            />
          </button>
        ))}
      </aside>

      {showCrearProyecto ? (
        <main className="crearproyectos-container">
          <h2>Crear Proyecto</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="codigo">Código</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
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
                placeholder="Ingrese el nombre del proyecto"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="archivo1">Arrastre y suelte la invitación</label>
              <input
                type="file"
                id="archivo1"
                name="archivo1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="archivo2">Arrastre y suelte el pliego de especificaciones</label>
              <input
                type="file"
                id="archivo2"
                name="archivo2"
                required
              />
            </div>
            <button type="submit">Crear Proyecto</button>
            <button type="button" onClick={handleCancel} style={{ marginTop: "10px" }}>
              Cancelar
            </button>
          </form>
        </main>
      ) : (
        <main className="content">
          <div className='titulo-home'>
            <h1>Proyectos</h1>
          </div>
          <div className="proyectos-container">
            {proyectos.length > 0 ? (
              proyectos.map((proyecto) => (
                <div key={proyecto.idproyecto} className="proyecto-item">
                  <Image
                    src={`/iconos/folder.svg`}
                    alt={`Folder`}
                    width={40}
                    height={48}
                  />
                  <div className='proyecto-item-info'>
                    <a href='/componentes/registrarequipo'>
                      <h2>{proyecto.nombreproyecto}</h2>
                      <p>ID: {proyecto.codigo}</p>
                    </a>
                  </div>
                  <Image
                    src={`/iconos/puntos.svg`}
                    alt={`Menu`}
                    width={40}
                    height={48}
                  />
                </div>
              ))
            ) : (
              <p>No hay proyectos disponibles.</p>
            )}
          </div>
          <div className="boton-fijo">
            <button onClick={handleAgregarProyecto}><b>Agregar proyecto</b></button>
          </div>
        </main>
      )}
    </div>
  );
}

