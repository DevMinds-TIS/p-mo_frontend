"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, DateRangePicker, RangeValue } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { parseDate, isWeekend, DateValue } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import { useUser } from '@/contexts/UserContext';
import { useProject } from '@/contexts/ProjectContext';
import { useSpaceContext } from '@/contexts/SpaceContext';
import { Space } from "@/types/Space";
import { Project } from "@/types/Project";

type NewSpaceProps = {
    params: { Código_Proyecto: string };
    onNewSpace: (space: Space) => void;
};

export default function NewSpace({ params, onNewSpace }: NewSpaceProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { user, fetchUser } = useUser();
    const { projects, fetchProjects } = useProject();
    const { addSpace } = useSpaceContext();
    const [project, setProject] = useState<Project | null>(null);
    const [namespace, setNamespace] = useState<string>("");
    const [dateRange, setDateRange] = useState<{ start: DateValue | null, end: DateValue | null }>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0])
    });
    const [registrationRange, setRegistrationRange] = useState<{ start: DateValue | null, end: DateValue | null }>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0])
    });
    const [limitspace, setLimitspace] = useState<number | null>(null);
    const [limitMessage, setLimitMessage] = useState<string>("");
    const [registered, setRegistered] = useState<File | null>(null);
    const [namespaceError, setNamespaceError] = useState<string>("");

    const handleNamespaceChange = (value: string) => {
        if (/\s/.test(value)) {
            setNamespaceError("El nombre no puede contener espacios.");
        } else {
            setNamespaceError("");
        }
        setNamespace(value);
    };

    const handleFileChange = (newFile: File | null) => {
        setRegistered(newFile);
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchUser(Number(userId));
        }
        fetchProjects();
    }, [fetchUser, fetchProjects]);

    useEffect(() => {
        const selectedProject = projects?.find(p => p.Código_Proyecto === params.Código_Proyecto);
        setProject(selectedProject ?? null);
    }, [projects, params.Código_Proyecto]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user || !project) {
            console.error("No user or project found");
            return;
        }

        const newSpace: Space = {
            ID_Espacio: 0, // ID generado por el backend
            ID_Proyecto: project.ID_Proyecto,
            ID_Usuario: user.ID_Usuario,
            Nombre_Espacio: namespace,
            Inscritos: 0, // Se puede ajustar según la lógica
            Fecha_Inicio: dateRange.start ? dateRange.start.toString() : "",
            Fecha_Fin: dateRange.end ? dateRange.end.toString() : "",
            Límite_Espacio: limitspace ?? 0,
            Fecha_Inicio_Registro: registrationRange.start ? registrationRange.start.toString() : "",
            Fecha_Fin_Registro: registrationRange.end ? registrationRange.end.toString() : "",
            created_at: "", // Se completa en el backend
            updated_at: ""  // Se completa en el backend
        };

        try {
            addSpace(newSpace);
            onOpenChange();
            onNewSpace(newSpace);
        } catch (error) {
            console.error("Error al crear el espacio:", error);
        }
    };

    const handleLimitspaceChange = (value: string) => {
        const numValue = Number(value);
        if (numValue < 2) {
            setLimitMessage("El límite de integrantes debe ser al menos 2");
        } else {
            setLimitMessage("");
            setLimitspace(numValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "e" || e.key === "E") {
            e.preventDefault();
        }
    };

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">Crear espacio</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Nombre del espacio"
                                    placeholder="Digite el nombre del espacio"
                                    value={namespace}
                                    onChange={(e) => handleNamespaceChange(e.target.value)}
                                    className="mb-2"
                                />
                                {namespaceError && <p className="text-red-500 text-sm mt-1">{namespaceError}</p>}
                                <I18nProvider locale="es-BO">
                                    <DateRangePicker
                                        allowsNonContiguousRanges
                                        isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                                        label="Duración del proyecto"
                                        labelPlacement="outside"
                                        visibleMonths={3}
                                        pageBehavior="single"
                                        value={{
                                            start: dateRange.start ?? parseDate(new Date().toISOString().split('T')[0]),
                                            end: dateRange.end ?? parseDate(new Date().toISOString().split('T')[0])
                                        }}
                                        onChange={(range) => setDateRange({ start: range?.start ?? null, end: range?.end ?? null })}
                                        minValue={project ? parseDate(project.Fecha_Inicio ?? '') : undefined}
                                        maxValue={project ? parseDate(project.Fecha_Fin ?? '') : undefined}
                                    />
                                </I18nProvider>
                                <I18nProvider locale="es-BO">
                                    <DateRangePicker
                                        allowsNonContiguousRanges
                                        isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                                        label="Fase de inscripciones (estudiantes y equipos)"
                                        labelPlacement="outside"
                                        visibleMonths={2}
                                        pageBehavior="single"
                                        value={{
                                            start: registrationRange.start ?? parseDate(new Date().toISOString().split('T')[0]),
                                            end: registrationRange.end ?? parseDate(new Date().toISOString().split('T')[0])
                                        }}
                                        onChange={(range) => setRegistrationRange({ start: range?.start ?? null, end: range?.end ?? null })}
                                        minValue={project ? parseDate(project.Fecha_Inicio ?? '') : undefined}
                                        maxValue={project ? parseDate(project.Fecha_Fin ?? '') : undefined}
                                    />
                                </I18nProvider>
                                <Input
                                    label="Límite de integrantes"
                                    placeholder="Digite el límite de integrantes para sus equipos"
                                    type="number"
                                    value={limitspace !== null ? limitspace.toString() : ""}
                                    onChange={(e) => handleLimitspaceChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    errorMessage={limitMessage}
                                />
                                <div>
                                    <p>Lista de alumnos</p>
                                    <FileUpload
                                        onChange={(newFile: File | null) => {
                                            if (newFile && newFile.type !== "application/pdf") {
                                                setLimitMessage("Solo se aceptan archivos PDF");
                                                setRegistered(null);
                                            } else {
                                                setLimitMessage("");
                                                setRegistered(newFile);
                                            }
                                        }}
                                    />
                                    {limitMessage && <p className="text-red-500 text-sm mt-1">{limitMessage}</p>}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" color="primary" className="w-full h-12" isDisabled={!namespace || namespaceError !== "" || !registered || registered?.type !== "application/pdf" || limitspace === null || limitspace < 2}>
                                    Crear espacio
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}