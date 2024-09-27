"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import HeaderName from '../modals/usuario/nombre.jsx';
import "./editarproyecto.css";

export default function PruevaPage() {
  const router = useRouter(); // Asegúrate de que useRouter esté aquí 
  const [userName, setUserName] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [idproyct, setIdproyct] = useState([]);

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
    const fetchProyectos = async () => {
      try {
        const response = await getAllRegisterProyect();
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
  }, []);

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
      setMensajeModal("Se han guardado los cambios correctamente");
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al registrar el proyecto:', error);
    }
  };

  // Define handleClickProyecto aquí
  const handleClickProyecto = (idproyecto) => {
    router.push(`/componentes/registrarequipo?id=${idproyecto}`);
  };

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
            <label htmlFor="archivo2">Arrastre y suelte la lista de inscritos</label>
            <input
              type="file"
              id="archivo3"
              name="archivo3"
              required
            />
          </div>
          <div className="fechas-group">
            <div className="fecha-item">
              <label htmlFor="fechaProyecto">Modificar fecha de duración del proyecto</label>
              <div className="fecha-inputs">
                <input type="date" id="fechaIniProyecto" name="fechaIniProyecto" placeholder="Fecha Inicio" />
                <input type="date" id="fechaFinProyecto" name="fechaFinProyecto" placeholder="Fecha Fin" />
              </div>
            </div>

            <div className="fecha-item">
              <label htmlFor="fechaInscripciones">Modificar duración de inscripciones</label>
              <div className="fecha-inputs">
                <input type="date" id="fechaIniInscripciones" name="fechaIniInscripciones" placeholder="Fecha Inicio" />
                <input type="date" id="fechaFinInscripciones" name="fechaFinInscripciones" placeholder="Fecha Fin" />
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