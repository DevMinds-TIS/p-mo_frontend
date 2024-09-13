"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import HeaderName from '../modals/usuario/nombre.jsx';
import "./home.css";

export default function PruevaPage() {
  //mensaje
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };
  //pagina home
  const [showCrearProyecto, setShowCrearProyecto] = useState(false); 
  const [proyectos, setProyectos] = useState([
    { nombre: "Proyecto 1", id: "a1" },
    { nombre: "Proyecto 2", id: "a2" },
    { nombre: "Proyecto 3", id: "a3" },
    { nombre: "Proyecto 4", id: "a4" },
    { nombre: "Proyecto 5", id: "a5" },
    { nombre: "Proyecto 6", id: "a6" }
  ]);

  const handleAgregarProyecto = () => {
    setShowCrearProyecto(true); 
  };

  const handleCancel = () => {
    setShowCrearProyecto(false); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const nuevoProyecto = {
      nombre: form.nombre.value,
      id: form.codigo.value
    };

    setProyectos([...proyectos, nuevoProyecto]);

    form.reset();
    setShowCrearProyecto(false);
    console.log("Proyecto creado:", nuevoProyecto);
    //mensaje
    setMensajeModal("Se a creado el proeyecto correctamente");
    setMostrarModal(true);
  };

  return (
    <div className="container">
      <Menu/>
      <a href='/componentes/editarperfil'><HeaderName name="Nombre de usuario" /></a>
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
            {/* Botón de cancelar */}
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
            {proyectos.map((proyecto) => (
              <div key={proyecto.id} className="proyecto-item">
                <Image
                  src={`/iconos/folder.svg`}
                  alt={`Folder`}
                  width={40}
                  height={48}
                />
                <div className='proyecto-item-info'>
                  <a href='/componentes/registrarequipo'>
                    <h2>{proyecto.nombre}</h2>
                    <p>ID: {proyecto.id}</p>
                  </a>
                </div>
                <Image
                  src={`/iconos/puntos.svg`}
                  alt={`Menu`}
                  width={40}
                  height={48}
                />
              </div>
            ))}
          </div>
          <div className="boton-fijo">
            <button onClick={handleAgregarProyecto}><b>Agregar proyecto</b></button>
          </div>
        </main>
      )}
      <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal}/>
    </div>
  );
}
