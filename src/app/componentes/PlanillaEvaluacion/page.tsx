"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Mantener el hook de next/navigation
import Menu from '../modals/menu/menu';
import HeaderName from '../modals/usuario/nombre.jsx';
import ModalMensaje from "../modals/mensajes/mensaje.jsx";
import AutoEvaluacion from '../PlanillaEvaluacion/tipoEvaluacion/autoEvaluacion.jsx';
import EvaluacionPares from '../PlanillaEvaluacion/tipoEvaluacion/evaluacionPares.jsx';
import EvaluacionCruzada from '../PlanillaEvaluacion/tipoEvaluacion/evaluacionCruzada.jsx';
import './planillaEvaluacion.css';

export default function PruevaPage() {
  const router = useRouter(); // Usar el hook de next/navigation
  const [userName, setUserName] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");
  const [tipoEva, setTipoEva] = useState(""); // Estado para tipo de evaluación
  const [evaluaciones, setEvaluaciones] = useState({});

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  useEffect(() => {
    // Obtener los datos del usuario
    const userDataString = window.sessionStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserName(`${userData.nombre} ${userData.apellido}`);
    }
  }, []);

  // Obtener el tipo de evaluación desde la query string manualmente
  useEffect(() => {
    if (typeof window !== "undefined") { // Asegurarse de que esté en el cliente
      const params = new URLSearchParams(window.location.search);
      const tipoEvaluacion = params.get('tipoEvaluacion'); // Obtener el parámetro tipoEvaluacion de la URL
      if (tipoEvaluacion) {
        setTipoEva(tipoEvaluacion); // Guardar tipo de evaluación en el estado
      }
    }
  }, [router]);

  // Actualizar la nota seleccionada
  const handleNotaClick = (index, nota) => {
    setEvaluaciones(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        nota: nota
      }
    }));
  };

  // Actualizar la justificación
  const handleJustificacionChange = (index, justificacion) => {
    setEvaluaciones(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        justificacion: justificacion
      }
    }));
  };

  // Validar que todas las evaluaciones estén completas
  const validarEvaluacionesCompletas = () => {
    const titulos = [
      'Cumplimiento de requerimientos',
      'Calidad de código',
      'Pruebas y validaciones',
      'Gestión de proyectos',
      'Seguridad',
      'Satisfacción de usuario'
    ];

    // Comprobar que todos los campos de nota y justificación estén llenos
    for (let i = 0; i < titulos.length; i++) {
      if (!evaluaciones[i]?.nota || !evaluaciones[i]?.justificacion) {
        return false;
      }
    }
    return true;
  };

  // Guardar e imprimir en consola
  const handleGuardar = () => {
    if (!validarEvaluacionesCompletas()) {
      setMensajeModal("Llenar todos los campos de evaluación.");
      setMostrarModal(true);
    } else {
      console.log("Evaluaciones guardadas:", evaluaciones);
    }
  };

  const handleClickEvaluaciones = () => {
    router.push(`/componentes/evaluaciones`);
  };

  return (
    <div className="container">
      <Menu />
      <a href='/componentes/editarperfil'><HeaderName name={userName} /></a>
      <main className="evaluaciones1-container">
        <div className='cabecera1'>
          {tipoEva === "autoevaluacion" && <AutoEvaluacion />}
          {tipoEva === "evaluacionPares" && <EvaluacionPares />}
          {tipoEva === "evaluacionCruzada" && <EvaluacionCruzada />}
        </div>
        <div className='cuerpo1'>
          {[
            'Cumplimiento de requerimientos',
            'Calidad de código',
            'Pruebas y validaciones',
            'Gestión de proyectos',
            'Seguridad',
            'Satisfacción de usuario'
          ].map((titulo, index) => (
            <div className='evaluacion1' key={index}>
              <div className='descripcion1'>
                <h3>{titulo}</h3>
              </div>
              <div className='nota1'>
                {Array.from({ length: 10 }, (_, idx) => {
                  const nota = idx + 1;
                  return (
                    <button
                      key={nota}
                      onClick={() => handleNotaClick(index, nota)}
                      className={evaluaciones[index]?.nota === nota ? 'nota-seleccionada' : ''}
                    >
                      {nota}
                    </button>
                  );
                })}
              </div>
              <div className='justificacion1'>
                <textarea
                  placeholder='Justifique su respuesta...'
                  value={evaluaciones[index]?.justificacion || ""}
                  onChange={(e) => handleJustificacionChange(index, e.target.value)}
                ></textarea>
              </div>
            </div>
          ))}
        </div>
        <div className='pie1'>
          <button onClick={() => handleClickEvaluaciones()}>Cancelar</button>
          <button onClick={handleGuardar}>Guardar</button>
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