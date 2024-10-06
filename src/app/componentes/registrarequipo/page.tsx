"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import HeaderName from '../modals/usuario/nombre.jsx';
import "./registrarequipo.css";
import { getAllRegisterEquipo, createRegisterEquipo, getProyectID } from '../../../../api/register.api';

export default function PruevaPage() {
  const searchParams = useSearchParams();
  const [proyectoId, setProyectoId] = useState(null);

  const [showCrearEquipo, setShowCrearEquipo] = useState(false);
  const [equipos, setEquipos] = useState([]); // Inicializa como array vacío
  const [miembros, setMiembros] = useState([{ email: "", rol: "miembro" }]);
  const [userName, setUserName] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('docente');
  const [role, setRole] = useState('');
  //mensaje
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [registroDisponible, setRegistroDisponible] = useState(false);
  const [proyecto, setProyecto] = useState(null);

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  useEffect(() => {
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
      setRole(userData.role);
    }
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setProyectoId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        if (proyectoId) {
          const response = await getProyectID(proyectoId);
          console.log("datos de proyecto", response.data);
          setProyecto(response.data.proyecto);
          const fechaFinInscripcion = new Date(response.data.proyecto.fechafininscripcion + "T23:59:59");
          const fechaActual = new Date();

          console.log("fechaactual", fechaActual);
          console.log("fechafininscripcion", fechaFinInscripcion);
          if (fechaActual <= fechaFinInscripcion) {
            setRegistroDisponible(true);
          } else {
            setRegistroDisponible(false);
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del proyecto:', error);
      }
    };

    fetchProyecto();
  }, [proyectoId]);



  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await getAllRegisterEquipo();
        console.log('Datos de equipos:', response.data);
        if (response.data && Array.isArray(response.data.equipos)) {
          const equiposFiltrados = response.data.equipos.filter(
            equipo => equipo.idproyecto?.toString() === proyectoId
          );
          setEquipos(equiposFiltrados);
          console.log('Datos filtrados:', equiposFiltrados);
        } else {
          console.error('Formato inesperado de datos:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener equipos:', error);
      }
    };
    if (proyectoId) {
      fetchEquipos();
    }
  }, [proyectoId]);


  const handleRegistrarEquipo = () => {
    setShowCrearEquipo(true);
  };

  const handleCancel = () => {
    setShowCrearEquipo(false);
  };

  const handleMiembroChange = (index, field, value) => {
    const nuevosMiembros = [...miembros];
    nuevosMiembros[index][field] = value;
    setMiembros(nuevosMiembros);
  };

  const handleAgregarMiembro = () => {
    if (miembros.length < 6) {
      setMiembros([...miembros, { email: "", rol: "miembro" }]);
    }
  };

  const handleEliminarMiembro = (index) => {
    const nuevosMiembros = [...miembros];
    nuevosMiembros.splice(index, 1);
    setMiembros(nuevosMiembros);
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Formulario enviado');

    const form = event.target;
    const formData = new FormData();

    // Agregar datos del formulario a FormData
    formData.append('Nombredelequipo', form.nombreEquipo.value);
    formData.append('nombre_equipo_largo', form.descripcionEquipo.value);
    formData.append('idproyecto', parseInt(proyectoId)); // Asegúrate de que esto sea un número
    formData.append('correoequipo', 'equipo@innovacion.com');

    // Verificar si se seleccionó una imagen
    if (form.imagen.files.length > 0) {
      console.log('Imagen seleccionada:', form.imagen.files[0]);
      formData.append('fotodelogoEquipo', form.imagen.files[0]); // Agregar archivo
    } else {
      console.log('No se seleccionó ninguna imagen');
      formData.append('fotodelogoEquipo', null); // Puedes dejarlo vacío si no hay imagen
    }

    try {
      // Obtener IDs de actores del backend
      const response = await fetch('http://localhost:8000/api/summary');
      const actoresData = await response.json();

      // Crear un mapeo de correos a IDs
      const actoresMap = {};
      actoresData.forEach(actor => {
        actoresMap[actor.correoactor] = actor.id;
      });

      // Mapear los miembros con los datos de `actoresMap`
      const miembrosData = miembros.map((miembro) => {
        const id = actoresMap[miembro.email];
        if (id) {
          return { id, rol: miembro.rol }; // Incluir `id` y `rol` en el formato correcto
        } else {
          console.warn(`Email no encontrado: ${miembro.email}`);
          return null;
        }
      }).filter(Boolean); // Filtrar valores nulos

      // Agregar `actores` al FormData como una cadena JSON
      formData.append('actores', JSON.stringify(miembrosData));

      // Mostrar en consola los datos que se enviarán
      console.log('Datos enviados al backend como FormData:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, value.name); // Mostrar solo el nombre del archivo
        } else {
          console.log(key, value);
        }
      }

      // Llamar a la función `createRegisterEquipo` con el FormData
      const postResponse = await createRegisterEquipo(formData);

      // Manejar la respuesta del servidor
      const postData = postResponse.data;
      console.log('Respuesta del servidor:', postData);

      if (postResponse.status === 200) {
        console.log("Equipo creado correctamente");
        const updatedEquipos = await getAllRegisterEquipo();
        setEquipos(updatedEquipos.data.equipos);
        setMensajeModal("Se ha registrado el equipo correctamente");
        setMostrarModal(true);
      } else {
        console.error('Error en la respuesta del servidor:', postData);
        setMensajeModal(postData.message || 'Error al registrar el equipo');
        setMostrarModal(true);
      }

      // Resetear el formulario y cerrar el modal
      form.reset();
      setShowCrearEquipo(false);
    } catch (error) {
      console.error('Error al registrar el equipo:', error);
      setMensajeModal('Error al registrar el equipo. Inténtalo de nuevo.');
      setMostrarModal(true);
    }
  };




  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log('Formulario enviado');

  //   const form = event.target;

  //   // Crear el objeto JSON en lugar de FormData
  //   const jsonData = {
  //     Nombredelequipo: form.nombreEquipo.value,
  //     nombre_equipo_largo: form.descripcionEquipo.value,
  //     idproyecto: parseInt(proyectoId), // Asegurarse de enviar idproyecto como número
  //     correoequipo: 'equipo@innovacion.com',
  //     fotodelogoEquipo: null, // O el nombre de la imagen si es necesario
  //   };

  //   try {
  //     // Obtener IDs de actores del backend
  //     const response = await fetch('http://localhost:8000/api/summary');
  //     const actoresData = await response.json();

  //     // Crear un mapeo de correos a IDs
  //     const actoresMap = {};
  //     actoresData.forEach(actor => {
  //       actoresMap[actor.correoactor] = actor.id;
  //     });

  //     // Mapear los miembros con los datos de `actoresMap`
  //     const miembrosData = miembros.map((miembro) => {
  //       const id = actoresMap[miembro.email];
  //       if (id) {
  //         return { id, rol: miembro.rol }; // Incluir `id` y `rol` en el formato correcto
  //       } else {
  //         console.warn(`Email no encontrado: ${miembro.email}`);
  //         return null;
  //       }
  //     }).filter(Boolean); // Filtrar valores nulos

  //     // Agregar `miembrosData` al JSON
  //     jsonData.actores = miembrosData;

  //     // Mostrar el JSON final en consola antes de enviarlo
  //     console.log('Datos que se enviarán al backend como JSON:', JSON.stringify(jsonData, null, 2));

  //     // Enviar el JSON como objeto directamente
  //     const postResponse = await createRegisterEquipo(jsonData);

  //     // Manejar la respuesta del servidor
  //     const postData = postResponse.data;
  //     console.log('Respuesta del servidor:', postData);

  //     if (postResponse.status === 200) {
  //       console.log("Equipo creado correctamente");
  //       const updatedEquipos = await getAllRegisterEquipo();
  //       setEquipos(updatedEquipos.data.equipos);
  //       setMensajeModal("Se ha registrado el equipo correctamente");
  //       setMostrarModal(true);
  //     } else {
  //       console.error('Error en la respuesta del servidor:', postData);
  //       setMensajeModal(postData.message || 'Error al registrar el equipo');
  //       setMostrarModal(true);
  //     }

  //     // Resetear el formulario y cerrar el modal
  //     form.reset();
  //     setShowCrearEquipo(false);
  //   } catch (error) {
  //     console.error('Error al registrar el equipo:', error);
  //     setMensajeModal('Error al registrar el equipo. Inténtalo de nuevo.');
  //     setMostrarModal(true);
  //   }
  // };




  const [imagenUrl, setImagenUrl] = useState('');
  const [imagenError, setImagenError] = useState('');

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];

    if (file && allowedExtensions.includes(file.type)) {
      setImagenUrl(URL.createObjectURL(file));
      setImagenError('');
    } else {
      setImagenUrl('');
      setImagenError('Solo se permiten imágenes en formato PNG, JPG o JPEG.');
    }
  };

  return (
    <div className="container">
      <Menu />
      <a href='/componentes/editarperfil'><HeaderName name={userName} /></a>
      {showCrearEquipo ? (
        <main className="registrarequipos-container">
          <h2>Registrar Equipo</h2>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form">
              <div className="datos">
                <label htmlFor="imagen"><b>Subir Logo:</b></label>
                <div className="logo-empresa">
                  <label
                    htmlFor="imagen"
                    className="label-imagen"
                    style={{
                      backgroundImage: imagenUrl ? `url(${imagenUrl})` : `url('/iconos/camera.svg')`,
                      backgroundSize: imagenUrl ? `cover` : `auto`,
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    accept="image/*"
                    onChange={handleImagenChange}
                  />
                </div>
                <input
                  type="text"
                  id="nombreEquipo"
                  name="nombreEquipo"
                  placeholder="Nombre del equipo"
                />
                <input
                  type="text"
                  id="descripcionEquipo"
                  name="descripcionEquipo"
                  placeholder="Nombre largo del equipo"
                />
              </div>
              <div className="miembros">
                <h3>Miembros del Equipo</h3>
                {miembros.map((miembro, index) => (
                  <div key={index} className="miembro-item">
                    <input
                      type="email"
                      id={`email-${index}`}
                      name={`email-${index}`}
                      placeholder="Correo del miembro"
                      value={miembro.email}
                      onChange={(e) => handleMiembroChange(index, 'email', e.target.value)}
                    />
                    <select
                      id={`rol-${index}`}
                      name={`rol-${index}`}
                      value={miembro.rol}
                      onChange={(e) => handleMiembroChange(index, 'rol', e.target.value)}
                    >
                      <option value="miembro">Miembro</option>
                      <option value="productOwner">Product Owner</option>
                      <option value="scrumMaster">Scrum Master</option>
                    </select>
                    {miembros.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleEliminarMiembro(index)}
                        style={{ backgroundColor: "red", color: "white" }}
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}
                {miembros.length < 6 && (
                  <button type="button" onClick={handleAgregarMiembro} style={{ marginTop: "10px" }}>
                    Agregar Miembro
                  </button>
                )}
              </div>
            </div>
            <button type="submit">Registrar</button>
          </form>
          <button type="button" onClick={handleCancel} style={{ marginTop: "10px" }}>
            Cancelar
          </button>
        </main>
      ) : (
        <main className="content">
          <div className="titulo-equipos">
            <h1>Equipos</h1>
          </div>
          <div className="equipos-container">
            {equipos.length > 0 ? (
              equipos.map((equipo) => (
                <div key={equipo.idequipo} className="equipo-item">
                  <Image
                    src={`/iconos/folder.svg`}
                    alt="Folder"
                    width={40}
                    height={48}
                  />
                  <div className="equipo-item-info">
                    <a href={`/componentes/registrarequipo/${equipo.idequipo}`}>
                      <h2>{equipo.Nombredelequipo}</h2>
                      <p>ID: {equipo.idequipo}</p>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay equipo registrado.</p>
            )}
          </div>
          <div className="boton-fijo">
            {registroDisponible ? (
              role === "estudiante" ? (
                <button onClick={handleRegistrarEquipo}>
                  <b>Registrar Equipo</b>
                </button>
              ) : (
                <p>El rol de docente no puede crear equipos</p>
              )
            ) : (
              <p>Fecha de inscripción de equipos finalizada</p>
            )}
          </div>
        </main>
      )}
      <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal} />
    </div>
  );
}