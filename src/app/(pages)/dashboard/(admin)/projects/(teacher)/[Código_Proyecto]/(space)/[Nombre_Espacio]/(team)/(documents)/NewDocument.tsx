import { FileUpload } from "@/app/_lib/components/FileUpload";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { useState, useEffect } from "react";

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
    Icono_Rol: string;
};

type User = {
    data: User;
    ID_Usuario: number;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil?: string;
    Roles: Role[];
    Docente?: User;
};

type Team = {
    ID_Equipo: number;
    ID_Usuario: number;
    ID_Espacio: number;
    Nombre_Equipo: string;
    Razón_Social: string;
    Correo_Equipo: string;
    Logo_Equipo: string;
    Repositorio_Equipo: string;
    Despliegue_Local: string;
    Despliegue_Externo: string;
};

type Tracking = {
    ID_Seguimiento: number;
    ID_Usuario: number;
    ID_Estado: number;
    ID_Equipo: number;
    Nombre_Tracking: string;
    Fecha_Entrega: string;
    Fecha_Devolución: string;
    Comentario_Tracking: string;
};

type Document = {
    ID_Documento: number;
    ID_Seguimiento: number;
    ID_Equipo: number;
    Ruta_Documento: string;
    Nombre_Documento: string;
};

interface NewDocumentProps {
    onNewDocument: (document: Document) => void;
    params: { Nombre_Equipo: string };
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchTeamByName = async (name: string): Promise<Team | null> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/teams`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Error al obtener los equipos');

    const data = await response.json();
    const teams: Team[] = data.data;

    const team = teams.find((team) => team.Nombre_Equipo === name);
    return team || null;
};

export default function NewDocument({ params, onNewDocument }: NewDocumentProps){
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [document, setDocument] = useState<File | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
    const [documentName, setDocumentName] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTeam = await fetchTeamByName(params.Nombre_Equipo);
                setTeam(fetchedTeam);
            } catch (error) {
                console.error('Error al obtener el equipo:', error);
            }
        };

        fetchData();

        fetchData();
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            try {
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
                setUser(data.data);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };
        fetchUserData();
    }, [params.Nombre_Equipo]);

    const handleFileChange = (newFile: File | null) => {
        setDocument(newFile);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!team || !document) {
            console.error('Equipo o documento no disponible');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        const formData = new FormData();
        formData.append("idteam", team.ID_Equipo.toString());
        formData.append("nametracking", documentName);
        if (user) {
            formData.append("iduser", user.ID_Usuario.toString());
        }
        formData.append("deliverytracking", new Date().toISOString().split('T')[0]);
        formData.append("document", document);

        try {
            const response = await fetch(`${backendUrl}/trackings`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al crear el seguimiento");
            }

            const result = await response.json();
            console.log("Seguimiento creado exitosamente:", result);
            onNewDocument(result.data);
            onOpenChange(); // Cerrar el modal

        } catch (error) {
            console.error("Error al crear el seguimiento:", error);
        }
    };

    return(
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center" size="xl">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">Entregar documentación</ModalHeader>
                            <ModalBody>
                                <Input
                                    type="text"
                                    label="Nombre del documento"
                                    placeholder="Escribe el nombre del documento"
                                    maxLength={90}
                                    value={documentName}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                />
                                <div>
                                    <p>Documento a entregar</p>
                                    <FileUpload onChange={handleFileChange} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" className="w-full h-12 bg-[#FF9B5A] text-white text-lg font-bold">
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}