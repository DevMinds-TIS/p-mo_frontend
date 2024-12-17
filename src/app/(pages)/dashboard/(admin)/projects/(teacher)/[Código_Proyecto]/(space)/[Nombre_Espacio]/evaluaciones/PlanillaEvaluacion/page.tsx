"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AutoEvaluacion from '../PlanillaEvaluacion/tipoEvaluacion/autoEvaluacion';
import EvaluacionPares from '../PlanillaEvaluacion/tipoEvaluacion/evaluacionPares';
import EvaluacionCruzada from '../PlanillaEvaluacion/tipoEvaluacion/evaluacionCruzada';
import ErrorModal from '@/app/mensajes';

interface Evaluacion {
  nota?: number;
  justificacion?: string;
}

export default function PruevaPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(''); // Renombramos a errorMessage
  const [tipoEva, setTipoEva] = useState<string>(''); 
  const [evaluaciones, setEvaluaciones] = useState<Record<number, Evaluacion>>({});
  
  // Lista de criterios
  const criterios = [
    'Cumplimiento de requerimientos',
    'Calidad de código',
    'Pruebas y validaciones',
    'Gestión de proyectos',
    'Seguridad',
    'Satisfacción de usuario',
  ];

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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tipoEvaluacion = params.get('tipoEvaluacion');
      if (tipoEvaluacion) {
        setTipoEva(tipoEvaluacion);
      }
    }
  }, [router]);

  const handleNotaClick = (index: number, nota: number) => {
    setEvaluaciones(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        nota: nota,
      },
    }));
  };

  const handleJustificacionChange = (index: number, justificacion: string) => {
    setEvaluaciones(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        justificacion: justificacion,
      },
    }));
  };

  const validarEvaluacionesCompletas = (): boolean => {
    for (let i = 0; i < criterios.length; i++) {
      if (!evaluaciones[i]?.nota || !evaluaciones[i]?.justificacion) {
        return false;
      }
    }
    return true;
  };

  const handleGuardar = () => {
    if (!validarEvaluacionesCompletas()) {
      setErrorMessage("Por favor, llene todos los campos de evaluación."); // Usamos el estado errorMessage
      setMostrarModal(true); // Mostrar el modal de error
    } else {
      console.log("Evaluaciones guardadas:", evaluaciones);
    }
  };

  const handleClickEvaluaciones = () => {
    router.push(`/componentes/evaluaciones`);
  };

  return (
    <div className="flex">
      <main className="p-5 text-white w-full flex flex-col justify-start min-h-screen gap-10 overflow-y-auto">
        {/* Cabecera */}
        <div className="w-full h-[150px] mb-4">
          {tipoEva === "autoevaluacion" && <AutoEvaluacion />}
          {tipoEva === "evaluacionPares" && <EvaluacionPares />}
          {tipoEva === "evaluacionCruzada" && <EvaluacionCruzada />}
        </div>

        {/* Cuerpo */}
        <div className="w-full flex flex-wrap gap-4 items-center justify-center">
          {criterios.map((criterio, index) => (
            <div
              key={index}
              className="w-[calc(33.333%_-_1rem)] h-[auto] flex flex-col gap-3 bg-[#191919] p-4 rounded-lg shadow-lg"
            >
              {/* Descripción */}
              <div className="flex justify-center items-center mb-3">
                <h3 className="text-lg font-semibold">{criterio}</h3>
              </div>

              {/* Nota */}
              <div className="flex gap-2 justify-center">
                {Array.from({ length: 10 }, (_, idx) => (
                  <button
                    key={idx}
                    className={`h-[30px] w-[30px] flex justify-center items-center cursor-pointer bg-[#191919] hover:bg-[#4a47fc] text-white ${
                      evaluaciones[index]?.nota === idx + 1 ? 'bg-[#4a47fc] text-white border border-[#4a47fc]' : ''
                    }`}
                    onClick={() => handleNotaClick(index, idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Justificación */}
              <div className="flex justify-center mt-3">
                <textarea
                  className="text-white bg-[#191919] w-full h-[120px] resize-none p-2 rounded-lg focus:outline-none"
                  placeholder="Justifique su respuesta..."
                  value={evaluaciones[index]?.justificacion || ''}
                  onChange={(e) => handleJustificacionChange(index, e.target.value)}
                ></textarea>
              </div>
            </div>
          ))}
        </div>

        {/* Pie */}
        <div className="w-full flex gap-6 items-center justify-center mt-6">
          <button
            className="w-[45%] p-3 bg-gray-700 hover:bg-gray-800 rounded-lg"
            onClick={handleClickEvaluaciones}
          >
            Cancelar
          </button>
          <button
            className="w-[45%] p-3 bg-orange-600 hover:bg-orange-400 rounded-lg"
            onClick={handleGuardar}
          >
            Guardar
          </button>
        </div>

        {/* Modal de error */}
        {mostrarModal && (
          <ErrorModal
            message={errorMessage} // Pasamos el mensaje de error al modal
            onClose={handleCerrarModal} // Llamamos a la función para cerrar el modal
            className="z-100"
          />
        )}
      </main>
    </div>
  );
}
