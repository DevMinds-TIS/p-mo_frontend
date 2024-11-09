'use client';
import { Card, CardHeader, Avatar, CardBody, CardFooter, Image, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import NewSpace from "./NewSpace";

type Project = {
    ID_Proyecto: number;
    Código: string;
    Fecha_Inicio: Date;
    Fecha_Fin: Date;
};

type Document = {
    ID_Documento: number;
    ID_Proyecto: number;
    Dirección: string;
    Nombre: string;
};

type Role = {
    idroleuser: number;
    idrol: number;
};

type User = {
    ID_Usuario: number;
    roles: Role[];
    Nombre: string;
    Apellido: string;
};

// Tu componente
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

console.log(backendUrl);
console.log(storageUrl);

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

    const project = projects.find((project) => project.Código === code);
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
    return data;
};


export default function ProjectPage({ params }: { params: { Código: string } }) {
    const [project, setProject] = useState<Project | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await fetchProjectByCode(params.Código);
                if (projectData) {
                    setProject(projectData);
                    const documentData = await fetchDocumentsByProjectId(projectData.ID_Proyecto);
                    setDocuments(documentData);
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
    }, [params.Código]);

    if (documents.length === 0 || !user) {
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
                    <Skeleton className="w-10 h-10 rounded-lg" />
                </section>
                <section className="flex flex-wrap gap-4 p-4">
                    <Skeleton className="w-60 h-28 rounded-xl" />
                    <Skeleton className="w-60 h-28 rounded-xl" />
                    <Skeleton className="w-60 h-28 rounded-xl" />
                    <Skeleton className="w-60 h-28 rounded-xl" />
                </section>
            </section>);
    }

    const isTeacher = user.roles.some(role => role.idrol === 2);

    return (
        <section className="flex flex-col gap-y-8">
            <section>
                <h1 className="text-3xl">Documentos</h1>
                <div className="p-4 flex flex-wrap gap-4 justify-center">
                    {documents.map((document) => (
                        <Card className="h-72 w-60" shadow="sm" isPressable key={document.ID_Documento} onClick={async () => {
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
                        }}>
                            <CardBody className="overflow-visible p-0 w-full h-full">
                                <FileUpload
                                    onChange={(file) => console.log("File changed:", file)}
                                    existingFile={{ name: document.Nombre, url: `${storageUrl}/${document.Dirección}` }}
                                    readOnly={true}
                                />
                            </CardBody>
                            <CardFooter>{document.Nombre}</CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Espacios</h1>
                {isTeacher && project && user &&
                    <NewSpace
                        params={{ ID_Proyecto: project.ID_Proyecto }}
                        startDate={project.Fecha_Inicio}
                        endDate={project.Fecha_Fin}
                    />
                }
            </section>
            <section className="flex flex-wrap gap-4 p-4">
                <Link href={"spaces/teams"}>
                    <Card className="w-fit">
                        <CardHeader className="justify-between">
                            <div className="flex gap-5">
                                <Avatar isBordered radius="full" size="md" src="https://nextui.org/avatars/avatar-1.png" />
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-semibold leading-none text-default-600">Zoey Lang</h4>
                                    <h5 className="text-small tracking-tight text-default-400">@zoeylang</h5>
                                </div>
                            </div>
                        </CardHeader>
                        <CardFooter className="gap-3">
                            <div className="flex gap-1">
                                <p className="font-semibold text-default-400 text-small">CPTIS-0893-2024</p>
                            </div>
                            <div className="flex gap-1">
                                <p className="font-semibold text-default-400 text-small">57</p>
                                <p className="text-default-400 text-small">Inscritos</p>
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
                <Card className="w-fit">
                    <CardHeader className="justify-between">
                        <div className="flex gap-5">
                            <Avatar isBordered radius="full" size="md" src="https://nextui.org/avatars/avatar-1.png" />
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-small font-semibold leading-none text-default-600">Zoey Lang</h4>
                                <h5 className="text-small tracking-tight text-default-400">@zoeylang</h5>
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter className="gap-3">
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">CPTIS-0893-2024</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">57</p>
                            <p className="text-default-400 text-small">Inscritos</p>
                        </div>
                    </CardFooter>
                </Card>
                <Card className="w-fit">
                    <CardHeader className="justify-between">
                        <div className="flex gap-5">
                            <Avatar isBordered radius="full" size="md" src="https://nextui.org/avatars/avatar-1.png" />
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-small font-semibold leading-none text-default-600">Zoey Lang</h4>
                                <h5 className="text-small tracking-tight text-default-400">@zoeylang</h5>
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter className="gap-3">
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">CPTIS-0893-2024</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">57</p>
                            <p className="text-default-400 text-small">Inscritos</p>
                        </div>
                    </CardFooter>
                </Card>
                <Card className="w-fit">
                    <CardHeader className="justify-between">
                        <div className="flex gap-5">
                            <Avatar isBordered radius="full" size="md" src="https://nextui.org/avatars/avatar-1.png" />
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-small font-semibold leading-none text-default-600">Zoey Lang</h4>
                                <h5 className="text-small tracking-tight text-default-400">@zoeylang</h5>
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter className="gap-3">
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">CPTIS-0893-2024</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">57</p>
                            <p className="text-default-400 text-small">Inscritos</p>
                        </div>
                    </CardFooter>
                </Card>
            </section>
        </section>
    );
}