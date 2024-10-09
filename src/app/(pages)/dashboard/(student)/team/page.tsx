"use client";

import NewMember from "./NewMember";
import NewTeam from "./NewTeam";

export default function TestPage(){
    return(
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Grupo-Empresa</h1>
                <NewTeam/>
            </section>
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Miembros</h1>
                <NewMember/>
            </section>
        </section>
    );
}