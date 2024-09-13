"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import "./registrarequipo.css";

export default function PruevaPage() {
  //mensaje
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  //pagina registrar
  const [showCrearEquipo, setShowCrearEquipo] = useState(false);
  const [equipos, setEquipos] = useState([
    { nombre: "Equipo 1", id: "e1" },
    { nombre: "Equipo 2", id: "e2" },
    { nombre: "Equipo 3", id: "e3" },
    { nombre: "Equipo 4", id: "e4" }
  ]);

  // Estado para imagen y errores
  const [imagenUrl, setImagenUrl] = useState('');
  const [imagenError, setImagenError] = useState(''); // Error de imagen

  // Validar y cambiar la imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];

    if (file && allowedExtensions.includes(file.type)) {
      setImagenUrl(URL.createObjectURL(file)); // Crear URL temporal
      setImagenError(''); // Limpiar error si el archivo es válido
    } else {
      setImagenUrl('');
      setImagenError('Solo se permiten imágenes en formato PNG, JPG o JPEG.');
    }
  };

  // Estado para capturar los datos del nuevo equipo
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [descripcionEquipo, setDescripcionEquipo] = useState("");
  const [miembros, setMiembros] = useState([{ email: "", rol: "miembro" }]);

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
    nuevosMiembros.splice(index, 1); // Eliminar miembro por su índice
    setMiembros(nuevosMiembros);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Crear un nuevo equipo con los datos actuales
    const nuevoEquipo = {
      nombre: nombreEquipo,
      descripcion: descripcionEquipo,
      miembros: miembros,
    };
    // Imprimir los datos en la consola
    console.log("Datos del equipo registrado:", nuevoEquipo);
    // Agregar el nuevo equipo a la lista de equipos
    setEquipos([...equipos, { nombre: nombreEquipo, id: `e${equipos.length + 1}` }]);
    //mensaje
    setMensajeModal("Se ha registrado el equipo correctamente");
    setMostrarModal(true);
    // Limpiar el formulario
    setNombreEquipo("");
    setDescripcionEquipo("");
    setMiembros([{ email: "", rol: "miembro" }]);
    setShowCrearEquipo(false);
  };

  return (
    <div className="container">
      <Menu/>
      {showCrearEquipo ? (
        <main className="registrarequipos-container">
          <h2>Registrar Equipo</h2>
          <form className="form-container" onSubmit={handleRegister}>
            <div className='form'>
              <div className="datos">
                {/* Espacio para introducir una imagen */}
                <label htmlFor="imagen"><b>Subir Logo:</b></label>
                <div className='logo-empresa'>
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
                  value={nombreEquipo}
                  onChange={(e) => setNombreEquipo(e.target.value)}
                  required
                />
                
                <input
                  type="text"
                  id="descripcionEquipo"
                  name="descripcionEquipo"
                  placeholder="Nombre largo del equipo"
                  value={descripcionEquipo}
                  onChange={(e) => setDescripcionEquipo(e.target.value)}
                  required
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
                      required
                    />

                    <select
                      id={`rol-${index}`}
                      name={`rol-${index}`}
                      value={miembro.rol}
                      onChange={(e) => handleMiembroChange(index, 'rol', e.target.value)}
                      required
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
                        style={{backgroundColor: "red", color: "white" }}
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
          <div className='titulo-equipos'>
            <h1>Equipos</h1>
          </div>
          <div className="equipos-container">
            {equipos.map((equipo) => (
              <div key={equipo.id} className="equipo-item">
                <Image
                  src={`/iconos/folder.svg`}
                  alt={`Folder`}
                  width={40}
                  height={48}
                />
                <div className='equipo-item-info'>
                  <a href='/componentes/registrarequipo'>
                    <h2>{equipo.nombre}</h2>
                    <p>ID: {equipo.id}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="boton-fijo">
            <button onClick={handleRegistrarEquipo}><b>Registrar Equipo</b></button>
          </div>
        </main>
      )}
      <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal} />
    </div>
  );
}