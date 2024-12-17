"use client";
import { inria, bricolage } from "@/app/fonts";
import { Alert, Divider, Listbox, ListboxItem } from "@nextui-org/react";
import { useAlert } from "@/contexts/AlertContext";
import Image from "next/image";

export default function Page() {
  const { alertTitle, alertDescription, alertVisible, alertColor, hideAlert } = useAlert();

  return (
    <section>
      <div className="p-20 m-24">
        <h1 className={`${inria.className} text-center text-7xl`}>Bienvenido al evaluador basado en proyectos</h1>
        <h1 className={`${inria.className} text-center text-7xl italic`}>P-MO</h1>
      </div>
      <Divider className="border-solid"/>
      <div className="flex-col m-24 space-y-4">
        <h1 className={`${inria.className} text-center text-5xl font-bold`}>Propósito</h1>
        <p className={`${bricolage.className} italic text-center text-xl`}>P-MO fue desarrollado para facilitar la gestión organizativa de los docentes de la materia de Taller de Ingeniería de Software</p>
      </div>
      <div className="flex w-full justify-between p-4">
        <div className="w-1/3 space-y-4">
          <h1 id="project-scroll" className={`${inria.className} text-5xl font-bold`}>Funcionalidades</h1>
          <Listbox className={`${bricolage.className}`} aria-label="Features" variant="flat" onAction={(key) => alert(key)}>
            <ListboxItem key="projects" className="p-4 mb-2">
              <p id="space-scroll" className="text-3xl font-bold scroll-mt-[90px]">Proyectos</p>
              <p>Puerta de inicio para todos los involucrados</p>
            </ListboxItem>
            <ListboxItem key="spaces" className="p-4 mb-2">
              <p id="team-scroll" className="text-3xl font-bold">Espacios</p>
              <p>Puerta de inicio para los docentes</p>
            </ListboxItem>
            <ListboxItem key="teams" className="p-4 mb-2">
              <p id="add-member-scroll" className="text-3xl font-bold">Equipos</p>
              <p>Puerta de inicio para los estudiantes</p>
            </ListboxItem>
            <ListboxItem key="tests" className="p-4 mb-2">
              <p className="text-3xl font-bold">Evaluaciones</p>
              <p>Puerta de inicio para todos los involucrados</p>
            </ListboxItem>
            <ListboxItem key="reports" className="p-4">
              <p className="text-3xl font-bold">Reportes</p>
              <p>Recopilación de información clara y concisa</p>
            </ListboxItem>
          </Listbox>
        </div>
        <div className="flex w-2/4 items-center">
          <Image
            alt="Pantallazo general de la aplicación"
            src={"/prueba.png"}
            width={100}
            height={100}
            className="w-full rounded-xl border-5"
          />
        </div>
      </div>

      {alertVisible && (
        <div className="alert-fixed">
          <Alert
            color={alertColor}
            title={alertTitle}
            description={alertDescription}
            onClose={hideAlert}
            variant="solid"
          />
        </div>
      )}
    </section>
  );
}