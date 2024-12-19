"use client";
import { Card, CardHeader, Avatar, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import NewSpace from "./NewSpace";
import Link from "next/link";
import Avisos from "./Avisos";
import { useUser } from '@/contexts/UserContext';
import { useProject } from '@/contexts/ProjectContext';
import { useDocumentContext } from '@/contexts/DocumentContext';
import { useSpaceContext } from '@/contexts/SpaceContext';
import { Space } from "@/types/Space";

const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

export default function ProjectPage({ params }: { params: { Código_Proyecto: string } }) {
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
    const [isLoadingSpaces, setIsLoadingSpaces] = useState(true);

    const { user, users, fetchUser, fetchUsers } = useUser();
    const { projects, fetchProjects } = useProject();
    const { documents, fetchDocuments } = useDocumentContext();
    const { spaces, fetchSpaces, addSpace } = useSpaceContext();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchUser(Number(userId));
        }
        fetchUsers();
        fetchProjects();
        fetchDocuments();
        fetchSpaces();
    }, [fetchUser, fetchUsers, fetchProjects, fetchDocuments, fetchSpaces]);

    const project = projects?.find((project) => project.Código_Proyecto === params.Código_Proyecto);
    const projectDocuments = documents.filter(doc => doc.ID_Proyecto === project?.ID_Proyecto);
    const projectSpaces = spaces.filter(space => space.ID_Proyecto === project?.ID_Proyecto);

    const spacesWithUserDetails = projectSpaces.map(space => {
        const userDetail = users?.find(user => user.ID_Usuario === space.ID_Usuario);
        return {
            ...space,
            Usuario: userDetail || null,
        };
    });

    useEffect(() => {
        if (project) {
            setIsLoadingDocuments(false);
            setIsLoadingSpaces(false);
        }
    }, [project]);

    if (!user) {
        return (
            <section className="flex flex-col gap-y-8">
                <section>
                    <h1 className="text-3xl">Documentos</h1>
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

    const handleNewSpace = (newSpace: Space) => { addSpace(newSpace); };

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
                        projectDocuments.map((document) => (
                            <Card
                                className="h-72 w-60"
                                shadow="sm"
                                isPressable
                                key={document.ID_Documento}
                                onPress={() => {
                                    const url = `${storageUrl}/${document.Ruta_Documento}`;
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
                    <NewSpace params={{ Código_Proyecto: project.Código_Proyecto }} onNewSpace={handleNewSpace}/>
                )}
            </section>
            <section className="flex flex-wrap gap-4 p-4">
                {isLoadingSpaces ? (
                    [...Array(4)].map((_, index) => (
                        <Skeleton key={index} className="w-60 h-28 rounded-xl" />
                    ))
                ) : (
                    spacesWithUserDetails.map(space => (
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
            <Avisos isAdmin={isAdmin} userType="admin" />
        </section>
    );
}