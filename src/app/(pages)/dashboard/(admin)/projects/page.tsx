"use client";
import { useEffect, useState } from 'react';
import { Button, Input, Popover, PopoverContent, PopoverTrigger, RangeCalendar, Skeleton } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import NewProject from "./NewProject";
import { FolderLinksIcon, MoreVerticalIcon } from "hugeicons-react";
import Link from 'next/link';
import { I18nProvider } from '@react-aria/i18n';
import { parseDate } from '@internationalized/date';
import EditProject from './EditProject';

type Role = {
    ID_Rol: number;
    Name_Rol: string;
};

type User = {
    data: User;
    Roles: Role[];
};

type Project = {
    ID_Proyecto: number;
    Código_Proyecto: string;
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
    return data.data;
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
    if (!Array.isArray(data.data)) {
        throw new Error('Los datos obtenidos no son un array');
    }
    return data.data;
};

export default function ProjectsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
                const projectData = await fetchProjects();
                setProjects(projectData);
                setIsLoadingProjects(false);
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
                setIsLoadingProjects(false);
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
                    <Skeleton className="w-8 h-8 rounded-lg" />
                </section>
                <section className="flex flex-wrap p-4 gap-8">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className='flex flex-col w-fit gap-2'>
                            <Skeleton className="w-64 h-12 rounded-lg" />
                            <Skeleton className="w-64 h-64 rounded-xl" />
                        </div>
                    ))}
                </section>
            </section>
        );
    }
    if (!Array.isArray(projects)) {
        return <div>Error al cargar los proyectos.</div>;
    }

    const isAdmin = user?.Roles?.some(role => role.ID_Rol === 1) ?? false;
    const isTeacher = user?.Roles?.some(role => role.ID_Rol === 2) ?? false;
    const isStudent = user?.Roles?.some(role => role.ID_Rol === 3) ?? false;

    const handleNewProject = (newProject: Project) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
    };

    const filteredProjects = projects.filter((project) =>
        project.Código_Proyecto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="flex flex-col gap-y-8">
            {/* Header Section */}
            <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl">Proyectos</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                    <Input
                        isClearable
                        radius="lg"
                        placeholder="Encuéntrame"
                        className="w-full sm:w-auto"
                        startContent={
                            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isAdmin && <NewProject onNewProject={handleNewProject} />}
                </div>
            </section>

            {/* Projects Section */}
            <section className="flex flex-wrap p-4 gap-8">
                {isLoadingProjects ? (
                    [...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col w-fit gap-2"
                        >
                            <Skeleton className="w-64 h-12 rounded-lg" />
                            <Skeleton className="w-64 h-64 rounded-xl" />
                        </div>
                    ))
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <div
                            className="flex flex-col w-fit gap-2"
                            key={project.ID_Proyecto}
                        >
                            <div className="flex">
                                <Link
                                    href={`/dashboard/projects/${project.Código_Proyecto}`}
                                    className={`flex w-full items-center gap-2 ${
                                        isAdmin ? "rounded-l-lg" : ""
                                    } ${
                                        isTeacher || isStudent
                                            ? "rounded-lg"
                                            : "none"
                                    } bg-[#ff9b5a] p-2`}
                                >
                                    <FolderLinksIcon size={30} color="#FFF" />
                                    <span className="text-white">
                                        {project["Código_Proyecto"]}
                                    </span>
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
                                                {/* <div className="text-small font-bold">Popover Content</div>
                                                <div className="text-tiny">This is the popover content</div> */}
                                                <EditProject onNewProject={handleNewProject}/>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
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
                    ))
                ) : (
                    <div>No se encontraron proyectos.</div>
                )}
            </section>
        </section>
    );
}