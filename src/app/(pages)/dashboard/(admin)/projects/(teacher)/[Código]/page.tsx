'use client';
import { Card, CardHeader, Avatar, CardBody, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";
import NewSpace from "../spaces/NewSpace";

export default function SpacePage() {

    return (
        <section className="flex flex-col gap-y-8">
            <section>
                <h1 className="text-3xl">Documentos</h1>
                <div className="p-4 flex flex-wrap gap-4 justify-center">
                    <Card shadow="sm" isPressable>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt="Docuemnto"
                                className="w-full object-cover h-80"
                                src={"https://nextui.org/avatars/avatar-1.png"}
                            />
                        </CardBody>
                        <CardFooter>
                            Invitación
                        </CardFooter>
                    </Card>
                    <Card shadow="sm" isPressable>
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt="Docuemnto"
                                className="w-full object-cover h-80"
                                src={"https://nextui.org/avatars/avatar-1.png"}
                            />
                        </CardBody>
                        <CardFooter>
                            Pliego de especificaciones
                        </CardFooter>
                    </Card>
                </div>
            </section>
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Espacios</h1>
                <NewSpace />
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

// 'use client';
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
// import NewSpace from '../spaces/NewSpace';

// type Document = {
//     ID: number;
//     ID_Proyecto: number;
//     Dirección: string;
// };

// type Project = {
//     ID: number;
//     Código: string;
// };

// // Nueva función para obtener el ID del proyecto
// const fetchProjectId = async (codigo: string): Promise<string> => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         throw new Error('No token found');
//     }
//     const response = await fetch(`http://localhost:8000/api/projects`, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });
//     if (!response.ok) {
//         throw new Error('Error al obtener el ID del proyecto');
//     }
//     const data = await response.json();
//     if (!data || !data.id) {
//         throw new Error('No se encontró el ID del proyecto');
//     }
//     return data.id;
// };

// const fetchDocuments = async (projectId: number): Promise<Document[]> => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         throw new Error('No token found');
//     }
//     const response = await fetch('http://localhost:8000/api/documents', {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });
//     if (!response.ok) {
//         throw new Error('Error al obtener los documentos');
//     }
//     const data = await response.json();
//     if (!Array.isArray(data.data)) {
//         throw new Error('Los datos obtenidos no son un array');
//     }
//     // Filtrar documentos por projectId
//     return data.data.filter((document: Document) => document.ID_Proyecto === projectId);
// };

// export default function ProjectIDPage({ params }: { params: { Código: string, ID: number } }) {
//     const [documents, setDocuments] = useState<Document[]>([]);
//     const projectCode = params.Código;
//     const projectId = params.ID;

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const documentData = await fetchDocuments(Number(projectId)); // Asegúrate de convertirlo a número
//                 setDocuments(documentData);
//             } catch (error) {
//                 console.error('Error al obtener los documentos:', error);
//             }
//         };
//         fetchData();
//     }, [projectCode, projectId]);

//     return (
//         <section className="flex flex-col gap-y-8">
//             <section>
//                 <h1 className="text-3xl">Documentos</h1>
//                 <div className="p-4 flex flex-wrap gap-4 justify-center">
//                     {documents.map((document) => (
//                         <Card key={document.ID} shadow="sm" isPressable>
//                             <CardBody className="overflow-visible p-0">
//                                 <Image shadow="sm" radius="lg" width="100%" alt="Documento" className="w-full object-cover h-80" src={document.Dirección} />
//                                 {/* <a href={document.Dirección}>Hola</a> */}
//                             </CardBody>
//                             {/* <CardFooter>{document.idproject}</CardFooter> */}
//                         </Card>
//                     ))}
//                 </div>
//             </section>
//             <section className="flex w-full h-10 justify-between items-center">
//                 <h1 className="text-3xl">Espacios</h1>
//                 <NewSpace />
//             </section>
//         </section>
//     );
// }

