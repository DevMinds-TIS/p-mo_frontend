"use client";
import { useEffect, useState } from 'react';
import { Alert, Button, Input, Popover, PopoverContent, PopoverTrigger, RangeCalendar } from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import NewProject from "./NewProject";
import { FolderLinksIcon, MoreVerticalIcon, StructureFailIcon } from "hugeicons-react";
import Link from 'next/link';
import { I18nProvider } from '@react-aria/i18n';
import { parseDate } from '@internationalized/date';
import ProjectsSkeletons from '@/app/_lib/components/skeletons/ProjectsSkeletons';
import { useUser } from '@/contexts/UserContext';
import { useProject } from '@/contexts/ProjectContext';
import { useAlert } from '@/contexts/AlertContext';
import EditProject from './EditProject';

export default function ProjectsPage() {
    const { alertTitle, alertDescription, alertVisible, alertColor, hideAlert } = useAlert();
    const { user, fetchUser } = useUser();
    const { projects, fetchProjects } = useProject();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!user) {
                    const userId = JSON.parse(localStorage.getItem('user') || '{}').ID_Usuario;
                    await fetchUser(userId);
                }
                await fetchProjects();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [user, fetchUser, fetchProjects, projects]); // Añadir 'projects' como dependencia

    const isLoadingProjects = !projects || projects.length === 0;

    if (!user) {
        return (
            <ProjectsSkeletons />
        );
    }
    if (!Array.isArray(projects)) {
        return (
            <ProjectsSkeletons />
        );
    }

    const isAdmin = user?.Roles?.some(role => role.ID_Rol === 1) ?? false;
    const isTeacher = user?.Roles?.some(role => role.ID_Rol === 2) ?? false;
    const isStudent = user?.Roles?.some(role => role.ID_Rol === 3) ?? false;

    const filteredProjects = projects.filter((project) =>
        project.Código_Proyecto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="flex flex-col p-6 h-auto">
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
                    {isAdmin && <NewProject />}
                </div>
            </section>
            <section className="flex flex-wrap mt-4 gap-8">
                {isLoadingProjects ? (
                    <ProjectsSkeletons />
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <div
                            className="flex flex-col w-fit gap-2"
                            key={project.ID_Proyecto}
                        >
                            <div className="flex">
                                <Link
                                    href={`/projects/${project.Código_Proyecto}`}
                                    className={`flex w-full items-center gap-2 ${isAdmin ? "rounded-l-lg" : ""
                                        } ${isTeacher || isStudent
                                            ? "rounded-lg"
                                            : "none"
                                        } bg-secondary p-2`}
                                >
                                    <FolderLinksIcon size={30} />
                                    <span>
                                        {project["Código_Proyecto"]}
                                    </span>
                                </Link>
                                {isAdmin && (
                                    <Popover placement="right">
                                        <PopoverTrigger>
                                            <Button
                                                className="min-w-0 p-2 items-center rounded-r-lg"
                                                size="lg"
                                                radius="none"
                                                color="secondary"
                                            >
                                                <MoreVerticalIcon size={30} color="#FFF" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="flex flex-col gap-2 p-1">
                                                <EditProject project={project}/>
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
                                    minValue={parseDate(project.Fecha_Inicio || '')}
                                    maxValue={parseDate(project.Fecha_Fin || '')}
                                    defaultValue={{
                                        start: parseDate(project.Fecha_Inicio || ''),
                                        end: parseDate(project.Fecha_Fin || ''),
                                    }}
                                />
                            </I18nProvider>
                        </div>
                    ))
                ) : (
                    <div className="h-screen w-screen flex flex-col justify-center items-center">
                        <StructureFailIcon size={70} />
                        <p className="text-5xl">
                            No se encontraron coincidencias.
                        </p>
                    </div>
                )}
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
        </section>
    );
}