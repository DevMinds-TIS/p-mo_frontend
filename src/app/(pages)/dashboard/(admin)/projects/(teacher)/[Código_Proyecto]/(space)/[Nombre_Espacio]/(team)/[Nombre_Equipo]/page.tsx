"use client";
import { Card, CardBody, CardFooter, Chip, CircularProgress, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import { Github01Icon, HierarchyIcon, StudentIcon, TeacherIcon, WebDesign02Icon, WebValidationIcon } from "hugeicons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import EditTeam from "./EditTeam";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import DocumentsPage from "../(documents)/page";
import MembersPage from "../(members)/page";

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

const iconMapping: { [key: string]: React.ElementType } = {
    StudentIcon,
    HierarchyIcon,
    TeacherIcon,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

const fetchTeamAndUserById = async (teamName: string): Promise<{ team: Team | null, user: User | null }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const teamResponse = await fetch(`${backendUrl}/teams`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!teamResponse.ok) throw new Error('Error al obtener los equipos');
    const teamData = await teamResponse.json();
    const teams: Team[] = teamData.data;
    const team = teams.find((team) => team.Nombre_Equipo === teamName) || null; // Asegura que `team` sea `null` si no se encuentra ningún equipo

    let user = null;
    if (team) {
        const userResponse = await fetch(`${backendUrl}/users/${team.ID_Usuario}`);
        if (userResponse.ok) {
            const userData = await userResponse.json();
            user = userData.data;
        }
    }

    return { team, user };
};

export default function TeamPage({ params }: { params: { Nombre_Equipo: string } }) {
    const [team, setTeam] = useState<Team | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userTeam, setUserTeam] = useState<User | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { team, user } = await fetchTeamAndUserById(params.Nombre_Equipo);
                setTeam(team);
                setUserTeam(user);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al obtener el equipo:', error);
                setIsLoading(false);
            }
        };

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

    const isStudent = user?.Roles?.some(role => role.ID_Rol === 3) ?? false;

    if (isLoading) {
        return (
            <section>
                <div className="flex w-full h-10 justify-between items-center p-4">
                    <h1 className="text-3xl">Equipo</h1>
                    <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
                <div className="p-4 flex gap-4 justify-between">
                    <Card className="border-none bg-background/60 dark:bg-default-100/50 w-[75%]" shadow="sm">
                        <CardBody>
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex flex-col gap-3">
                                    <Skeleton className="w-52 h-52 rounded-lg" />
                                    <div className="flex flex-col gap-2">
                                        {[...Array(2)].map((_, index) => (
                                            <Skeleton key={index} className={`w-${index === 0 ? '36' : '52'} h-${index === 0 ? '6' : '4'} rounded-lg`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full h-full flex flex-col justify-between">
                                    {[...Array(2)].map((_, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <Skeleton className="w-12 h-12 rounded-full" />
                                            <div className="flex flex-col gap-1 items-center">
                                                {[...Array(2)].map((_, idx) => (
                                                    <Skeleton key={`inner-${index}-${idx}`} className="w-36 h-4 rounded-lg" />
                                                ))}
                                            </div>
                                            {[...Array(index === 1 ? 2 : 1)].map((_, idx) => (
                                                <div key={`outer-${index}-${idx}`} className="flex flex-col gap-1">
                                                    <Skeleton className="w-24 h-8 rounded-full" />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Skeleton className={`w-12 h-12 rounded-${index === 0 ? 'full' : 'lg'}`} />
                                            <Skeleton className="w-32 h-6 rounded-lg" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="w-[25%] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
                        <CardBody className="justify-center items-center pb-0">
                            <Skeleton className="w-56 h-56 rounded-full" />
                        </CardBody>
                        <CardFooter className="justify-center items-center pt-0">
                            <Skeleton className="w-28 h-8 rounded-lg" />
                        </CardFooter>
                    </Card>
                </div>
                <section>
                    <div className="flex w-full h-10 justify-between items-center p-4">
                        <h1 className="text-3xl">
                            Documentos
                        </h1>
                        <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                    <div className="p-4">
                        <Table>
                            <TableHeader>
                                <TableColumn>Nombre</TableColumn>
                                <TableColumn>Usuario</TableColumn>
                                <TableColumn>Fecha envío</TableColumn>
                                <TableColumn>Fecha recepción</TableColumn>
                                <TableColumn>Comentario</TableColumn>
                                <TableColumn>Estado</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
                <section>
                    <div className="flex w-full h-10 justify-between items-center p-4">
                        <h1 className="text-3xl">
                            Miembros
                        </h1>
                        <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                    <div className="p-4">
                        <Table>
                            <TableHeader>
                                <TableColumn>Usuario</TableColumn>
                                <TableColumn>Roles</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                        <TableCell><Skeleton className="w-full h-8 rounded-lg" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </section>
        );
    }

    if (!team) {
        return <div>No se encontró el equipo</div>;
    }

    return (
        <section>
            <div className="flex w-full h-10 justify-between items-center p-4">
                <h1 className="text-3xl">
                    Equipo
                </h1>
                {isStudent && (
                    <EditTeam params={{ Nombre_Equipo: team.Nombre_Equipo }} onUpdateTeam={setTeam} />
                )}
            </div>
            <div className="p-4 flex gap-4 justify-between">
                <Card
                    className="border-none bg-background/60 dark:bg-default-100/50 w-[75%]"
                    shadow="sm"
                >
                    <CardBody>
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col gap-3">
                                <FileUpload
                                    readOnly={true}
                                    existingFile={team.Logo_Equipo ? { name: team.Nombre_Equipo, url: `${storageUrl}/${team.Logo_Equipo}` } : null}
                                    onChange={() => { }}
                                    className="w-52 h-52"
                                />
                                <div>
                                    <p className="text-lg sm:text-xl font-bold">
                                        {team.Nombre_Equipo} {team.Razón_Social}
                                    </p>
                                    <p className="font-light text-sm sm:text-base text-gray-500">
                                        {team.Correo_Equipo}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-full flex flex-col justify-between">
                                {userTeam?.Docente && (
                                    <div className="flex gap-4 items-center">
                                        <User
                                            name={`${userTeam.Docente.Nombre} ${userTeam.Docente.Apellido}`}
                                            description={userTeam.Docente.Correo}
                                            avatarProps={{
                                                name: !userTeam.Docente.Perfil ? `${userTeam.Docente.Nombre?.[0] || ''}${userTeam.Docente.Apellido?.[0] || ''}` : undefined,
                                                src: userTeam.Docente.Perfil ? `${storageUrl}/${userTeam.Docente.Perfil}` : undefined,
                                            }}
                                        />
                                        <div className="flex flex-col gap-1">
                                            {userTeam.Docente.Roles.map((role) => {
                                                const RoleIcon = iconMapping[role.Icono_Rol];
                                                return (
                                                    <Chip
                                                        key={role.ID_Rol}
                                                        endContent={<RoleIcon />}
                                                        className="capitalize"
                                                        color="success"
                                                        size="md"
                                                        variant="flat"
                                                    >
                                                        {role.Nombre_Rol}
                                                    </Chip>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-4 items-center">
                                    <User
                                        name={`${userTeam?.Nombre} ${userTeam?.Apellido}`}
                                        description={userTeam?.Correo}
                                        avatarProps={{
                                            name: !userTeam?.Perfil ? `${userTeam?.Nombre?.[0] || ''}${userTeam?.Apellido?.[0] || ''}` : undefined,
                                            src: userTeam?.Perfil ? `${storageUrl}/${userTeam?.Perfil}` : undefined,
                                        }}
                                    />
                                    <div className="flex flex-col gap-1">
                                        {userTeam?.Roles.map((role) => {
                                            const RoleIcon = iconMapping[role.Icono_Rol];
                                            return (
                                                <Chip
                                                    key={role.ID_Rol}
                                                    endContent={<RoleIcon />}
                                                    className="capitalize"
                                                    color="success"
                                                    size="md"
                                                    variant="flat"
                                                >
                                                    {role.Nombre_Rol}
                                                </Chip>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Github01Icon size={38} />
                                    {team.Repositorio_Equipo ? (
                                        <Tooltip content="Abrir en nueva ventana" placement="right">
                                            <Link href={team.Repositorio_Equipo} className="text-blue-500" target="_blank">
                                                Repositorio
                                            </Link>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip content="Repositorio remoto no disponible" placement="right">
                                            <Link href="#" className="text-red-500">
                                                Repositorio
                                            </Link>
                                        </Tooltip>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <WebDesign02Icon size={38} />
                                    {team.Despliegue_Local ? (
                                        <Tooltip content="Abrir en nueva ventana" placement="right">
                                            <Link href={team.Despliegue_Local} className="text-blue-500" target="_blank">
                                                Despliegue Interno
                                            </Link>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip content="Despliegue interno no disponible" placement="right">
                                            <Link href="#" className="text-red-500">
                                                Despliegue Interno
                                            </Link>
                                        </Tooltip>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <WebValidationIcon size={38} />
                                    {team.Despliegue_Externo ? (
                                        <Tooltip content="Abrir en nueva ventana" placement="right">
                                            <Link href={team.Despliegue_Externo} className="text-blue-500" target="_blank">
                                                Despliegue Externo
                                            </Link>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip content="Despliegue externo no disponible" placement="right">
                                            <Link href="#" className="text-red-500">
                                                Despliegue Externo
                                            </Link>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="w-[25%] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <CardBody className="justify-center items-center pb-0">
                        <CircularProgress
                            classNames={{
                                svg: "w-56 h-56 drop-shadow-md",
                                indicator: "stroke-white",
                                track: "stroke-white/10",
                                value: "text-3xl font-semibold text-white",
                            }}
                            value={70}
                            strokeWidth={4}
                            showValueLabel={true}
                        />
                    </CardBody>
                    <CardFooter className="justify-center items-center pt-0">
                        <Chip
                            classNames={{
                                base: "border-1 border-white/30",
                                content: "text-white/90 text-small font-semibold",
                            }}
                            variant="bordered"
                        >
                            2800 Data points
                        </Chip>
                    </CardFooter>
                </Card>
            </div>
            <DocumentsPage params={{ Nombre_Equipo: team.Nombre_Equipo }} />
            <MembersPage params={{ Nombre_Equipo: team.Nombre_Equipo }} />
        </section>
    );
}