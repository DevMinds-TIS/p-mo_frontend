"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Mantener el hook de next/navigation
import ModalMensaje from "@/app/componentes/modals/mensajes/mensaje.jsx";
import AutoEvaluacion from '@/app/(pages)/dashboard/(student)/planning/details/PlanillaEvaluacion/tipoEvaluacion/autoEvaluacion.jsx';
import EvaluacionPares from '@/app/(pages)/dashboard/(student)/planning/details/PlanillaEvaluacion/tipoEvaluacion/evaluacionPares';
import EvaluacionCruzada from '@/app/(pages)/dashboard/(student)/planning/details/PlanillaEvaluacion/tipoEvaluacion/evaluacionCruzada';

interface Evaluacion {
  nota: number;
  justificacion: string;
}

export default function PruevaPage() {
  const router = useRouter(); // Usar el hook de next/navigation
  const [userName, setUserName] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");
  const [tipoEva, setTipoEva] = useState(""); // Estado para tipo de evaluación
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);

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
  const handleNotaClick = (index: number, nota: number) => {
    setEvaluaciones(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        nota: nota
      }
    }));
  };

  // Actualizar la justificación
  const handleJustificacionChange = (index: number, justificacion: string) => {
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
    <div className="flex">
      <div className="p-5 text-white w-full flex flex-col justify-start min-h-screen h-auto overflow-y-auto gap-[10px]">
        <div className='w-full h-[150px]'>
          {tipoEva === "autoevaluacion" && <AutoEvaluacion />}
          {tipoEva === "evaluacionPares" && <EvaluacionPares />}
          {tipoEva === "evaluacionCruzada" && <EvaluacionCruzada />}
        </div>
        <div className='cuerpo1 w-full flex flex-wrap gap-[5px] items-center justify-center'>
          {[
            'Cumplimiento de requerimientos',
            'Calidad de código',
            'Pruebas y validaciones',
            'Gestión de proyectos',
            'Seguridad',
            'Satisfacción de usuario'
          ].map((titulo, index) => (
            <div className='w-[360px] h-[200px] flex flex-col gap-[5px]' key={index}>
              <div className='flex justify-center items-center'>
                <h3>{titulo}</h3>
              </div>
              <div className="flex gap-[5px] px-[6px] w-full">
                {Array.from({ length: 10 }, (_, idx) => {
                  const nota = idx + 1;
                  return (
                    <button
                      key={nota}
                      onClick={() => handleNotaClick(index, nota)}
                      className={`bg-[#191919] flex-1 h-[40px] cursor-pointer rounded-md 
                        ${evaluaciones[index]?.nota === nota ? 'nota-seleccionada text-white border border-[#4a47fc]' : ''} 
                        hover:bg-[#4a47fc]`} // Agrega el hover aquí
                    >
                      {nota}
                    </button>
                  );
                })}
              </div>


              <div className='flex items-center justify-center'>
                <textarea
                  placeholder='Justifique su respuesta...'
                  value={evaluaciones[index]?.justificacion || ""}
                  onChange={(e) => handleJustificacionChange(index, e.target.value)}
                  className="text-white bg-[#191919] w-[97%] h-[120px] resize-none p-[5px] rounded-md"
                ></textarea>
              </div>
            </div>
          ))}
        </div>
        <div className='w-full flex gap-[30px] items-center justify-center'>
          <button 
            onClick={() => handleClickEvaluaciones()}
            className='flex w-[50%] h-[40px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0'
          >Cancelar</button>
          <button 
            onClick={handleGuardar}
            className='flex w-[50%] h-[40px] items-center justify-center bg-[#FE7F2D]	rounded-md m-0'
          >Guardar</button>
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