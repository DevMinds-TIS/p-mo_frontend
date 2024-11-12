"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '../modals/menu/menu.jsx';
import ModalMensaje from '../modals/mensajes/mensaje.jsx';
import HeaderName from '../modals/usuario/nombre.jsx';
import DatePicker from 'react-datepicker';
import ParteAB from './parteAB/parteAB.jsx';
import "react-datepicker/dist/react-datepicker.css";
import "./calendario.css";

export default function PruevaPage() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [userName, setUserName] = useState('');
  const [fechas, setFechas] = useState([{ fechaInicio: null, fechaFin: null }]);
  const [modoEdicion, setModoEdicion] = useState(false); // Estado para manejar el modo de edición
  const [tipoUsuario, setTipoUsuario] = useState('docent'); // Tipo de usuario
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
    }
  }, []);

  const formatoFecha = (date) => {
    return date ? date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
  };

  const fechasSeSolapan = (fechaInicio, fechaFin, index) => {
    for (let i = 0; i < fechas.length; i++) {
      if (i !== index) { // Ignorar el rango actual al comparar
        const rango = fechas[i];
        if (
          (fechaInicio >= rango.fechaInicio && fechaInicio <= rango.fechaFin) ||
          (fechaFin >= rango.fechaInicio && fechaFin <= rango.fechaFin) ||
          (fechaInicio <= rango.fechaInicio && fechaFin >= rango.fechaFin)
        ) {
          return true; // Las fechas se solapan
        }
      }
    }
    return false;
  };

  const handleGenerarFechas = () => {
    setFechas([...fechas, { fechaInicio: null, fechaFin: null }]);
  };

  const handleGuardarFechas = () => {
    let valid = true;
    fechas.forEach((rango, index) => {
      if (!rango.fechaInicio || !rango.fechaFin) {
        valid = false;
        setMensajeModal(`Rango ${index + 1}: Completa o elimina la fecha faltante.`);
        setMostrarModal(true);
      }
    });

    if (valid) {
      fechas.forEach((rango, index) => {
        console.log(`Rango ${index + 1}:`);
        console.log(`Fecha de inicio: ${formatoFecha(rango.fechaInicio)}`);
        console.log(`Fecha fin: ${formatoFecha(rango.fechaFin)}`);
      });
      
      // Salir del modo de edición al guardar
      setModoEdicion(false);
    }
  };

  const handleFechaChange = (index, field, value) => {
    if (!modoEdicion) return; // Evitar cambios si no está en modo edición

    const nuevasFechas = [...fechas];
    nuevasFechas[index][field] = value;

    if (nuevasFechas[index].fechaInicio && nuevasFechas[index].fechaFin) {
      if (fechasSeSolapan(nuevasFechas[index].fechaInicio, nuevasFechas[index].fechaFin, index)) {
        // Restablecer las fechas en caso de solapamiento
        nuevasFechas[index] = { fechaInicio: null, fechaFin: null };
        setFechas(nuevasFechas);
        setMensajeModal('Las fechas se solapan con un rango existente. Por favor, selecciona otro rango.');
        setMostrarModal(true);
      } else {
        setFechas(nuevasFechas);
      }
    } else {
      setFechas(nuevasFechas);
    }
  };

  const handleEliminarRango = (index) => {
    if (fechas.length > 1) {
      const nuevasFechas = fechas.filter((_, i) => i !== index);
      setFechas(nuevasFechas);
    }
  };

  const handleDetalle = () => {
    if (isMounted) {
      router.push('/componentes/detalle');
    }
  }

  return (
    <div className="container">
      <Menu />
      <a href='/componentes/editarperfil'><HeaderName name={userName} /></a>
      <main className="calendario-container">
        <h2>Planificación del proyecto</h2>
        <div className='planificacion'>
          <ParteAB></ParteAB>
        </div>

        <h2>Calendarización</h2>
        <div className="fechas-container">
          {fechas.map((rango, index) => (
            <div className="fecha-selector" key={index}>
              <div className='label-fechas'>
                <label>Selecciona un rango de fechas para Sprint {index + 1}:</label>
              </div>
              <DatePicker
                selected={rango.fechaInicio}
                onChange={(date) => handleFechaChange(index, 'fechaInicio', date)}
                selectsStart
                startDate={rango.fechaInicio}
                endDate={rango.fechaFin}
                dateFormat="dd/MM/yyyy"
                placeholderText="Fecha de inicio"
                disabled={!modoEdicion} // Deshabilitar cuando no está en modo edición
              />
              <DatePicker
                selected={rango.fechaFin}
                onChange={(date) => handleFechaChange(index, 'fechaFin', date)}
                selectsEnd
                startDate={rango.fechaInicio}
                endDate={rango.fechaFin}
                minDate={rango.fechaInicio}
                dateFormat="dd/MM/yyyy"
                placeholderText="Fecha de fin"
                disabled={!modoEdicion} // Deshabilitar cuando no está en modo edición
              />

              {/* Mostrar el botón de eliminar solo si hay más de un rango de fechas y en modo edición */}
              <button id='detalle' onClick={() => handleDetalle()}>Detalle</button>
              {fechas.length > 1 && modoEdicion && (
                <button onClick={() => handleEliminarRango(index)}>X</button>
              )}
            </div>
          ))}
        </div>

        {/* Ocultar el botón "Editar" si el tipo de usuario es "docente" */}
        {tipoUsuario !== 'docente' && (
          !modoEdicion ? (
            <button onClick={() => setModoEdicion(true)}>Editar</button>
          ) : (
            <>
              <button onClick={handleGenerarFechas}>Generar Fechas</button>
              <button onClick={handleGuardarFechas}>Guardar</button>
            </>
          )
        )}
      </main>
      <ModalMensaje mensaje={mensajeModal} mostrar={mostrarModal} onClose={handleCerrarModal} />
    </div>
  );
}
