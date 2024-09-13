"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./editarperfil.css";
import Menu from '../modals/menu/menu.jsx';
import { updatePartialRegister } from '../../../../api/register.api';

export default function PruevaPage() {
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [editarDatos, setEditarDatos] = useState(false);
  const [inscribirGrupo, setInscribirGrupo] = useState(false);
  const [role, setRole] = useState('');
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Estado para los datos personales
  const [nombre, setNombre] = useState(" "); // Estado para el nombre (inicialmente Nombre 1)
  const [apellido, setApellido] = useState(" ");
  // Estado para el apellido (inicialmente Apellido 1)
  const [grupo, setGrupo] = useState("Grupo 1"); // Estado para el grupo (inicialmente Grupo 1)
  const [docente, setDocente] = useState("Docente 1"); // Estado para el nombre del docente

  const [userName, setUserName] = useState('');
  const [id, setid] = useState('');
  // Obtener los datos del usuario de sessionStorage cuando el componente se monta
  useEffect(() => {
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
      setNombre(userData.nombre);
      setApellido(userData.apellido);
      setid(userData.id);
    }
  }, []);

  // Definir la relación entre grupos y docentes
  const gruposYDocentes = {
    G1: "Docente 1",
    G2: "Docente 2",
    G3: "Docente 3",
    G4: "Docente 4"
  };

  // Modal cambiar contraseña
  const handleShowModal = () => {
    setShowModal(true); // Mostrar el modal
  };
  const handleCloseModal = () => {
    setShowModal(false); // Ocultar el modal
  };
  const handleAccept = () => {
    console.log("Contraseña cambiada");
    setShowModal(false); // Cerrar el modal después de aceptar
  };

  // Modal cambiar datos personales
  const handleDatos = () => {
    setEditarDatos(true); // Mostrar el modal
  };
  const handleCloseDatos = () => {
    setEditarDatos(false); // Ocultar el modal
  };

  const handleAceptarDatos = async (nuevoNombre, nuevoApellido) => {
    setNombre(nuevoNombre); // Actualizar el nombre
    setApellido(nuevoApellido); // Actualizar el apellido
    const datosActualizados = {};

    if (nuevoNombre) {
      datosActualizados.nombreactor = nuevoNombre;
    }
    if (nuevoApellido) {
      datosActualizados.apellidoactor = nuevoApellido;
    }

    // Enviar los datos a la API
    try {
      await updatePartialRegister(id, datosActualizados);
      console.log("Datos personales cambiados");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }

    setEditarDatos(false); // Cerrar el modal después de aceptar

    console.log("Datos personales cambiados");
    setEditarDatos(false); // Cerrar el modal después de aceptar
  };

  // Modal inscribirse a un grupo
  const handleGrupo = () => {
    setInscribirGrupo(true); // Mostrar el modal
  };
  const handleCloseGrupo = () => {
    setInscribirGrupo(false); // Ocultar el modal
  };
  const handleAceptarGrupo = () => {
    setGrupo(role); // Actualizar el grupo seleccionado
    setDocente(gruposYDocentes[role]); // Actualizar el docente correspondiente al grupo
    console.log("Grupo cambiado");
    setInscribirGrupo(false); // Cerrar el modal después de aceptar
  };

  // Función para manejar la selección del grupo y actualizar el docente automáticamente
  const handleRoleChange = (e) => {
    const selectedGroup = e.target.value;
    setRole(selectedGroup); // Actualizar el grupo seleccionado
    setDocente(gruposYDocentes[selectedGroup] || ""); // Actualizar el nombre del docente basado en el grupo
  };

  const handleClick = () => {
    if (isMounted) {
      router.push('/componentes/home');
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  return (
    <div className='container'>
      <Menu />
      <main className='editardatos-container'>
        <h2>Editar datos de usuario</h2>
        <form className="form-container">
          <div className='parte1'>
          <label htmlFor="imagen"><b>Imagen de perfil</b></label>
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
            <input type="text" id="nombre" name="nombre" value={nombre} readOnly /> {/* Campo de solo lectura para el nombre */}
            <input type="text" id="apellido" name="apellido" value={apellido} readOnly /> {/* Campo de solo lectura para el apellido */}
            <input type="text" id="grupo" name="grupo" value={grupo} readOnly /> {/* Campo de solo lectura para el grupo */}
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
            <form>
              <div className="modal-item">
                <input type="password" id="current-password" name="current-password" placeholder="Contraseña actual" />
              </div>
              <div className="modal-item">
                <input type="password" id="new-password" name="new-password" placeholder="Nueva contraseña" />
              </div>
              <div className="modal-item">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>Cancelar</button>
                <button type="button" className="accept-button" onClick={handleAccept}>Aceptar</button>
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
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAceptarDatos(e.target.nombre.value, e.target.apellido.value);
            }}>
              <div className="modal-item">
                <input type="text" id="nombre" name="nombre" defaultValue={nombre} placeholder="Nuevo Nombre" />
              </div>
              <div className="modal-item">
                <input type="text" id="apellido" name="apellido" defaultValue={apellido} placeholder="Nuevo Apellido" />
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
                  value={docente} // Asignar el nombre del docente en función del grupo seleccionado
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
