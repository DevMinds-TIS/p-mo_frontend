'use client';
import {Input} from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import NewProject from "./NewProject";

export default function ProjectsPage(){

    return(
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between">
                <h1 className="text-4xl">Proyectos</h1>
                <Input
                    isClearable
                    radius="lg"
                    placeholder="Encuéntrame"
                    className="w-auto"
                    startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                />
                <NewProject/>
            </section>
            <section>
                Hola mundo
            </section>
        </section>
    );
}