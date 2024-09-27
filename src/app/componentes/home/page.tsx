"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import HeaderName from '../modals/usuario/nombre.jsx';
import "./home.css";
import { getAllRegisterProyect, createRegisterProyect } from '../../../../api/register.api';
import withAuth from '../../../hoc/withAuth';
function PruevaPage() {
  const router = useRouter();
  const [showCrearProyecto, setShowCrearProyecto] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [userName, setUserName] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('docente');
  const [role, setRole] = useState('');

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
      setRole(userData.role);
    }
  }, []);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await getAllRegisterProyect();
        console.log("Respuesta del backend:", response.data);

        if (response.data && Array.isArray(response.data.proyecto)) {
          setProyectos(response.data.proyecto);
        } else {
          console.error('Formato inesperado de datos:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener proyectos:', error);
      }
    };

    fetchProyectos();
  }, []);

  const handleAgregarProyecto = () => {
    setShowCrearProyecto(true);
  };

  const handleCancel = () => {
    setShowCrearProyecto(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData();
    formData.append('nombreproyecto', form.nombre.value);
    formData.append('codigo', form.codigo.value);
    formData.append('invitacionproyecto', form.archivo1.files[0]);
    formData.append('pliegoproyecto', form.archivo2.files[0]);
    formData.append('listaInscrito', form.archivo3.files[0]);
    formData.append('fechainicioproyecto', form.fechaIniProyecto.value);
    formData.append('fechafinproyecto', form.fechaFinProyecto.value);
    formData.append('fechainicioinscripcion', form.fechaIniInscripciones.value);
    formData.append('fechafininscripcion', form.fechaFinInscripciones.value);

    try {
      const response = await createRegisterProyect(formData);
      if (response.data) {
        console.log("Proyecto creado:", response.data);
        const updatedProyectos = await getAllRegisterProyect();
        if (updatedProyectos.data && Array.isArray(updatedProyectos.data.actor)) {
          setProyectos(updatedProyectos.data.actor);
        } else {
          console.error('Formato inesperado de datos:', updatedProyectos.data);
        }
      }
      form.reset();
      setShowCrearProyecto(false);
      setMensajeModal("Se ha creado el proyecto correctamente");
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al registrar el proyecto:', error);
    }
  };

  const handleClickProyecto = (idproyecto: string) => {
    router.push(`/componentes/registrarequipo?id=${idproyecto}`);
  };

  return (
    <div className="container">
      <Menu />
      <a href='/componentes/editarperfil'><HeaderName name={userName} /></a>

      {role === 'docente' && showCrearProyecto ? (
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
            <div className="form-group">
              <label htmlFor="archivo3">Arrastre y suelte la lista de inscritos</label>
              <input
                type="file"
                id="archivo3"
                name="archivo3"
                required
              />
            </div>
            <div className="fechas-group">
              <div className="fecha-item">
                <label htmlFor="fechaProyecto">Fecha de duración del proyecto</label>
                <div className="fecha-inputs">
                  <input type="date" id="fechaIniProyecto" name="fechaIniProyecto" placeholder="Fecha Inicio" />
                  <input type="date" id="fechaFinProyecto" name="fechaFinProyecto" placeholder="Fecha Fin" />
                </div>
              </div>
              <div className="fecha-item">
                <label htmlFor="fechaInscripciones">Duración de inscripciones</label>
                <div className="fecha-inputs">
                  <input type="date" id="fechaIniInscripciones" name="fechaIniInscripciones" placeholder="Fecha Inicio" />
                  <input type="date" id="fechaFinInscripciones" name="fechaFinInscripciones" placeholder="Fecha Fin" />
                </div>
              </div>
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
              proyectos.map((proyecto: any) => (
                <div key={proyecto.idproyecto} className="proyecto-item">
                  <Image
                    src={`/iconos/folder.svg`}
                    alt={`Folder`}
                    width={40}
                    height={48}
                  />
                  <div
                    className='proyecto-item-info'
                    onClick={() => handleClickProyecto(proyecto.idproyecto)}
                  >
                    <h2>{proyecto.nombreproyecto}</h2>
                    <p>ID: {proyecto.codigo}</p>
                  </div>
                  {/* Mostrar el enlace de editar proyecto solo si el usuario es docente */}
                  {role === 'docente' && (
                    <a href='/componentes/editarproyecto'>
                      <Image
                        src={`/iconos/editarProyecto.svg`}
                        alt={`Menu`}
                        width={40}
                        height={48}
                      />
                    </a>
                  )}
                  {/* Si es estudiante, no mostrar nada aquí */}
                </div>
              ))
            ) : (
              <p>No hay proyectos disponibles.</p>
            )}
          </div>
          <div className="boton-fijo">
            {role === 'estudiante' ? (
              <p>Los estudiantes no pueden crear proyectos</p>
            ) : (
              <button onClick={handleAgregarProyecto}><b>Agregar proyecto</b></button>
            )}
          </div>
        </main>
      )}
      <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal} />
    </div>
  );

}

export default withAuth(PruevaPage); 