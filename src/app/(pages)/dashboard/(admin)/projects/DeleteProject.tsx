import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { AddSquareIcon, Delete02Icon, PencilEdit02Icon } from "hugeicons-react";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { isWeekend } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";

type Project = {
    ID_Proyecto: number;
    Código_Proyecto: string;
    Fecha_Inicio: string;
    Fecha_Fin: string;
};

type User = {
    data: User;
    ID_Usuario: number;
};

type NewProjectProps = {
    onNewProject: (project: Project) => void;
};

export default function DeleteProject({ onNewProject }: NewProjectProps) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const currentYear = new Date().getFullYear();
    const minDate = parseDate(`${currentYear}-01-01`);
    const maxDate = parseDate(`${currentYear}-12-31`);

    const [user, setUser] = useState<User | null>(null);

    const [projectName, setProjectName] = useState("");
    const [projectCode, setProjectCode] = useState("");
    const [dateRange, setDateRange] = useState<{ start: string | null, end: string | null }>({ start: null, end: null });
    const [invitationFile, setInvitationFile] = useState<File | null>(null);
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/user`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los datos del usuario");
                }

                const data = await response.json();
                setUser(data.data);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            }
        };
        fetchUserData();
    }, [backendUrl]);

    const handleInvitationFileChange = (newFile: File | null) => {
        setInvitationFile(newFile);
    };

    const handleSpecificationFileChange = (newFile: File | null) => {
        setSpecificationFile(newFile);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        const formData = new FormData();
        formData.append("iduser", user?.ID_Usuario.toString() || "");
        formData.append("nameproject", projectName);
        formData.append("codeproject", projectCode);
        formData.append("startproject", dateRange.start ? new Date(dateRange.start).toISOString().split('T')[0] : "");
        formData.append("endproject", dateRange.end ? new Date(dateRange.end).toISOString().split('T')[0] : "");
        const documents = [
            { file: invitationFile, field: "invitation" },
            { file: specificationFile, field: "specification" }
        ];
        documents.forEach(document => {
            if (document.file) {
                formData.append(document.field, document.file);
            }
        });
        try {
            const response = await fetch(`${backendUrl}/projects`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Error al crear el proyecto");
            }
            const result = await response.json();
            console.log("Proyecto creado exitosamente:", result);
            onNewProject(result.data);
            onOpenChange();
        } catch (error) {
            console.error("Error al crear el proyecto:", error);
        }
    };

    return (
        <section>
            <Button
                onPress={onOpen}
                className="transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-red-700 bg-transparent w-full"
                startContent={<Delete02Icon />}
            >
                Eliminar proyecto
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear proyecto</ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    <Input
                                        label="Nombre del proyecto"
                                        placeholder="Escribe el nombre del proyecto"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                    <Input
                                        label="Código del proyecto"
                                        placeholder="Escribe el código del proyecto"
                                        value={projectCode}
                                        onChange={(e) => setProjectCode(e.target.value)}
                                    />
                                    <I18nProvider locale="es-BO">
                                        <DateRangePicker
                                            allowsNonContiguousRanges
                                            label="Duración del proyecto"
                                            minValue={minDate}
                                            maxValue={maxDate}
                                            visibleMonths={3}
                                            pageBehavior="single"
                                            onChange={(range) => setDateRange({ start: range.start.toString(), end: range.end.toString() })}
                                        />
                                    </I18nProvider>
                                    <div className="space-y-2">
                                        <p>Invitación del proyecto</p>
                                        <FileUpload onChange={handleInvitationFileChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <p>Pliego de especificaciones del proyecto</p>
                                        <FileUpload onChange={handleSpecificationFileChange} />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="submit" className="w-full">
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}