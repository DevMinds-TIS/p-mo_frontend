import ErrorModal from "@/app/mensajes"; // Import the ErrorModal
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    RangeValue,
    DateValue,
} from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
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

export default function NewProject({ onNewProject }: NewProjectProps) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const currentYear = new Date().getFullYear();
    const minDate = parseDate(`${currentYear}-01-01`);
    const maxDate = parseDate(`${currentYear}-12-31`);

    const [user, setUser] = useState<User | null>(null);

    const [projectName, setProjectName] = useState("");
    const [projectCode, setProjectCode] = useState("");
    const [dateRange, setDateRange] = useState<{ value: RangeValue<DateValue> | null }>({
        value: { start: parseDate(new Date().toISOString().split('T')[0]), end: parseDate(new Date().toISOString().split('T')[0]) },
    });
    const [invitationFile, setInvitationFile] = useState<File | null>(null);
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);
    const [invitationError, setInvitationError] = useState<string | null>(null); // Error for invitation file
    const [specificationError, setSpecificationError] = useState<string | null>(null); // Error for specification file
    const [message, setMessage] = useState<string | null>(null); // State for success or error messages

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

    const handleFileValidation = (file: File | null, setError: React.Dispatch<React.SetStateAction<string | null>>): File | null => {
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Solo se permiten archivos en formato PDF.");
                return null;
            } else {
                setError(null);
                return file;
            }
        }
        return null;
    };

    const handleInvitationFileChange = (newFile: File | null) => {
        setInvitationFile(handleFileValidation(newFile, setInvitationError));
    };

    const handleSpecificationFileChange = (newFile: File | null) => {
        setSpecificationFile(handleFileValidation(newFile, setSpecificationError));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Error: No se encontró el token de autenticación.");
            return;
        }
        const formData = new FormData();
        formData.append("iduser", user?.ID_Usuario.toString() || "");
        formData.append("nameproject", projectName);
        formData.append("codeproject", projectCode);

        const startProjectDate = dateRange?.value?.start ? new Date(dateRange?.value?.start.toString()) : null;
        const endProjectDate = dateRange?.value?.end ? new Date(dateRange?.value?.end.toString()) : null;

        const termProject = calculateTermProject(startProjectDate, endProjectDate);

        formData.append("startproject", startProjectDate ? startProjectDate.toISOString().split("T")[0] : "");
        formData.append("endproject", endProjectDate ? endProjectDate.toISOString().split("T")[0] : "");
        formData.append("termproject", termProject);

        if (invitationFile) formData.append("invitation", invitationFile);
        if (specificationFile) formData.append("specification", specificationFile);

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
            setMessage("Se creó el proyecto de forma exitosa."); // Show success message
            onOpenChange(); // Close modal
        } catch (error) {
            console.error("Error al crear el proyecto:", error);
            setMessage("Error al crear el proyecto."); // Show error message
        }
    };

    const calculateTermProject = (startProjectDate: Date | null, endProjectDate: Date | null): string => {
        if (!startProjectDate || !endProjectDate) return "";

        const year = startProjectDate.getFullYear();
        const startMonth = startProjectDate.getMonth() + 1;
        const endMonth = endProjectDate.getMonth() + 1;

        if (startMonth <= 6 && endMonth <= 6) {
            return `1/${year}`;
        } else if (startMonth >= 7 && endMonth >= 7) {
            return `2/${year}`;
        } else {
            return `Span/${year}`;
        }
    };

    const [namespaceError, setNamespaceError] = useState<string>(""); // Estado para mensaje de error del nombre
    
    const handleNamespaceChange = (value: string) => {
        if (/\s/.test(value)) {
            setNamespaceError("El código no puede contener espacios.");
        } else {
            setNamespaceError("");
        }
        setProjectCode(value);
    };

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
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
                                        onChange={(e) => handleNamespaceChange(e.target.value)}
                                    />
                                    {namespaceError && <p className="text-red-500 text-sm mt-1">{namespaceError}</p>}
                                    <I18nProvider locale="es-BO">
                                        <DateRangePicker
                                            allowsNonContiguousRanges
                                            label="Duración del proyecto"
                                            minValue={minDate}
                                            maxValue={maxDate}
                                            visibleMonths={3}
                                            pageBehavior="single"
                                            onChange={(value) => setDateRange({ value })}
                                        />
                                    </I18nProvider>
                                    <div className="space-y-2">
                                        <p>Invitación del proyecto</p>
                                        <FileUpload onChange={handleInvitationFileChange} />
                                        {invitationError && <p className="text-red-500 text-sm mt-1">{invitationError}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <p>Pliego de especificaciones del proyecto</p>
                                        <FileUpload onChange={handleSpecificationFileChange} />
                                        {specificationError && <p className="text-red-500 text-sm mt-1">{specificationError}</p>}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#2E6CB5] text-white text-lg font-bold"
                                        isDisabled={
                                            !projectCode || // Código del proyecto vacío
                                            namespaceError !== "" || // Error en el código (espacios u otros)
                                            invitationError !== null || // Error en archivo de invitación
                                            specificationError !== null || // Error en archivo de especificaciones
                                            invitationFile?.type !== "application/pdf" || // Archivo de invitación no es PDF
                                            specificationFile?.type !== "application/pdf" // Archivo de especificaciones no es PDF
                                        }
                                    >
                                        Crear
                                    </Button>
                                </ModalFooter>
                            </form>
                        </div>
                    )}
                </ModalContent>
            </Modal>
            {message && (
                <ErrorModal
                    message={message}
                    onClose={() => setMessage(null)} // Clear the message on close
                    className="z-100"
                />
            )}
        </section>
    );
}
