"use client";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";
import NewTeam from "./NewTeam";
import { useState } from "react";

type Space = {
    ID_Espacio: number;
    ID_Proyecto: number;
    ID_Usuario: number;
    Nombre: string;
}

type Team = {
    ID_Equipo: number;
    ID_Usuario: number;
    ID_Espacio: number;
    Nombre: string;
    Razón_Social: string;
    Correo: string;
    Logo: string;
}

export default function TeamsPage() {
    const [space, setSpace] = useState<Space | null>(null);
    const [team, setTeam] = useState<Team | null>(null);

    return (
        <section>
            <div className="flex justify-between">
                <h1 className="text-4xl p-4">
                    Equipos
                </h1>
                <NewTeam/>
            </div>
            <div className="flex flex-wrap gap-4 p-4">
                <Link href={`${space?.Nombre}/${team?.Nombre}`}>
                    <Card shadow="sm" isPressable>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt="Grupo-empresa"
                                className="w-full object-cover h-36"
                                src={"https://nextui.org/images/album-cover.png"}
                            />
                        </CardBody>
                        <CardFooter className="text-small gap-4 justify-between">
                            <b>DevMinds S.R.L.</b>
                            <p className="text-default-500">6</p>
                        </CardFooter>
                    </Card>
                </Link>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Autoevaluación
                </h1>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Evaluación de pares
                </h1>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Evaluaciones cruzadas
                </h1>
            </div>
        </section>
    );
}