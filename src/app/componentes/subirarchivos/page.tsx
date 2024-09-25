"use client";
import React, { useState, useEffect } from 'react';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import HeaderName from '../modals/usuario/nombre.jsx';
import "./subirarchivos.css";

export default function PruevaPage() {
  const [archivos, setArchivos] = useState([]); // Estado para manejar los archivos subidos
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [userName, setUserName] = useState('');

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  // Recupera la hora y fecha de subida del archivo
  function asignarFecha() {
    const fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() - 4);
    const fechaEntrega = document.getElementById('fechaEntrega');
    const formatoFecha = fechaActual.toISOString().slice(0, 16);

    if (fechaEntrega.value === '') {
      fechaEntrega.value = formatoFecha;
      fechaEntrega.readOnly = true;
      document.getElementById('botonAsignarFecha').disabled = true;
    }
    setMensajeModal("Se han subido los archivos correctamente");
    setMostrarModal(true);
  }

  function agregarComentario() {
    const comentarioInput = document.getElementById('comentario');
    const comentarioTexto = comentarioInput.value.trim();
    const comentariosCaja = document.getElementById('comentariosCaja');

    if (comentarioTexto) {
      const comentarioParrafo = document.createElement('p');
      comentarioParrafo.textContent = comentarioTexto;
      comentariosCaja.appendChild(comentarioParrafo);
      comentarioInput.value = ''; // Limpiar el campo de comentario
    }
  }

  // Maneja la subida de archivos y los añade a la lista
  function manejarSubidaArchivo(event) {
    event.preventDefault();
    const archivoInput = document.getElementById('archivo');
    const archivosSeleccionados = Array.from(archivoInput.files);

    if (archivosSeleccionados.length > 0) {
      setArchivos([...archivos, ...archivosSeleccionados]); // Agrega los nuevos archivos al estado
      archivoInput.value = ''; // Limpia el campo de entrada de archivo
    }
  }

  // Función para eliminar un archivo de la lista
  function eliminarArchivo(index) {
    setArchivos(archivos.filter((_, i) => i !== index)); // Elimina el archivo del estado
  }

  useEffect(() => {
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
    }
  }, []);

  return (
    <div className="container">
      <Menu />
      <a href='/componentes/editarperfil'><HeaderName name={userName} /></a>
      <main className="subirarchivos-container">
        <h2>Sprint 1</h2>
        <form className="formulario-subida" onSubmit={manejarSubidaArchivo}>
          <div className="lado-izquierdo">
            <label><b>Tutor: Docente 1</b></label>
            <label><b>Puntaje: 100</b></label>
            <div className="form-group">
              <label htmlFor="nombre"><b>Información y contexto:</b></label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Añade una descripción"
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="archivo"><b>Seleccione su archivo a subir:</b></label>
              <label
                htmlFor="archivo"
                className="label-archivo"
                style={{
                  backgroundImage:`url('/iconos/subirarchivo.svg')`,
                  backgroundSize:`auto`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              ></label>
              <input
                type="file"
                id="archivo"
                name="archivo"
                className="input-file"
                style={{ display: 'none' }} // Oculta el input real para que solo la imagen se use para subir
                onChange={manejarSubidaArchivo}
              />
            </div>
          </div>
          <div className="lado-derecho">
            <label><b>Fecha de entrega:</b></label>
            <div className='fecha-entrega'>
              <input type="datetime-local" id="fechaEntrega" name="fechaEntrega" readOnly />
            </div>
            <div className="archivos-seccion">
              <h3>Archivos Subidos:</h3>
              <ul>
                {archivos.map((archivo, index) => (
                  <li key={index} className="archivo-item">
                    {archivo.name}
                    <button
                      type="button"
                      className="boton-eliminar"
                      onClick={() => eliminarArchivo(index)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="comentarios-seccion">
              <div className='comentario-cabeza'>
                <label htmlFor="comentario"><b>Comentarios:</b></label>
                <div id="comentariosCaja" className="comentarios-caja"></div>
              </div>
              <textarea
                id="comentario"
                name="comentario"
                placeholder="Escribe tu comentario aquí..."
                rows="3"
              ></textarea>
              <button type="button" onClick={agregarComentario}>
                Enviar Comentario
              </button>
            </div>
          </div>
        </form>
        <button type="button" onClick={asignarFecha} id="botonAsignarFecha">
          Entregar
        </button>
      </main>
      <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal} />
    </div>
  );
}

