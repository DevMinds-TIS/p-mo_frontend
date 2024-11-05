"use client";
import { useEffect, useState } from 'react';
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Skeleton } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import NewProject from "./NewProject";
import { FolderLinksIcon, MoreVerticalIcon } from "hugeicons-react";
import Link from 'next/link';
import Criterios from './(teacher)/criterios/NewCriterio';

type Role = {
    idroleuser: number;
    idrol: number;
};

type User = {
    roles: Role[];
};

type Project = {
    ID: number;
    Código: string;
};


const fetchUser = async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch('http://localhost:8000/api/user', {
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
    const response = await fetch('http://localhost:8000/api/projects', {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await fetchProjects();
                setProjects(projectData);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setProjects([]);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        fetchUserData();
    }, []);

    if (projects.length === 0 || !user) {
        return (
            <section className="flex flex-col gap-y-8">
                <section className="flex w-full h-10 justify-between items-center">
                    <h1 className="text-3xl">Proyectos</h1>
                    <Skeleton className="w-1/4 h-10 rounded-lg" />
                    <Skeleton className="w-10 h-10 rounded-lg" />
                </section>
                <section className="flex flex-wrap p-4 gap-4">
                    <Skeleton className="w-64 h-12 rounded-lg" />
                    <Skeleton className="w-64 h-12 rounded-lg" />
                    <Skeleton className="w-64 h-12 rounded-lg" />
                    <Skeleton className="w-64 h-12 rounded-lg" />
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

    return (
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Proyectos</h1>
                <Input
                    isClearable
                    radius="lg"
                    placeholder="Encuéntrame"
                    className="w-auto"
                    startContent={<SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />}
                />
                {isAdmin && <NewProject onNewProject={handleNewProject} />}
            </section>
            <section className="flex flex-wrap p-4 gap-4">
                {projects.map(project => (
                    <div className='flex' key={project.ID}>
                        <Link
                            href={`/dashboard/projects/${project.Código}`}
                            className={`flex items-center gap-2 ${isAdmin ? "rounded-l-lg" : ""} ${isTeacher || isStudent ? "rounded-lg" : "none"} bg-[#ff9b5a] p-2`}
                        >
                            <FolderLinksIcon size={30} />
                            {project['Código']}
                        </Link>
                        {isAdmin && (
                            <Popover placement="right" backdrop="blur">
                                <PopoverTrigger>
                                    <Button className="min-w-0 p-2 items-center rounded-r-lg bg-[#ff9b5a]" size="lg" radius="none">
                                        <MoreVerticalIcon size={30} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="px-1 py-2">
                                        <div className="text-small font-bold">Popover Content</div>
                                        <div className="text-tiny">This is the popover content</div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                ))}
            </section>
        </section>
    );
}