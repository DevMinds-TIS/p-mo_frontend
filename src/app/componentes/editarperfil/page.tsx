"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '../modals/menu/menu.jsx';
import "./editarperfil.css"; 

export default function PruevaPage() {
  const [showModal, setShowModal] = useState(false); // Modal cambiar contraseña
  const [editarDatos, setEditarDatos] = useState(false); // Modal editar datos
  const [inscribirGrupo, setInscribirGrupo] = useState(false); // Modal inscribirse a un grupo
  const [role, setRole] = useState('');
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Estado para los datos personales
  const [nombre, setNombre] = useState("Nombre 1");
  const [apellido, setApellido] = useState("Apellido 1");
  const [grupo, setGrupo] = useState("Grupo 1");
  const [docente, setDocente] = useState("Docente 1");

  // Estado para imagen y errores
  const [imagenUrl, setImagenUrl] = useState('');
  const [imagenError, setImagenError] = useState(''); // Error de imagen

  // Errores de validación
  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

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

  // Validaciones de campos
  const validateField = (value) => value.length >= 3 && value.length <= 20;

  const handleClick = () => {
    if (isMounted) {
      router.push('/componentes/home');
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Modal cambiar contraseña
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAccept = (e) => {
    e.preventDefault();
    const currentPassword = e.target.elements['current-password'].value;
    const newPassword = e.target.elements['new-password'].value;

    if (!validateField(currentPassword)) {
      setPasswordError('La contraseña debe tener entre 3 y 20 caracteres.');
    } else {
      setPasswordError('');
    }

    if (!validateField(newPassword)) {
      setNewPasswordError('La nueva contraseña debe tener entre 3 y 20 caracteres.');
    } else {
      setNewPasswordError('');
    }

    if (validateField(currentPassword) && validateField(newPassword)) {
      console.log("Contraseña cambiada");
      setShowModal(false); // Cerrar el modal si la validación es correcta
    }
  };

  // Modal editar datos personales
  const handleDatos = () => setEditarDatos(true);
  const handleCloseDatos = () => setEditarDatos(false);

  const handleAceptarDatos = (e) => {
    e.preventDefault();
    const nuevoNombre = e.target.nombre.value;
    const nuevoApellido = e.target.apellido.value;

    let valid = true;

    if (!validateField(nuevoNombre)) {
      setNombreError('El nombre debe tener entre 3 y 20 caracteres.');
      valid = false;
    } else {
      setNombreError('');
    }

    if (!validateField(nuevoApellido)) {
      setApellidoError('El apellido debe tener entre 3 y 20 caracteres.');
      valid = false;
    } else {
      setApellidoError('');
    }

    if (valid) {
      setNombre(nuevoNombre);
      setApellido(nuevoApellido);
      console.log("Datos personales cambiados");
      setEditarDatos(false); // Cerrar el modal si todo es válido
    }
  };

  // Modal inscribirse a un grupo
  const handleGrupo = () => setInscribirGrupo(true);
  const handleCloseGrupo = () => setInscribirGrupo(false);

  const handleAceptarGrupo = () => {
    setGrupo(role);
    setDocente(gruposYDocentes[role]);
    setInscribirGrupo(false);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setDocente(gruposYDocentes[e.target.value] || "");
  };

  // Definir la relación entre grupos y docentes
  const gruposYDocentes = {
    G1: "Docente 1",
    G2: "Docente 2",
    G3: "Docente 3",
    G4: "Docente 4"
  };

  return (
    <div className='container'>
      <Menu />
      <main className='editardatos-container'>
        <h2>Editar datos de usuario</h2>
        <form className="form-container">
          <div className='parte1'>
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
            {imagenError && <label className="error">{imagenError}</label>} {/* Mostrar error de imagen */}

            <input type="text" id="nombre" name="nombre" value={nombre} readOnly />
            <input type="text" id="apellido" name="apellido" value={apellido} readOnly />
            <input type="text" id="grupo" name="grupo" value={grupo} readOnly />
          </div>
          <div className='parte2'>
            <button type="button" onClick={handleShowModal}>Cambiar contraseña</button>
            <button type="button" onClick={handleDatos}>Editar datos personales</button>
            <button type="button" onClick={handleGrupo}>Incribirse a un grupo</button>
          </div>
        </form>
        <button onClick={handleClick}>Confirmar</button>
      </main>

      {/* Modal cambiar contraseña */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Cambiar Contraseña</h3>
            <form onSubmit={handleAccept}>
              <div className="modal-item">
                <input type="password" id="current-password" name="current-password" placeholder="Contraseña actual" />
                {passwordError && <label className="error">{passwordError}</label>}
              </div>
              <div className="modal-item">
                <input type="password" id="new-password" name="new-password" placeholder="Nueva contraseña" />
                {newPasswordError && <label className="error">{newPasswordError}</label>}
              </div>
              <div className="modal-item">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="accept-button">Aceptar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar datos personales */}
      {editarDatos && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Datos Personales</h3>
            <form onSubmit={handleAceptarDatos}>
              <div className="modal-item">
                <input type="text" id="nombre" name="nombre" defaultValue={nombre} placeholder="Nuevo Nombre" />
                {nombreError && <label className="error">{nombreError}</label>}
              </div>
              <div className="modal-item">
                <input type="text" id="apellido" name="apellido" defaultValue={apellido} placeholder="Nuevo Apellido" />
                {apellidoError && <label className="error">{apellidoError}</label>}
              </div>
              <div className="modal-item">
                <button type="button" className="cancel-button" onClick={handleCloseDatos}>Cancelar</button>
                <button type="submit" className="accept-button">Aceptar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal inscribirse a un grupo */}
      {inscribirGrupo && (
        <div className="modal">
          <div className="modal-content">
            <h3>Inscribirse a un Grupo</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAceptarGrupo();
            }}>
              <div className="modal-item">
                <select value={role} onChange={handleRoleChange} required>
                  <option value="">Selecciona un grupo</option>
                  <option value="G1">G1</option>
                  <option value="G2">G2</option>
                  <option value="G3">G3</option>
                  <option value="G4">G4</option>
                </select>
              </div>
              <div className="modal-item">
                <input
                  type="text"
                  id="nombre-docente"
                  name="nombre-docente"
                  value={docente}
                  readOnly
                  placeholder="Nombre Docente"
                />
              </div>
              <div className="modal-item">
                <button type="button" className="cancel-button" onClick={handleCloseGrupo}>Cancelar</button>
                <button type="submit" className="accept-button">Aceptar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
