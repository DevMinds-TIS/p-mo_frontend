"use client";
import React, { useState, useEffect } from "react";
import Semanal from "@/app/(pages)/dashboard/(student)/planning/details/detalle/semanal/semanal.jsx";
import Planilla from "@/app/(pages)/dashboard/(student)/planning/details/detalle/planilla/planilla.jsx";
import EncargadoHU from "@/app/(pages)/dashboard/(student)/planning/details/detalle/encargadosHU/encargados.jsx";

export default function Detalle() {
  const [objetivo, setObjetivo] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState('docent');

  // Manejar el objetivo
  const handleObjetivoChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setObjetivo(e.target.value);
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full gap-3">
        {/* Sección Objetivo */}
        <div className="flex flex-col w-full gap-y-1">
          <h2 className="text-3xl">Objetivo</h2>
          <textarea
            placeholder="Escriba el objetivo aquí..."
            value={objetivo}
            onChange={handleObjetivoChange}
            className="w-full h-20 resize-none"
          ></textarea>
        </div>

        <div>
          <EncargadoHU></EncargadoHU>
        </div>

        {/* Sección Planilla */}
        <div>
          <Planilla></Planilla>
        </div>

        {/* Sección semanal */}
        <div>
            <Semanal></Semanal>
        </div>
      </div>
    </div>
  );
}
