"use client";
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ErrorModal from '@/app/mensajes';
import { AddSquareIcon } from 'hugeicons-react';

interface Evaluacion {
  nota: number;
  nombre: string;
  fecha: string;
}

export default function PruevaPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [mensajeModal, setMensajeModal] = useState<string>("");

  // Estado separado para cada tipo de evaluación
  const [autoevaluaciones, setAutoevaluaciones] = useState<Evaluacion[]>([]);
  const [evaluacionesPares, setEvaluacionesPares] = useState<Evaluacion[]>([]);
  const [evaluacionesCruzadas, setEvaluacionesCruzadas] = useState<Evaluacion[]>([]);

  // Tipo de usuario y rol
  const [tipoUsuario, setTipoUsuario] = useState<string>('estudiante');
  const [rol, setRol] = useState<string>('lider');
  
  const pathname = usePathname(); // Obtiene la ruta actual (sin los parámetros)
  const searchParams = useSearchParams(); // Obtiene los parámetros de búsqueda
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
    const nuevaFicha: Evaluacion = {
      nota: Math.random() * 10,
      nombre: userName,
      fecha: new Date().toLocaleDateString(),
    };

    switch (tipo) {
      case 'Autoevaluacion':
        // Verificar si ya existe una autoevaluación para este usuario
        const existeFicha = autoevaluaciones.some((evaluacion) => evaluacion.nombre === userName);
        if (existeFicha) {
          setMensajeModal("Solo se puede hacer una autoevaluación.");
          setMostrarModal(true);
          return; // Si ya existe, no agregar una nueva
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

  const currentUrl = `${pathname}${searchParams.toString()}`;

  const handleClickPlanillaEvaluacion = (tipoEvaluacion: string) => {
    router.push(`${currentUrl}/PlanillaEvaluacion?tipoEvaluacion=${tipoEvaluacion}`);
  };
  
  return (
    <div className="flex justify-center">
      <main className="p-5 text-white w-full max-w-7xl flex flex-col justify-start min-h-screen overflow-y-auto">
        {/* Contenedor de Autoevaluación */}
        <div className="containeres w-full mb-4">
          <div className="cabecera p-2 flex items-center justify-between h-12">
            <div className="titulo w-2/3">
              <h2 className="text-xl font-bold">AutoEvaluación</h2>
            </div>
            <div className="botones flex justify-end w-1/3">
              {tipoUsuario === 'estudiante' && (
                <button onClick={() => agregarFicha('Autoevaluacion')} className="text-white p-2 rounded w-10 h-10">
                  <AddSquareIcon size={30} />
                </button>
              )}
            </div>
          </div>
          <div className="cuerpo p-2 flex flex-wrap gap-4 max-h-[45rem] overflow-x-hidden overflow-y-auto justify-center">
            {autoevaluaciones.map((evaluacion, index) => (
              <div key={index} className="ficha-evaluacion bg-gray-800 p-4 flex gap-4 rounded-lg w-full sm:w-72 min-w-72">
                <div className="nota border-2 border-white flex justify-center items-center w-2/5 rounded-lg">{evaluacion.nota.toFixed(1)}</div>
                <div className="datos w-3/5 flex flex-col gap-2 p-2">
                  <div className="nombre h-8 flex items-center">{evaluacion.nombre}</div>
                  <div className="nombre h-8 flex items-center">{evaluacion.fecha}</div>
                </div>
                <div className="botones-ficha flex flex-col justify-between">
                  <button onClick={() => eliminarFicha('Autoevaluacion', index)} className="eliminar-ficha bg-red-500 text-white p-1 w-7 h-7 rounded-full">x</button>
                  <button onClick={() => handleClickPlanillaEvaluacion('autoevaluacion')} className="bg-green-500 text-white p-2 rounded w-7 h-7">E</button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Contenedor de Evaluación por pares */}
        <div className="containeres w-full mb-4">
          <div className="cabecera p-2 flex items-center justify-between h-12">
            <div className="titulo w-2/3">
              <h2 className="text-xl font-bold">Evaluación por pares</h2>
            </div>
            <div className="botones flex justify-end w-1/3">
              {tipoUsuario === 'estudiante' && (
                <button onClick={() => agregarFicha('Pares')} className="text-white p-2 rounded w-10 h-10">
                  <AddSquareIcon size={30} />
                </button>
              )}
            </div>
          </div>
          <div className="cuerpo p-2 flex flex-wrap gap-4 max-h-[11rem] overflow-x-hidden overflow-y-auto justify-center">
            {evaluacionesPares.map((evaluacion, index) => (
              <div key={index} className="ficha-evaluacion bg-gray-800 p-4 flex gap-4 rounded-lg w-full sm:w-72 min-w-72">
                <div className="nota border-2 border-white flex justify-center items-center w-2/5 rounded-lg">{evaluacion.nota.toFixed(1)}</div>
                <div className="datos w-3/5 flex flex-col gap-2 p-2">
                  <div className="nombre h-8 flex items-center">{evaluacion.nombre}</div>
                  <div className="nombre h-8 flex items-center">Evaluado....</div>
                  <div className="nombre h-8 flex items-center">{evaluacion.fecha}</div>
                </div>
                <div className="botones-ficha flex flex-col justify-between">
                  <button onClick={() => eliminarFicha('Pares', index)} className="eliminar-ficha bg-red-500 text-white p-1 w-7 h-7 rounded-full">x</button>
                  <button onClick={() => handleClickPlanillaEvaluacion('evaluacionPares')} className="bg-green-500 text-white p-2 rounded w-7 h-7">E</button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Contenedor de Evaluación cruzada */}
        <div className="containeres w-full mb-4">
          <div className="cabecera p-2 flex items-center justify-between h-12">
            <div className="titulo w-2/3">
              <h2 className="text-xl font-bold">Evaluación cruzada</h2>
            </div>
            <div className="botones flex justify-end w-1/3">
              {tipoUsuario === 'estudiante' && rol === 'lider' && (
                <button onClick={() => agregarFicha('Cruzada')} className="text-white p-2 rounded w-10 h-10">
                  <AddSquareIcon size={30} />
                </button>
              )}
            </div>
          </div>
          <div className="cuerpo p-2 flex flex-wrap gap-4 max-h-[11rem] overflow-x-hidden overflow-y-auto justify-center">
            {evaluacionesCruzadas.map((evaluacion, index) => (
              <div key={index} className="ficha-evaluacion bg-gray-800 p-4 flex gap-4 rounded-lg w-full sm:w-72 min-w-72">
                <div className="nota border-2 border-white flex justify-center items-center w-2/5 rounded-lg">{evaluacion.nota.toFixed(1)}</div>
                <div className="datos w-3/5 flex flex-col gap-2 p-2">
                  <div className="nombre h-8 flex items-center">{evaluacion.nombre}</div>
                  <div className="nombre h-8 flex items-center">Evaluado....</div>
                  <div className="nombre h-8 flex items-center">{evaluacion.fecha}</div>
                </div>
                <div className="botones-ficha flex flex-col justify-between">
                  <button onClick={() => eliminarFicha('Cruzada', index)} className="eliminar-ficha bg-red-500 text-white p-1 w-7 h-7 rounded-full">x</button>
                  <button onClick={() => handleClickPlanillaEvaluacion('evaluacionCruzada')} className="bg-green-500 text-white p-2 rounded w-7 h-7">E</button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Modal de Error */}
        {mostrarModal && (
          <ErrorModal
            message={mensajeModal} // Pasamos el mensaje de error al modal
            onClose={handleCerrarModal} // Llamamos a la función para cerrar el modal
            className="z-100"
          />
        )}
      </main>
    </div>
  );
}
