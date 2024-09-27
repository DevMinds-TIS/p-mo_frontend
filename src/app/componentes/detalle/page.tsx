"use client";
import React, { useState, useEffect } from "react";
import Menu from "../modals/menu/menu.jsx";
import ModalMensaje from "../modals/mensajes/mensaje.jsx";
import HeaderName from "../modals/usuario/nombre.jsx";
import Semanal from "./semanal/semanal.jsx";
import Planilla from "./planilla/planilla.jsx";
import "./detalle.css";

export default function PruevaPage() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");
  const [userName, setUserName] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState('docent');

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  useEffect(() => {
    const userDataString = window.sessionStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
    }
  }, []);

  // Manejar el objetivo
  const handleObjetivoChange = (e) => {
    setObjetivo(e.target.value);
  };

  const handleGuardarObjetivo = () => {
    if (objetivo.trim() !== "") {
      console.log("Objetivo:", objetivo);
      setMensajeModal("Objetivo guardado correctamente.");
      setMostrarModal(true);
    } else {
      setMensajeModal("El objetivo no puede estar vacío.");
      setMostrarModal(true);
    }
  };

  return (
    <div className="container">
      <Menu />
      <a href="/componentes/editarperfil">
        <HeaderName name={userName} />
      </a>
      <main className="detalle-container">
        {/* Sección Objetivo */}
        <div className="objetivo-container">
          <div className="objetivo-titulo">
            <h2>Objetivo</h2>
            {tipoUsuario !== 'docente' && (
              <button onClick={handleGuardarObjetivo}>+</button>
            )}
          </div>
          <div className="objetivo">
            <textarea
              placeholder="Escriba el objetivo aquí..."
              value={objetivo}
              onChange={handleObjetivoChange}
            ></textarea>
          </div>
        </div>

        {/* Sección Planilla */}
        <div className="planilla-container">
          <Planilla></Planilla>
        </div>

        {/* Sección semanal */}
        <div className="semanal-container">
            <Semanal></Semanal>
        </div>
      </main>
      <ModalMensaje
        mensaje={mensajeModal}
        mostrar={mostrarModal}
        onClose={handleCerrarModal}
      />
    </div>
  );
}
