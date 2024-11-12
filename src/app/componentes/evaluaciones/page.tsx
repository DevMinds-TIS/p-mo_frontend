"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '../modals/menu/menu';
import HeaderName from '../modals/usuario/nombre.jsx';
import ModalMensaje from "../modals/mensajes/mensaje.jsx";
import './evaluaciones.css';

interface Evaluacion {
  nota: number;
  nombre: string;
  fecha: string;
}

export default function PruevaPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");
  
  // Estado separado para cada tipo de evaluación
  const [autoevaluaciones, setAutoevaluaciones] = useState<Evaluacion[]>([]);
  const [evaluacionesPares, setEvaluacionesPares] = useState<Evaluacion[]>([]);
  const [evaluacionesCruzadas, setEvaluacionesCruzadas] = useState<Evaluacion[]>([]);
  
  // Tipo de usuario y rol
  const [tipoUsuario, setTipoUsuario] = useState('estudiante');
  const [rol, setRol] = useState('lider');
  
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

  // Modifica la función para agregar a cada tipo de evaluación
  const agregarFicha = (tipo: string) => {
    const nuevaFicha: Evaluacion = {
      nota: Math.random() * 10, // Simulación de nota aleatoria
      nombre: userName,
      fecha: new Date().toLocaleDateString(),
    };

    switch (tipo) {
      case 'Autoevaluacion':
        // Verificar si ya existe una ficha con el mismo nombre de usuario
        const existeFicha = autoevaluaciones.some((evaluacion) => evaluacion.nombre === userName);
        if (existeFicha) {
          setMensajeModal("Ya existe una auto evaluación del usuario.");
          setMostrarModal(true);
          return;
        }
        setAutoevaluaciones([...autoevaluaciones, nuevaFicha]);
        break;
      case 'Pares':
        setEvaluacionesPares([...evaluacionesPares, nuevaFicha]);
        break;
      case 'Cruzada':
        // Verificar si el rol es líder antes de agregar la ficha
        if (rol !== 'lider') {
          setMensajeModal("Solo los líderes pueden agregar una evaluación cruzada.");
          setMostrarModal(true);
          return;
        }
        setEvaluacionesCruzadas([...evaluacionesCruzadas, nuevaFicha]);
        break;
      default:
        break;
    }
  };

  const eliminarFicha = (tipo: string, index: number) => {
    switch (tipo) {
      case 'Autoevaluacion':
        setAutoevaluaciones(autoevaluaciones.filter((_, i) => i !== index));
        break;
      case 'Pares':
        setEvaluacionesPares(evaluacionesPares.filter((_, i) => i !== index));
        break;
      case 'Cruzada':
        setEvaluacionesCruzadas(evaluacionesCruzadas.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  const handleClickPlanillaEvaluacion = (tipoEvaluacion) => {
    router.push(`/componentes/PlanillaEvaluacion?tipoEvaluacion=${tipoEvaluacion}`);
  };

  return (
    <div className="container">
      <Menu />
      <a href='/componentes/editarperfil'><HeaderName name={userName} /></a>
      <main className="evaluaciones-container">
        {/* Contenedor de Autoevaluación */}
        <div className="containeres">
          <div className="cabecera">
            <div className="titulo">
              <h2>AutoEvaluación</h2>
            </div>
            <div className="botones">
              {/* Mostrar el botón + solo si el tipo de usuario es "estudiante" */}
              {tipoUsuario === 'estudiante' && (
                <button onClick={() => agregarFicha('Autoevaluacion')}>+</button>
              )}
            </div>
          </div>
          <div className="cuerpo">
            {autoevaluaciones.map((evaluacion, index) => (
              <div key={index} className="ficha-evaluacion">
                <div className="nota">{evaluacion.nota.toFixed(1)}</div>
                <div className="datos">
                  <div className="nombre">{evaluacion.nombre}</div>
                  <div className="nombre">{evaluacion.fecha}</div>
                </div>
                <div>
                  <button onClick={() => eliminarFicha('Autoevaluacion', index)} className="eliminar-ficha">x</button>
                  <button onClick={() => handleClickPlanillaEvaluacion('autoevaluacion')} className="eliminar-ficha">E</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenedor de Evaluación por pares */}
        <div className="containeres">
          <div className="cabecera">
            <div className="titulo">
              <h2>Evaluación por pares</h2>
            </div>
            <div className="botones">
              {/* Mostrar el botón + solo si el tipo de usuario es "estudiante" */}
              {tipoUsuario === 'estudiante' && (
                <button onClick={() => agregarFicha('Pares')}>+</button>
              )}
            </div>
          </div>
          <div className="cuerpo">
            {evaluacionesPares.map((evaluacion, index) => (
              <div key={index} className="ficha-evaluacion">
                <div className="nota">{evaluacion.nota.toFixed(1)}</div>
                <div className="datos">
                  <div className="nombre">{evaluacion.nombre}</div>
                  <div className="nombre">Evaluado....</div>
                  <div className="nombre">{evaluacion.fecha}</div>
                </div>
                <div>
                  <button onClick={() => eliminarFicha('Pares', index)} className="eliminar-ficha">x</button>
                  <button onClick={() => handleClickPlanillaEvaluacion('evaluacionPares')} className="eliminar-ficha">E</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenedor de Evaluación cruzada */}
        <div className="containeres">
          <div className="cabecera">
            <div className="titulo">
              <h2>Evaluación cruzada</h2>
            </div>
            <div className="botones">
              {/* Mostrar el botón + solo si el tipo de usuario es "estudiante" y el rol es "lider" */}
              {tipoUsuario === 'estudiante' && rol === 'lider' && (
                <button onClick={() => agregarFicha('Cruzada')}>+</button>
              )}
            </div>
          </div>
          <div className="cuerpo">
            {evaluacionesCruzadas.map((evaluacion, index) => (
              <div key={index} className="ficha-evaluacion">
                <div className="nota">{evaluacion.nota.toFixed(1)}</div>
                <div className="datos">
                  <div className="nombre">{evaluacion.nombre}</div>
                  <div className="nombre">Evaluado....</div>
                  <div className="nombre">{evaluacion.fecha}</div>
                </div>
                <div className='botones-ficha'>
                  <button onClick={() => eliminarFicha('Cruzada', index)} className="eliminar-ficha">x</button>
                  <button onClick={() => handleClickPlanillaEvaluacion('evaluacionCruzada')} className="eliminar-ficha">E</button>
                </div>
              </div>
            ))}
          </div>
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
