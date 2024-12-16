import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, DateRangePicker } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { parseDate, isWeekend, DateValue } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import ErrorModal from "@/app/mensajes"; // Import the ErrorModal

type Project = {
    ID_Proyecto: number;
    Código_Proyecto: string;
    Fecha_Inicio: string;
    Fecha_Fin: string;
};

type Space = {
    ID_Espacio: number;
    ID_Proyecto: number;
    ID_Usuario: number;
    Nombre_Espacio: string;
    Usuario: User;
    Inscritos: number;
};

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
};

type User = {
    data: User;
    ID_Usuario: number;
    Roles: Role[];
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil: string;
};

type NewSpaceProps = {
    params: { Código_Proyecto: string };
    onNewSpace: (space: Space) => void;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchProjectByCode = async (code: string): Promise<Project | null> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/projects`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener los proyectos');
    const data = await response.json();
    const projects: Project[] = data.data;

    const project = projects.find((project) => project.Código_Proyecto === code);
    return project || null;
};

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
    const data = await response.json();
    return data.data;
};

export default function NewSpace({ params, onNewSpace }: NewSpaceProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [project, setProject] = useState<Project | null>(null);
    const [namespace, setNamespace] = useState<string>("");
    const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue }>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });
    const [registrationRange, setRegistrationRange] = useState<{ start: DateValue; end: DateValue }>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });
    const [limitspace, setLimitspace] = useState<number | null>(null);
    const [limitMessage, setLimitMessage] = useState<string>("");
    const [registered, setRegistered] = useState<File | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>(""); // State for success message
    const [errorMessage, setErrorMessage] = useState<string>(""); // State for error message

    const handleFileChange = (newFile: File | null) => {
        setRegistered(newFile);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await fetchProjectByCode(params.Código_Proyecto);
                setProject(projectData);

                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error('Error al obtener los datos del proyecto o usuario:', error);
            }
        };
        fetchData();
    }, [params.Código_Proyecto]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        const formData = new FormData();
        formData.append("namespace", namespace);
        formData.append("startspace", dateRange.start ? dateRange.start.toString() : "");
        formData.append("endspace", dateRange.end ? dateRange.end.toString() : "");
        formData.append("starregistrationspace", registrationRange.start ? registrationRange.start.toString() : "");
        formData.append("endregistrationspace", registrationRange.end ? registrationRange.end.toString() : "");
        formData.append("limitspace", limitspace !== null ? limitspace.toString() : "");
        if (project) {
            formData.append("idproject", project.ID_Proyecto.toString());
        }
        if (user) {
            formData.append("iduser", user.ID_Usuario.toString());
        }
        if (registered) {
            formData.append("registered", registered);
        }
        console.log(formData);
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
            console.log("Espacio creado exitosamente:", result.data);
            onNewSpace(result.data);
            setSuccessMessage("Espacio creado exitosamente."); // Set success message
            onOpenChange();
        } catch (error) {
            console.error("Error al crear el espacio:", error);
            setErrorMessage("Error al crear el espacio."); // Set error message
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
                                    onChange={(e) => setNamespace(e.target.value)}
                                />
                                <I18nProvider locale="es-BO">
                                    <DateRangePicker
                                        allowsNonContiguousRanges
                                        isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                                        label="Duración del proyecto"
                                        labelPlacement="outside"
                                        visibleMonths={3}
                                        pageBehavior="single"
                                        onChange={setDateRange}
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
                                        onChange={setRegistrationRange}
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
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-[#FF9B5A] text-white text-lg font-bold"
                                    isDisabled={
                                        !namespace || // Nombre del espacio vacío
                                        !registered || // Archivo no cargado
                                        registered?.type !== "application/pdf" || // Archivo no es PDF
                                        limitspace === null || // Límite no definido
                                        limitspace < 2 // Límite menor que 2
                                    }
                                >
                                    Crear
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
            
            {/* Display success or error messages */}
            {successMessage && (
                <ErrorModal
                    message={successMessage}
                    onClose={() => setSuccessMessage('')} // Clear success message on close
                    className="z-100"
                />
            )}
            {errorMessage && (
                <ErrorModal
                    message={errorMessage}
                    onClose={() => setErrorMessage('')} // Clear error message on close
                    className="z-100"
                />
            )}
        </section>
    );
}
