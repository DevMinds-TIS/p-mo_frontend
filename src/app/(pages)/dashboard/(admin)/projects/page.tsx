"use client";
import { useEffect, useState } from 'react';
import { Button, Input, Popover, PopoverContent, PopoverTrigger, RangeCalendar, Skeleton } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import NewProject from "./NewProject";
import { FolderLinksIcon, MoreVerticalIcon } from "hugeicons-react";
import Link from 'next/link';
import Criterios from './(teacher)/criterios/NewCriterio';
import { I18nProvider } from '@react-aria/i18n';
import { DateValue, isWeekend, parseDate } from '@internationalized/date';

type Role = {
    idroleuser: number;
    idrol: number;
};

type User = {
    roles: Role[];
};

type Project = {
    ID_Proyecto: number;
    Código: string;
    Fecha_Inicio: string;
    Fecha_Fin: string;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchUser = async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${backendUrl}/user`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
    }

    const data: User = await response.json();
    return data;
};

const fetchProjects = async (): Promise<Project[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    const response = await fetch(`${backendUrl}/projects`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Error al obtener los proyectos');
    }
    const data = await response.json();
    console.log("Fetched projects:", data);
    if (!Array.isArray(data.data)) {
        throw new Error('Los datos obtenidos no son un array');
    }
    return data.data;
};

export default function ProjectsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [filterText, setFilterText] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
                const projectData = await fetchProjects();
                setProjects(projectData);
                if (projectData.length > 0) {
                    const earliestStartDate = projectData.reduce((earliest, current) => {
                        return new Date(current.Fecha_Inicio) < new Date(earliest.Fecha_Inicio) ? current : earliest;
                    }).Fecha_Inicio;
                    const latestEndDate = projectData.reduce((latest, current) => {
                        return new Date(current.Fecha_Fin) > new Date(latest.Fecha_Fin) ? current : latest;
                    }).Fecha_Fin;
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);    

    if (!user) {
        return (
            <section className="flex flex-col gap-y-8">
                <section className="flex w-full h-10 justify-between items-center">
                    <h1 className="text-3xl">Proyectos</h1>
                    <Skeleton className="w-1/4 h-10 rounded-lg" />
                    <Skeleton className="w-10 h-10 rounded-lg" />
                </section>
                <section className="flex flex-wrap p-4 gap-8">
                    <div className='flex flex-col w-fit gap-2'>
                        <Skeleton className="w-64 h-12 rounded-lg" />
                        <Skeleton className="w-64 h-64 rounded-xl" />
                    </div>
                    <div className='flex flex-col w-fit gap-2'>
                        <Skeleton className="w-64 h-12 rounded-lg" />
                        <Skeleton className="w-64 h-64 rounded-xl" />
                    </div>
                    <div className='flex flex-col w-fit gap-2'>
                        <Skeleton className="w-64 h-12 rounded-lg" />
                        <Skeleton className="w-64 h-64 rounded-xl" />
                    </div>
                    <div className='flex flex-col w-fit gap-2'>
                        <Skeleton className="w-64 h-12 rounded-lg" />
                        <Skeleton className="w-64 h-64 rounded-xl" />
                    </div>
                </section>
            </section>
        );
    }

    if (!Array.isArray(projects)) {
        return <div>Error al cargar los proyectos.</div>;
    }


    const isAdmin = user.roles.some(role => role.idrol === 1);
    const isTeacher = user.roles.some(role => role.idrol === 2);
    const isStudent = user.roles.some(role => role.idrol === 3);

    const handleNewProject = (newProject: Project) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
    };

    // Filtrar proyectos basados en el texto del filtro
    const filteredProjects = projects.filter((project) =>
        project.Código.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <section className="flex flex-col gap-y-8 p-4 md:p-8">
            {/* Encabezado */}
            <section className="flex flex-col md:flex-row w-full h-auto md:h-10 justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl">Proyectos</h1>
                <div className="flex w-full md:w-auto items-center gap-4">
                    <Input
                        isClearable
                        radius="lg"
                        placeholder="Encuéntrame"
                        value={filterText} // Bind al estado
                        onChange={(e) => setFilterText(e.target.value)} // Actualizar estado
                        className="w-full md:w-auto"
                        startContent={
                            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                        }
                    />
                    {isAdmin && <NewProject />}
                </div>
            </section>
    
            {/* Lista de proyectos */}
            <section className="flex flex-wrap justify-center md:justify-start p-4 gap-4 md:gap-8">
                {filteredProjects.map((project) => (
                    <div
                        className="flex flex-col w-full sm:w-[48%] md:w-[30%] lg:w-[23%] gap-2"
                        key={project.ID_Proyecto}
                    >
                        {/* Link y Popover */}
                        <div className="flex">
                            <Link
                                href={`/dashboard/projects/${project.Código}`}
                                className={`flex w-full items-center gap-2 ${
                                    isAdmin ? "rounded-l-lg" : ""
                                } ${
                                    isTeacher || isStudent ? "rounded-lg" : ""
                                } bg-[#ff9b5a] p-2`}
                            >
                                <FolderLinksIcon size={30} color="#FFF" />
                                <span className="text-white">{project["Código"]}</span>
                            </Link>
                            {isAdmin && (
                                <Popover placement="right" backdrop="blur">
                                    <PopoverTrigger>
                                        <Button
                                            className="min-w-0 p-2 items-center rounded-r-lg bg-[#ff9b5a]"
                                            size="lg"
                                            radius="none"
                                        >
                                            <MoreVerticalIcon size={30} color="#FFF" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="px-1 py-2">
                                            <div className="text-small font-bold">
                                                Popover Content
                                            </div>
                                            <div className="text-tiny">
                                                This is the popover content
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>

                        {/* Calendario */}
                        <I18nProvider locale="es-BO">
                            <RangeCalendar
                                aria-label="Date (Read Only)"
                                isReadOnly
                                allowsNonContiguousRanges
                                minValue={parseDate(project.Fecha_Inicio)}
                                maxValue={parseDate(project.Fecha_Fin)}
                                defaultValue={{
                                    start: parseDate(project.Fecha_Inicio),
                                    end: parseDate(project.Fecha_Fin),
                                }}
                            />
                        </I18nProvider>
                    </div>
                ))}
            </section>
        </section>
    );
}