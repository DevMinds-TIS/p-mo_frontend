"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import "./registrarequipo.css";
import { getAllRegisterEquipo, createRegisterEquipo } from '../../../../api/register.api';

export default function PruevaPage() {
  const searchParams = useSearchParams();
  const [proyectoId, setProyectoId] = useState(null);

  const [showCrearEquipo, setShowCrearEquipo] = useState(false);
  const [equipos, setEquipos] = useState([]); // Inicializa como array vacío
  const [miembros, setMiembros] = useState([{ email: "", rol: "miembro" }]);
  const [userName, setUserName] = useState('');

  //mensaje
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  useEffect(() => {
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
    }
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setProyectoId(id);
    }
  }, [searchParams]);

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
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    console.log('Formulario enviado'); // Verificar si la función se ejecuta

    const form = event.target;

    const formData = new FormData();
    formData.append('Nombredelequipo', form.nombreEquipo.value);
    formData.append('nombre_equipo_largo', form.descripcionEquipo.value);

    if (form.imagen.files.length > 0) {
      console.log('Imagen seleccionada:', form.imagen.files[0]);
      formData.append('fotodelogoEquipo', form.imagen.files[0]); // Añadir archivo al FormData
    } else {
      console.log('No se seleccionó ninguna imagen');
      formData.append('fotodelogoEquipo', null);
    }

    try {
      const response = await fetch('http://localhost:8000/api/equipo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (response.ok) {
        console.log("Equipo creado correctamente");
        // Refrescar la lista de equipos
        const updatedEquipos = await getAllRegisterEquipo();
        setEquipos(updatedEquipos.data.equipos);
      } else {
        console.error('Error en la respuesta del servidor:', data);
      }
      form.reset();
      setShowCrearEquipo(false);
      //mensaje
      setMensajeModal("Se ha registrado el equipo correctamente");
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al registrar el equipo:', error);
    }
  };


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
      {showCrearEquipo ? (
        <main className="registrarequipos-container">
          <h2>Registrar Equipo</h2>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form">
              <div className="datos">
                {/* Espacio para introducir una imagen */}
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
                {/* Inputs para nombres */}
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
                    {/* Botón para eliminar miembro */}
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
                {/* Botón para agregar nuevo miembro */}
                {miembros.length < 6 && (
                  <button type="button" onClick={handleAgregarMiembro} style={{ marginTop: "10px" }}>
                    Agregar Miembro
                  </button>
                )}
              </div>
            </div>
            <button type="submit">Registrar</button>
          </form>
          {/* Botón de cancelar */}
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
            <button onClick={handleRegistrarEquipo}>
              <b>Registrar Equipo</b>
            </button>
          </div>
        </main>
      )}
      <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal} />
    </div>
  );
}