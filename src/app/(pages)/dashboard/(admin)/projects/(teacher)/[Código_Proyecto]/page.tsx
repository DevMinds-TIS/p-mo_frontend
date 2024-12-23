'use client';
import { Card, CardHeader, Avatar, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import NewSpace from "./NewSpace";
import Link from "next/link";
import Avisos from "./Avisos";

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
}

type Document = {
    ID_Documento: number;
    ID_Proyecto: number;
    Ruta_Documento: string;
    Nombre_Documento: string;
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

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

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

const fetchDocumentsByProjectId = async (projectId: number): Promise<Document[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/documents`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener los documentos');
    const data = await response.json();
    const documents: Document[] = data.data;

    return documents.filter((document) => document.ID_Proyecto === projectId);
};

const fetchSpacesByProjectId = async (projectId: number): Promise<Space[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${backendUrl}/spaces`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener los espacios');

    const data = await response.json();
    const spaces: Space[] = data.data.filter((space: Space) => space.ID_Proyecto === projectId);

    for (const space of spaces) {
        if (space.ID_Usuario) {
            const userResponse = await fetch(`${backendUrl}/users/${space.ID_Usuario}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (userResponse.ok) {
                const userData: User = await userResponse.json();
                space.Usuario = userData.data;
            }
        }
    }
    return spaces;
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

    const data: User = await response.json();
    return data.data;
};

export default function ProjectPage({ params }: { params: { Código_Proyecto: string } }) {
    const [project, setProject] = useState<Project | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
    const [isLoadingSpaces, setIsLoadingSpaces] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await fetchProjectByCode(params.Código_Proyecto);
                if (projectData) {
                    setProject(projectData);
                    const documentData = await fetchDocumentsByProjectId(projectData.ID_Proyecto);
                    setDocuments(documentData);
                    setIsLoadingDocuments(false);
                    const spaceData = await fetchSpacesByProjectId(projectData.ID_Proyecto);
                    setSpaces(spaceData);
                    setIsLoadingSpaces(false);
                } else {
                    console.error('No se encontró el proyecto con el código proporcionado');
                }
            } catch (error) {
                console.error('Error al obtener los datos del proyecto o documentos:', error);
            }
        };
        fetchData();
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        fetchUserData();
    }, [params.Código_Proyecto]);

    if (!user) {
        return (
            <section className="flex flex-col gap-y-8">
                <section>
                    <h1 className="text-3xl">
                        Documentos
                    </h1>
                    <div className="p-4 flex flex-wrap gap-4 justify-center">
                        {[...Array(2)].map((_, index) => (
                            <Skeleton key={index} className="h-72 w-60 rounded-xl" />
                        ))}
                    </div>
                </section>
                <section className="flex w-full h-10 justify-between items-center">
                    <h1 className="text-3xl">Espacios</h1>
                    <Skeleton className="w-8 h-8 rounded-lg" />
                </section>
                <section className="flex flex-wrap gap-4 p-4">
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} className="w-60 h-28 rounded-xl" />
                    ))}
                </section>
            </section>
        );
    }

    const isTeacher = user?.Roles?.some(role => role.ID_Rol === 2) ?? false;
    const isAdmin = user?.Roles?.some(role => role.ID_Rol === 1) ?? false;

    const handleNewSpace = async (newSpace: Space) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const userResponse = await fetch(`${backendUrl}/users/${newSpace.ID_Usuario}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!userResponse.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }

            const userData: { data: User } = await userResponse.json();
            newSpace.Usuario = userData.data;

            setSpaces((prevSpaces) => [...prevSpaces, newSpace]);
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    };

    return (
        <section className="flex flex-col gap-y-8">
            <section>
                <h1 className="text-3xl">Documentos</h1>
                <div className="p-4 flex flex-wrap gap-4 justify-center">
                    {isLoadingDocuments ? (
                        [...Array(2)].map((_, index) => (
                            <Skeleton key={index} className="h-72 w-60 rounded-xl" />
                        ))
                    ) : (
                        documents.map((document) => (
                            <Card
                                className="h-72 w-60"
                                shadow="sm"
                                isPressable
                                key={document.ID_Documento}
                                onClick={async () => {
                                    const token = localStorage.getItem('token');
                                    if (!token) {
                                        console.error('No token found');
                                        return;
                                    }
                                    const response = await fetch(`${backendUrl}/documents/${document.ID_Documento}`, {
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                        },
                                    });
                                    if (!response.ok) {
                                        console.error('Error al obtener el documento');
                                        return;
                                    }
                                    const blob = await response.blob();
                                    const url = URL.createObjectURL(blob);
                                    window.open(url, '_blank');
                                }}
                            >
                                <CardBody className="overflow-visible p-0 w-full h-full">
                                    <FileUpload
                                        onChange={(file) => console.log("File changed:", file)}
                                        existingFile={{ name: document.Nombre_Documento, url: `${storageUrl}/${document.Ruta_Documento}` }}
                                        readOnly={true}
                                        className="h-full w-full"
                                    />
                                </CardBody>
                                <CardFooter>{document.Nombre_Documento}</CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </section>
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Espacios</h1>
                {isTeacher && project && user && (
                    <NewSpace params={{ Código_Proyecto: project.Código_Proyecto }} onNewSpace={handleNewSpace} />
                )}
            </section>
            <section className="flex flex-wrap gap-4 p-4">
                {isLoadingSpaces ? (
                    [...Array(4)].map((_, index) => (
                        <Skeleton key={index} className="w-60 h-28 rounded-xl" />
                    ))
                ) : (
                    spaces.map(space => (
                        <Link href={`${project?.Código_Proyecto}/${space.Nombre_Espacio}`} key={space.ID_Espacio}>
                            <Card className="w-fit">
                                <CardHeader className="justify-between">
                                    <div className="flex gap-5">
                                        <Avatar
                                            name={`${space.Usuario?.Nombre?.[0] || ""}${space.Usuario?.Apellido?.[0] || ""}`}
                                            src={space.Usuario?.Perfil ? `${storageUrl}/${space.Usuario.Perfil}` : undefined}
                                            isBordered
                                            radius="full"
                                            size="md"
                                        />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            {space.Usuario && (
                                                <div>
                                                    <h4 className="text-small font-semibold leading-none text-default-600">
                                                        {`${space.Usuario.Nombre} ${space.Usuario.Apellido}`}
                                                    </h4>
                                                    <h5 className="text-small tracking-tight text-default-400">
                                                        {space.Usuario.Correo}
                                                    </h5>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardFooter className="gap-3">
                                    <div className="flex gap-1 justify-between w-full">
                                        <p className="font-semibold text-default-400 text-small">{space.Nombre_Espacio}</p>
                                        <p className="font-semibold text-default-400 text-small">{space.Inscritos}</p>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))
                )}
            </section>
            <Avisos isAdmin={true} userType="admin" />
        </section>
    );
}