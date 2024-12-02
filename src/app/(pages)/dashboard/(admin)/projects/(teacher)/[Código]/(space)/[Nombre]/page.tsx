// "use client";
// import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
// import Link from "next/link";
// import NewTeam from "./NewTeam";
// import React, { useEffect, useState } from "react";
// import { FileUpload } from "@/app/_lib/components/FileUpload";

// type Space = {
//     ID_Espacio: number;
//     ID_Proyecto: number;
//     ID_Usuario: number;
//     Nombre: string;
// }

// type Team = {
//     ID_Equipo: number;
//     ID_Usuario: number;
//     ID_Espacio: number;
//     Nombre: string;
//     Razón_Social: string;
//     Correo: string;
//     Logo: string;
// }

// type Role = {
//     ID_Rol: number;
//     Nombre_Rol: string;
// };

// type User = {
//     data: User;
//     ID_Usuario: number;
//     Roles: Role[];
//     Nombre: string;
//     Apellido: string;
//     Correo: string;
//     Imagen_Perfil: string;
// };

// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

// const fetchSpacesByName = async (name: string): Promise<Space | null> => {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('No token found');
//     const response = await fetch(`${backendUrl}/spaces`, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });
//     if (!response.ok) throw new Error('Error al obtener los espacios');
//     const data = await response.json();
//     const spaces: Space[] = data.data;

//     const space = spaces.find((space) => space.Nombre === name);
//     return space || null;
// };

// const fetchTeams = async (): Promise<Team[]> => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         throw new Error('No token found');
//     }

//     const response = await fetch(`${backendUrl}/teams`, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) {
//         throw new Error('Error al obtener los equipos');
//     }

//     const data = await response.json();
//     return data.data;
// };

// const fetchUser = async (): Promise<User> => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         throw new Error('No token found');
//     }

//     const response = await fetch(`${backendUrl}/user`, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//     });

//     if (!response.ok) {
//         throw new Error('Error al obtener los datos del usuario');
//     }

//     const data: User = await response.json();
//     return data.data;
// };

// export default function TeamsPage({ params }: { params: { Nombre: string } }) {
//     const [space, setSpace] = useState<Space | null>(null);
//     const [teams, setTeams] = useState<Team[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [user, setUser] = useState<User | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const fetchedSpace = await fetchSpacesByName(params.Nombre);
//                 setSpace(fetchedSpace);

//                 const teamsData = await fetchTeams();
//                 setTeams(teamsData);
//                 setIsLoading(false);
//             } catch (error) {
//                 console.error(error);
//                 setIsLoading(false);
//             }
//         };
//         fetchData();
//     }, [params.Nombre]);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const userData = await fetchUser();
//                 setUser(userData);
//             } catch (error) {
//                 console.error('Error al obtener los datos del usuario:', error);
//             }
//         };
//         fetchUserData();
//     }, []); // No incluimos dependencias aquí para que no se ejecute repetidamente.

//     if (!user) {
//         return (
//             <section>
//                 <div className="flex justify-between">
//                     <h1 className="text-4xl p-4"> Equipos </h1>
//                     <Skeleton className="w-36 h-10" />
//                 </div>
//                 <div className="flex flex-wrap gap-4 p-4">
//                     {[...Array(4)].map((_, index) => (
//                         <Card key={index} shadow="sm">
//                             <CardBody className="overflow-visible p-0">
//                                 <Skeleton className="w-full h-36 rounded-lg" />
//                             </CardBody>
//                             <CardFooter className="text-small gap-4 justify-between">
//                                 <Skeleton className="w-32 h-4 rounded-lg" />
//                                 <Skeleton className="w-10 h-4 rounded-lg" />
//                             </CardFooter> </Card>
//                     ))}
//                 </div>
//                 <div>
//                     <h1 className="text-3xl p-4"> Criterios de Autoevaluación </h1>
//                     <Skeleton className="w-full h-10 rounded-lg" />
//                 </div>
//                 <div>
//                     <h1 className="text-3xl p-4"> Criterios de Evaluación de pares </h1>
//                     <Skeleton className="w-full h-10 rounded-lg" />
//                 </div>
//                 <div>
//                     <h1 className="text-3xl p-4"> Criterios de Evaluaciones cruzadas </h1>
//                     <Skeleton className="w-full h-10 rounded-lg" />
//                 </div>
//             </section>
//         );
//     }
//     const isStudent = user?.Roles?.some(role => role.ID_Rol === 3) ?? false;

//     const handleNewTeam = (newTeam: Team) => {
//         setTeams(prevTeams => [...prevTeams, newTeam]);
//     };

//     return (
//         <section>
//             <div className="flex justify-between">
//                 <h1 className="text-4xl p-4">
//                     Equipos
//                 </h1>
//                 {isStudent && space && user && (
//                     <NewTeam params={{ ID_Espacio: space.ID_Espacio }} onNewTeam={handleNewTeam} />
//                 )}
//             </div>
//             <div className="flex flex-wrap gap-4 p-4">
//                 {isLoading ? (
//                     [...Array(4)].map((_, index) => (
//                         <Card key={index} shadow="sm">
//                             <CardBody className="overflow-visible p-0">
//                                 <Skeleton className="w-full h-36 rounded-lg" />
//                             </CardBody>
//                             <CardFooter className="text-small gap-4 justify-between">
//                                 <Skeleton className="w-32 h-4 rounded-lg" />
//                                 <Skeleton className="w-10 h-4 rounded-lg" />
//                             </CardFooter>
//                         </Card>
//                     ))
//                 ) : (
//                     teams.map(team => (
//                         <Link key={team.ID_Equipo} href={`${space?.Nombre}/${team?.Nombre}`}>
//                             <Card shadow="sm" isPressable>
//                                 <CardBody className="overflow-visible p-0">
//                                     <FileUpload
//                                         readOnly={true}
//                                         existingFile={team.Logo ? { name: team.Nombre, url: `${storageUrl}/${team.Logo}` } : null}
//                                         onChange={() => { }}
//                                         className="w-36 h-36"
//                                     />
//                                 </CardBody>
//                                 <CardFooter className="text-small gap-4 justify-between">
//                                     <b>{team.Nombre}</b>
//                                     <p className="text-default-500">{team.Razón_Social}</p>
//                                 </CardFooter>
//                             </Card>
//                         </Link>
//                     ))
//                 )}
//             </div>
//             <div>
//                 <h1 className="text-3xl p-4">
//                     Criterios de Autoevaluación
//                 </h1>
//             </div>
//             <div>
//                 <h1 className="text-3xl p-4">
//                     Criterios de Evaluación de pares
//                 </h1>
//             </div>
//             <div>
//                 <h1 className="text-3xl p-4">
//                     Criterios de Evaluaciones cruzadas
//                 </h1>
//             </div>
//         </section>
//     );
// }

"use client";
import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import NewTeam from "./NewTeam";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import Avisos from "../../Avisos";

type Space = {
    ID_Espacio: number;
    ID_Proyecto: number;
    ID_Usuario: number;
    Nombre: string;
}

type Team = {
    ID_Equipo: number;
    ID_Usuario: number;
    ID_Espacio: number;
    Nombre: string;
    Razón_Social: string;
    Correo: string;
    Logo: string;
}

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
    Imagen_Perfil: string;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

const fetchSpacesByName = async (name: string): Promise<Space | null> => {
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
    const spaces: Space[] = data.data;

    const space = spaces.find((space) => space.Nombre === name);
    return space || null;
};

const fetchTeams = async (): Promise<Team[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${backendUrl}/teams`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los equipos');
    }

    const data = await response.json();
    return data.data;
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

export default function TeamsPage({ params }: { params: { Nombre: string } }) {
    const [space, setSpace] = useState<Space | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedSpace = await fetchSpacesByName(params.Nombre);
                setSpace(fetchedSpace);

                const teamsData = await fetchTeams();
                setTeams(teamsData);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.Nombre]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };
        fetchUserData();
    }, []); // No incluimos dependencias aquí para que no se ejecute repetidamente.

    if (!user) {
        return (
            <section>
                <div className="flex justify-between">
                    <h1 className="text-4xl p-4"> Equipos </h1>
                    <Skeleton className="w-36 h-10" />
                </div>
                <div className="flex flex-wrap gap-4 p-4">
                    {[...Array(4)].map((_, index) => (
                        <Card key={index} shadow="sm">
                            <CardBody className="overflow-visible p-0">
                                <Skeleton className="w-full h-36 rounded-lg" />
                            </CardBody>
                            <CardFooter className="text-small gap-4 justify-between">
                                <Skeleton className="w-32 h-4 rounded-lg" />
                                <Skeleton className="w-10 h-4 rounded-lg" />
                            </CardFooter> </Card>
                    ))}
                </div>
                <div>
                    <h1 className="text-3xl p-4"> Criterios de Autoevaluación </h1>
                    <Skeleton className="w-full h-10 rounded-lg" />
                </div>
                <div>
                    <h1 className="text-3xl p-4"> Criterios de Evaluación de pares </h1>
                    <Skeleton className="w-full h-10 rounded-lg" />
                </div>
                <div>
                    <h1 className="text-3xl p-4"> Criterios de Evaluaciones cruzadas </h1>
                    <Skeleton className="w-full h-10 rounded-lg" />
                </div>
            </section>
        );
    }
    const isStudent = user?.Roles?.some(role => role.ID_Rol === 3) ?? false;
    const isTeacher = user?.Roles?.some(role => role.ID_Rol === 2) ?? false;

    const handleNewTeam = (newTeam: Team) => {
        setTeams(prevTeams => [...prevTeams, newTeam]);
    };

    return (
        <section>
            <div className="flex justify-between">
                <h1 className="text-4xl p-4">
                    Equipos
                </h1>
                {isStudent && space && user && (
                    <NewTeam params={{ ID_Espacio: space.ID_Espacio }} onNewTeam={handleNewTeam} />
                )}
            </div>
            <div className="flex flex-wrap gap-4 p-4">
                {isLoading ? (
                    [...Array(4)].map((_, index) => (
                        <Card key={index} shadow="sm">
                            <CardBody className="overflow-visible p-0">
                                <Skeleton className="w-full h-36 rounded-lg" />
                            </CardBody>
                            <CardFooter className="text-small gap-4 justify-between">
                                <Skeleton className="w-32 h-4 rounded-lg" />
                                <Skeleton className="w-10 h-4 rounded-lg" />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    teams.map(team => (
                        <Link key={team.ID_Equipo} href={`${space?.Nombre}/${team?.Nombre}`}>
                            <Card shadow="sm" isPressable>
                                <CardBody className="overflow-visible p-0">
                                    <FileUpload
                                        readOnly={true}
                                        existingFile={team.Logo ? { name: team.Nombre, url: `${storageUrl}/${team.Logo}` } : null}
                                        onChange={() => { }}
                                        className="w-36 h-36"
                                    />
                                </CardBody>
                                <CardFooter className="text-small gap-4 justify-between">
                                    <b>{team.Nombre}</b>
                                    <p className="text-default-500">{team.Razón_Social}</p>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Autoevaluación
                </h1>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Evaluación de pares
                </h1>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Criterios de Evaluaciones cruzadas
                </h1>
            </div>
            <Avisos isAdmin={isTeacher} userType="teacher" />
        </section>
    );
}