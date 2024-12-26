"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, DateRangePicker } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { parseDate, isWeekend, DateValue } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import type { Space } from "@/types/Space";

type Project = {
    ID_Proyecto: number;
    Código_Proyecto: string;
    Fecha_Inicio: string;
    Fecha_Fin: string;
};

type NewSpaceProps = {
    params: { Código_Proyecto: string };
    onNewSpace: (space: Space) => void;
};
type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
};

type User = {
    ID_Usuario: number;
    Roles: Role[];
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil: string;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function NewSpace({ params, onNewSpace }: NewSpaceProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [project, setProject] = useState<Project | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [namespace, setNamespace] = useState<string>("");
    const [dateRange, setDateRange] = useState<{ start: DateValue | null; end: DateValue | null }>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0])
    });
    const [registrationRange, setRegistrationRange] = useState<{ start: DateValue | null; end: DateValue | null }>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0])
    });
    const [limitspace, setLimitspace] = useState<number | null>(null);
    const [limitMessage, setLimitMessage] = useState<string>("");
    const [registered, setRegistered] = useState<File | null>(null);
    const [namespaceError, setNamespaceError] = useState<string>("");

    const fetchProjectByCode = async (code: string): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        try {
            const response = await fetch(`${backendUrl}/projects`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Error al obtener los proyectos');
            const data = await response.json();
            const projects: Project[] = data.data;
            const foundProject = projects.find((p) => p.Código_Proyecto === code);
            setProject(foundProject || null);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    const fetchUser = async (): Promise<void> => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        try {
            const response = await fetch(`${backendUrl}/user`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Error al obtener los datos del usuario');
            const data = await response.json();
            setUser(data.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchProjectByCode(params.Código_Proyecto);
        fetchUser();
    }, [params.Código_Proyecto]);

    const handleNamespaceChange = (value: string) => {
        if (/\s/.test(value)) {
            setNamespaceError("El nombre no puede contener espacios.");
        } else {
            setNamespaceError("");
        }
        setNamespace(value);
    };

    const handleFileChange = (newFile: File | null) => {
        if (newFile && newFile.type !== "application/pdf") {
            setLimitMessage("Solo se aceptan archivos PDF");
            setRegistered(null);
        } else {
            setLimitMessage("");
            setRegistered(newFile);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !project || !user) {
            console.error("Missing required data");
            return;
        }

        const formData = new FormData();
        formData.append("namespace", namespace);
        formData.append("startspace", dateRange.start ? dateRange.start.toString() : "");
        formData.append("endspace", dateRange.end ? dateRange.end.toString() : "");
        formData.append("starregistrationspace", registrationRange.start ? registrationRange.start.toString() : "");
        formData.append("endregistrationspace", registrationRange.end ? registrationRange.end.toString() : "");
        formData.append("limitspace", limitspace !== null ? limitspace.toString() : "");
        formData.append("idproject", project.ID_Proyecto.toString());
        formData.append("iduser", user.ID_Usuario.toString());
        if (registered) {
            formData.append("registered", registered);
        }

        try {
            const response = await fetch(`${backendUrl}/spaces`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al crear el espacio");
            }

            const result = await response.json();
            // Asegúrate de que result.data incluye created_at y updated_at
            const newSpace: Space = {
                ...result.data,
                created_at: result.data.created_at || new Date().toISOString(),
                updated_at: result.data.updated_at || new Date().toISOString()
            };

            onNewSpace(newSpace);
            onOpenChange();
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
                                        minValue={project ? parseDate(project.Fecha_Inicio) : undefined}
                                        maxValue={project ? parseDate(project.Fecha_Fin) : undefined}
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
                                        minValue={project ? parseDate(project.Fecha_Inicio) : undefined}
                                        maxValue={project ? parseDate(project.Fecha_Fin) : undefined}
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
                                    <FileUpload onChange={handleFileChange} />
                                    {limitMessage && <p className="text-red-500 text-sm mt-1">{limitMessage}</p>}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-[#FF9B5A] text-white text-lg font-bold"
                                    isDisabled={!namespace || namespaceError !== "" || !registered || registered?.type !== "application/pdf" || limitspace === null || limitspace < 2}
                                >
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