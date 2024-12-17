import { useState } from 'react';

type CriteriosProps = {
  onClose: () => void; // Función para cerrar el modal
  tipoEvaluacion: string; // Tipo de evaluación que se pasa como prop
};

export default function Criterios({ onClose, tipoEvaluacion }: CriteriosProps) {
  const [calificacion, setCalificacion] = useState('');
  const [error, setError] = useState('');
  const [criterios, setCriterios] = useState([
    'Cumplimiento de requerimientos',
    'Calidad de código',
    'Documentación',
    'Pruebas unitarias',
    'Rendimiento',
    'Mantenimiento'
  ]);
  const [nuevoCriterio, setNuevoCriterio] = useState('');

  const agregarCriterio = () => {
    if (nuevoCriterio && !criterios.includes(nuevoCriterio)) {
      setCriterios([...criterios, nuevoCriterio]);
      setNuevoCriterio('');
    }
  };

  const eliminarCriterio = (index: number) => {
    const nuevosCriterios = criterios.filter((_, i) => i !== index);
    setCriterios(nuevosCriterios);
  };

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const calificacionNumerica = parseInt(calificacion, 10); // Convierte el string a número

    // Verificar si hay al menos un criterio
    if (criterios.length === 0) {
      setError('Debe haber al menos un criterio');
      return;
    }

    if (calificacionNumerica >= 1 && calificacionNumerica <= 100) {
      setError(''); // Limpiar error si está en rango
      console.log('Calificación:', calificacionNumerica);
      console.log('Criterios:', criterios);
      onClose(); // Cerrar el modal al guardar
    } else {
      setError('La calificación debe ser un número entre 1 y 100');
    }
  };

  const manejarCambioCalificacion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setCalificacion(valor);
    const calificacionNumerica = parseInt(valor, 10);
    if (calificacionNumerica < 1 || calificacionNumerica > 100) {
      setError('La calificación debe estar entre 1 y 100');
    } else {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-[#000] p-8 rounded-md shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Criterios de Evaluación ({tipoEvaluacion})</h2>
        <form onSubmit={manejarEnvio}>
          {/* Campo para calificación */}
          <div className="mb-4">
            <h2 className="block font-medium text-white">Calificación (1-100):</h2>
            <input
              type="number"
              value={calificacion}
              onChange={manejarCambioCalificacion}
              className="bg-[#191919] mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-[5px]"
              min="1"
              max="100"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Lista de criterios */}
          <div className="mb-4">
            <h2 className="block font-medium text-white">Criterios:</h2>
            <ul className="p-[3px] bg-[#191919] space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
              {criterios.map((criterio, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-white">{criterio}</span>
                  <button
                    type="button"
                    className="text-white hover:text-red-500"
                    onClick={() => eliminarCriterio(index)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex">
              <input
                type="text"
                value={nuevoCriterio}
                onChange={(e) => setNuevoCriterio(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-[5px]"
                placeholder="Agregar nuevo criterio"
              />
              <button
                type="button"
                onClick={agregarCriterio}
                className="ml-2 px-4 py-2 bg-[#FE7F2D] text-white rounded-md hover:bg-[#FE7111]"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-center gap-[10px]">
            <button
              type="button"
              className="px-4 py-2 bg-[#FE7F2D] text-white rounded-md hover:bg-[#FE7111]"
              onClick={onClose} // Cerrar el modal
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FE7F2D] text-white rounded-md hover:bg-[#FE7111]"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
