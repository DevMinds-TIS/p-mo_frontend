"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalMensaje from "@/app/componentes/modals/mensajes/mensaje.jsx";
import Link from 'next/link';

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

  //const handleClickPlanillaEvaluacion = (tipoEvaluacion) => {
    //poner qui la ruta a las planillas de evaluacion
    //router.push(`/PlanillaEvaluacion?tipoEvaluacion=${tipoEvaluacion}`);
  //};

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
                  <Link href={`/dashboard/planning/details/PlanillaEvaluacion?tipoEvaluacion=autoevaluacion`}>
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
            <h2 className="text-3xl w-1/2">Evaluación por pares</h2>
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
                  <Link href={`/dashboard/planning/details/PlanillaEvaluacion?tipoEvaluacion=evaluacionPares`}>
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
                  <Link href={`/dashboard/planning/details/PlanillaEvaluacion?tipoEvaluacion=evaluacionCruzada`}>
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
      <ModalMensaje
        mensaje={mensajeModal}
        mostrar={mostrarModal}
        onClose={handleCerrarModal}
      />
    </div>
  );
}
