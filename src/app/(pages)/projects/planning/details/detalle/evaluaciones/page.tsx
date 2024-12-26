"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import ModalMensaje from "@/app/componentes/modals/mensajes/mensaje.jsx";
import Link from 'next/link';

interface Evaluacion {
  nota: number;
  nombre: string;
  fecha: string;
}
interface EvaluacionGrupo {
  id_grup: number;
  tipo_evaluacion: string;
  promedio_nota: number;
  evaluaciones: Evaluacion[];
}

export default function PruevaPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");

  const [evaluaciones, setEvaluaciones] = useState<EvaluacionGrupo[]>([]);

  const [autoevaluaciones, setAutoevaluaciones] = useState<Evaluacion[]>([]);
  const [evaluacionesPares, setEvaluacionesPares] = useState<Evaluacion[]>([]);
  const [evaluacionesCruzadas, setEvaluacionesCruzadas] = useState<Evaluacion[]>([]);

  const [tipoUsuario, setTipoUsuario] = useState('estudiante');
  const [rol, setRol] = useState('lider');




  //const [error, setError] = useState(null);
  const [error, setError] = useState<string | null>(null);


  const [promedios, setPromedios] = useState({
    Autoevaluacion: 0,
    Pares: 0,
    Cruzada: 0,
  });
  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/evaluaciones2');
        if (!response.ok) {
          throw new Error('Error al obtener datos');
        }
        const data = await response.json();
        console.log('Datos de evaluaciones:', data);

        // Verifica que data.evaluaciones es un array antes de asignarlo
        if (Array.isArray(data.evaluaciones)) {
          setEvaluaciones(data.evaluaciones);
        } else {
          console.error("Los datos obtenidos no son un array:", data.evaluaciones);
          setEvaluaciones([]); // Asigna un array vacío como fallback
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error:', error.message);
          setError(error.message);
        } else {
          console.error('Error desconocido', error);
          setError('Error desconocido');
        }
      }
    };

    fetchEvaluaciones();
  }, []);

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

  const agregarFicha = (tipo: string) => {
    if (!Array.isArray(evaluaciones) || evaluaciones.length === 0) {
      // Mostrar mensaje en el modal si no hay datos de evaluaciones
      setMensajeModal("No hay datos registrados para este tipo de evaluación.");
      setMostrarModal(true);
      return;
    }

    const grupo = evaluaciones.find(e => e.tipo_evaluacion === tipo);

    if (!grupo) {
      console.error('No se encontró el tipo de evaluación');
      return;
    }

    const nuevaFicha = {
      nota: grupo.promedio_nota, // Usa el promedio del backend en lugar de un valor aleatorio
      nombre: userName,
      fecha: new Date().toLocaleDateString(),
    };

    switch (tipo) {
      case 'Autoevaluacion':
        const existeFicha = autoevaluaciones.some(evaluacion => evaluacion.nombre === userName);
        if (existeFicha) {
          setMensajeModal("Ya existe una autoevaluación del usuario.");
          setMostrarModal(true);
          return;
        }
        setAutoevaluaciones([...autoevaluaciones, nuevaFicha]);
        break;

      case 'Pares':
        setEvaluacionesPares([...evaluacionesPares, nuevaFicha]);
        break;

      case 'Cruzada':
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



  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full">
        {/* Contenedor de Autoevaluación */}
        <div className="flex flex-col w-full">
          <div className="flex items-center">
            <h2 className="text-3xl w-1/2">AutoEvaluación</h2>
            <div className="w-1/2 flex flex-row-reverse">
              {tipoUsuario === 'estudiante' && (
                <button
                  onClick={() => agregarFicha('Autoevaluacion')}
                  className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                >+</button>
              )}
            </div>
          </div>
          <div className="p-2 flex gap-2 h-[140px] max-h-[140px] overflow-x-auto overflow-y-hidden">
            {autoevaluaciones.map((evaluacion, index) => (
              <div key={index} className="bg-[#191919] w-[300px] min-w-[300px] p-1 flex gap-1 rounded-[10px]">
                <div className="border-2 border-white flex justify-center items-center w-[40%] rounded-[10px]">
                  {evaluacion.nota.toFixed(1)}
                </div>
                <div className="w-[60%] flex flex-col gap-[10px] p-[5px]">
                  <div className="h-[30px] flex items-center">{evaluacion.nombre}</div>
                  <div className="h-[30px] flex items-center">{evaluacion.fecha}</div>
                </div>
                <div className='flex flex-col gap-y-2'>
                  <button
                    onClick={() => eliminarFicha('Autoevaluacion', index)}
                    className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                  >x</button>
                  <Link href={'/dashboard/planning/details/PlanillaEvaluacion'}>
                    <button
                      //onClick={() => handleClickPlanillaEvaluacion('autoevaluacion')} 
                      className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                    >E</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenedor de Evaluación por pares */}
        <div className="flex flex-col w-full">
          <div className="flex items-center">
            <h2 className="text-3xl w-1/2">Evaluación opor pares</h2>
            <div className="w-1/2 flex flex-row-reverse">
              {tipoUsuario === 'estudiante' && (
                <button
                  onClick={() => agregarFicha('Pares')}
                  className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                >+</button>
              )}
            </div>
          </div>
          <div className="p-2 flex gap-2 h-[140px] max-h-[140px] overflow-x-auto overflow-y-hidden">
            {evaluacionesPares.map((evaluacion, index) => (
              <div key={index} className="bg-[#191919] w-[300px] min-w-[300px] p-1 flex gap-1 rounded-[10px]">
                <div className="border-2 border-white flex justify-center items-center w-[40%] rounded-[10px]">
                  {evaluacion.nota.toFixed(1)}
                </div>
                <div className="w-[60%] flex flex-col gap-[10px] p-[5px]">
                  <div className="h-[30px] flex items-center">{evaluacion.nombre}</div>
                  <div className="h-[30px] flex items-center">Evaluado....</div>
                  <div className="h-[30px] flex items-center">{evaluacion.fecha}</div>
                </div>
                <div className='flex flex-col gap-y-2'>
                  <button
                    onClick={() => eliminarFicha('Pares', index)}
                    className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                  >x</button>
                  <Link href={'/dashboard/planning/details/PlanillaEvaluacion'}>
                    <button
                      //onClick={() => handleClickPlanillaEvaluacion('evaluacionPares')}* 
                      className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                    >E</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenedor de Evaluación cruzada */}
        <div className="flex flex-col w-full">
          <div className="flex items-center">
            <h2 className='text-3xl w-1/2'>Evaluación cruzada</h2>
            <div className="w-1/2 flex flex-row-reverse">
              {tipoUsuario === 'estudiante' && rol === 'lider' && (
                <button
                  onClick={() => agregarFicha('Cruzada')}
                  className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                >+</button>
              )}
            </div>
          </div>
          <div className="p-2 flex gap-2 h-[140px] max-h-[140px] overflow-x-auto overflow-y-hidden">
            {evaluacionesCruzadas.map((evaluacion, index) => (
              <div key={index} className="bg-[#191919] w-[300px] min-w-[300px] p-1 flex gap-1 rounded-[10px]">
                <div className="border-2 border-white flex justify-center items-center w-[40%] rounded-[10px]">
                  {evaluacion.nota.toFixed(1)}
                </div>
                <div className="w-[60%] flex flex-col gap-[10px] p-[5px]">
                  <div className="h-[30px] flex items-center">{evaluacion.nombre}</div>
                  <div className="h-[30px] flex items-center">Evaluado....</div>
                  <div className="h-[30px] flex items-center">{evaluacion.fecha}</div>
                </div>
                <div className='flex flex-col gap-y-2'>
                  <button
                    onClick={() => eliminarFicha('Cruzada', index)}
                    className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                  >x</button>
                  <Link href={'/dashboard/planning/details/PlanillaEvaluacion'}>
                    <button
                      //onClick={() => handleClickPlanillaEvaluacion('evaluacionCruzada')} 
                      className="flex w-[30px] h-[30px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0"
                    >E</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
