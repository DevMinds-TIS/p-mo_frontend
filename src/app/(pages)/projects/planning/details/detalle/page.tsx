"use client";
import React, { useState, useEffect } from "react";
//import Semanal from "@/app/(pages)/dashboard/(student)/planning/details/detalle/semanal/semanal.jsx";
//import Planilla from "@/app/(pages)/dashboard/(student)/planning/details/detalle/planilla/planilla.jsx";
//import EncargadoHU from "@/app/(pages)/dashboard/(student)/planning/details/detalle/encargadosHU/encargados.tsx";
import EncargadoHU from "@/app/(pages)/projects/planning/details/detalle/encargadosHU/encargados";
import Grafico from "./grafico";
interface DetalleProps {
  id: number;
  sprintNumber: string;
  onDataSend: number;
  iduser : number;
}

export default function Detalle({ id, sprintNumber, onDataSend, iduser }: DetalleProps) {
  const [objetivo, setObjetivo] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("docent");
  const [numeroHijo, setNumeroHijo] = useState(0); //dd


  //hh
  useEffect(() => {
    console.log("ID recibido en Detalle:", id);
  }, [id]);


  // Manejar el objetivo
  const handleObjetivoChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setObjetivo(e.target.value);
  };

  // Mostrar el id recibido en la consola
  useEffect(() => {
    console.log("ID recibido en Detalle:", id);
  }, [id]); // Se ejecuta cada vez que el id cambia

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full gap-3">
        {/* Sección Objetivo */}
        {/* <div className="flex flex-col w-full gap-y-1">
          <h2 className="text-3xl">Objetivo</h2>
          <textarea
            placeholder="Escriba el objetivo aquí..."
            value={objetivo}
            onChange={handleObjetivoChange}
            className="w-full h-20 resize-none"
          ></textarea>
        </div> */}
        <div><Grafico /></div>
        <div>
          <EncargadoHU id={id} sprintNumber={sprintNumber} onDataSend={onDataSend} iduser={iduser} />
        </div>

        {/* Sección Planilla */}
        {/* <div>
          <Planilla />
        </div>

        {/* Sección semanal */}
        {/* <div>
          <Semanal />
        </div>  */}
      </div>
    </div>
  );
}
