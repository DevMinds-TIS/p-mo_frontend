import { useEffect, useState } from "react";
import { Chip, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import { Delete02Icon, HierarchyIcon, PencilEdit02Icon, StudentIcon, UserGroupIcon } from "hugeicons-react";
import NewMember from "./NewMember";

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
    Roles: Role[]
};

type Team = {
    ID_Equipo: number;
    ID_Usuario: number;
    Nombre_Equipo: string;
};

type TeamMember = {
    ID_Miembro_Equipo: number;
    ID_Equipo: number;
    ID_Usuario: number;
};

const iconMapping: { [key: string]: React.ElementType } = {
    StudentIcon,
    HierarchyIcon,
    UserGroupIcon,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

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

const fetchAuthenticatedUser = async (): Promise<User | null> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/user`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener los datos del usuario autenticado');
    const data = await response.json();
    return data.data;
};

const fetchUsersByIds = async (ids: number[]): Promise<Map<number, User>> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const usersMap = new Map<number, User>();

    for (const id of ids) {
        const response = await fetch(`${backendUrl}/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Error al obtener los datos del usuario');
        const userData = await response.json();
        const user = userData.data;
        usersMap.set(user.ID_Usuario, user);
        console.log("Index", usersMap);
    }

    return usersMap;
};

const fetchTeamMembersByTeamId = async (teamId: number): Promise<TeamMember[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/team-member`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener los miembros del equipo');
    const data = await response.json();
    return data.data.filter((member: TeamMember) => member.ID_Equipo === teamId);
};

export default function MembersPage({ params }: { params: { Nombre_Equipo: string } }) {
    const [isLoading, setIsLoading] = useState(true);
    const [team, setTeam] = useState<Team | null>(null);
    const [usersTeam, setUsersTeam] = useState<Map<number, User>>(new Map());
    const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTeam = await fetchTeamByName(params.Nombre_Equipo);
                setTeam(fetchedTeam);
    
                if (fetchedTeam) {
                    const teamMembers = await fetchTeamMembersByTeamId(fetchedTeam.ID_Equipo);
                    setTeamMembers(teamMembers);
    
                    const userIds = teamMembers.map(member => member.ID_Usuario);
                    const usersMap = await fetchUsersByIds(userIds);
                    setUsersTeam(usersMap);
                    console.log("Fetch UserData", Array.from(usersMap.values()));
                }
    
                const authenticatedUser = await fetchAuthenticatedUser();
                setAuthenticatedUser(authenticatedUser);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [params.Nombre_Equipo]);
    
    if (isLoading) {
        return (
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
        );
    }

    if (!team) {
        return <div>No se encontró el equipo</div>;
    }

    const handleNewMember = async (newMember: TeamMember) => {
        try {
            const updatedTeamMembers = [...teamMembers, newMember];
            setTeamMembers(updatedTeamMembers);
    
            const userIds = updatedTeamMembers.map(member => member.ID_Usuario);
            const usersMap = await fetchUsersByIds(userIds);
            setUsersTeam(usersMap);
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
        }
    };    

    const isUserAuthorized = authenticatedUser && (teamMembers.some(member => member.ID_Usuario === authenticatedUser.ID_Usuario) || authenticatedUser.ID_Usuario === team?.ID_Usuario);

    return (
        <section>
            <div className="flex w-full h-10 justify-between items-center p-4">
                <h1 className="text-3xl">
                    Miembros
                </h1>
                {isUserAuthorized && (
                    <NewMember params={{ Nombre_Equipo: team.Nombre_Equipo }} onNewMember={handleNewMember} />
                )}
            </div>
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableColumn>Usuario</TableColumn>
                        <TableColumn>Roles</TableColumn>
                        <TableColumn>Acciones</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No hay miembros para mostrar"}>
                        {teamMembers.map((member) => (
                            <TableRow key={member.ID_Miembro_Equipo}>
                                <TableCell>
                                    {usersTeam.has(member.ID_Usuario) && (
                                        <User
                                            name={`${usersTeam.get(member.ID_Usuario)?.Nombre} ${usersTeam.get(member.ID_Usuario)?.Apellido}`}
                                            description={usersTeam.get(member.ID_Usuario)?.Correo}
                                            avatarProps={{
                                                name: usersTeam.get(member.ID_Usuario)?.Nombre && usersTeam.get(member.ID_Usuario)?.Apellido
                                                    ? `${usersTeam.get(member.ID_Usuario)?.Nombre[0]}${usersTeam.get(member.ID_Usuario)?.Apellido[0]}`
                                                    : undefined,
                                                src: usersTeam.get(member.ID_Usuario)?.Perfil
                                                    ? `${storageUrl}/${usersTeam.get(member.ID_Usuario)?.Perfil}`
                                                    : undefined,
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {usersTeam.has(member.ID_Usuario) && (
                                        <div className="flex flex-col gap-1">
                                            {usersTeam.get(member.ID_Usuario)?.Roles.map((role) => {
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
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-4">
                                        <PencilEdit02Icon />
                                        <Delete02Icon />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}