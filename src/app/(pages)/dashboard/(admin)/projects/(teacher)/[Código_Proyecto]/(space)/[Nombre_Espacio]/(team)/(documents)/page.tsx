import { Divider, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import NewDocument from "./NewDocument";
import { Delete02Icon, EyeIcon, PencilEdit02Icon } from "hugeicons-react";

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

type Space = {
    ID_Espacio: number;
    ID_Usuario: number;
}

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

type TeamMember = {
    ID_Miembro_Equipo: number;
    ID_Equipo: number;
    ID_Usuario: number;
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

const fetchTrackingByTeamId = async (teamId: number): Promise<Tracking[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    console.log(`Fetching trackings for team ID: ${teamId}`);

    const response = await fetch(`${backendUrl}/trackings`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        console.error('Error response:', await response.text());
        throw new Error('Error al obtener los seguimientos');
    }

    const data = await response.json();
    const trackings: Tracking[] = data.data;

    return trackings.filter((tracking) => tracking.ID_Equipo === teamId);
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
        const user = await response.json();
        usersMap.set(user.ID_Usuario, user);
    }

    return usersMap;
};

const fetchDocumentsByTeamId = async (teamId: number): Promise<Document[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    console.log(`Fetching documents for team ID: ${teamId}`);

    const response = await fetch(`${backendUrl}/documents`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        console.error('Error response:', await response.text());
        throw new Error('Error al obtener los documentos');
    }
    const data = await response.json();
    const documents: Document[] = data.data;

    return documents.filter((document) => document.ID_Equipo === teamId);
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

const fetchSpaceByTeamId = async (spaceId: number): Promise<Space | null> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await fetch(`${backendUrl}/spaces`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        console.error('Error response:', await response.text());
        throw new Error('Error al obtener los espacios');
    }
    const data = await response.json();
    const spaces: Space[] = data.data;
    const space = spaces.find((space) => space.ID_Espacio === spaceId);
    return space || null;
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

export default function DocumentsPage({ params }: { params: { Nombre_Equipo: string } }) {
    const [team, setTeam] = useState<Team | null>(null);
    const [trackings, setTrackings] = useState<Tracking[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [usersTracking, setUsersTracking] = useState<Map<number, User>>(new Map());
    const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [space, setSpace] = useState<Space | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTeam = await fetchTeamByName(params.Nombre_Equipo);
                setTeam(fetchedTeam);
                
                if (fetchedTeam) {
                    const trackingData = await fetchTrackingByTeamId(fetchedTeam.ID_Equipo);
                    setTrackings(trackingData);
                    
                    const documentData = await fetchDocumentsByTeamId(fetchedTeam.ID_Equipo);
                    setDocuments(documentData);
                    
                    const spaceData = await fetchSpaceByTeamId(fetchedTeam.ID_Espacio);
                    setSpace(spaceData);
                    
                    const userIds = trackingData.map(tracking => tracking.ID_Usuario);
                    const usersMap = await fetchUsersByIds(userIds);
                    setUsersTracking(usersMap);
                    console.log("Fetch UserData", Array.from(usersMap.values()));
                    
                    const teamMembers = await fetchTeamMembersByTeamId(fetchedTeam.ID_Equipo);
                    setTeamMembers(teamMembers);
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
        );
    }

    if (!team) {
        return <div>No se encontró el equipo</div>;
    }

    const handleNewDocument = async (newDocument: Document) => {
        try {
            const trackingData = await fetchTrackingByTeamId(newDocument.ID_Equipo);
            setTrackings(trackingData);
            
            const documentData = await fetchDocumentsByTeamId(newDocument.ID_Equipo);
            setDocuments(documentData);
            
            const userIds = trackingData.map(tracking => tracking.ID_Usuario);
            const usersMap = await fetchUsersByIds(userIds);
            setUsersTracking(usersMap);
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
        }
    };    

    const isUserAuthorized = authenticatedUser && (
        teamMembers.some(member => member.ID_Usuario === authenticatedUser.ID_Usuario) ||
        authenticatedUser.ID_Usuario === team?.ID_Usuario ||
        authenticatedUser.ID_Usuario === space?.ID_Usuario
    );

    return (
        <section>
            <div className="flex w-full h-10 justify-between items-center p-4">
                <h1 className="text-3xl">
                    Documentos
                </h1>
                {isUserAuthorized && (
                    <NewDocument params={{ Nombre_Equipo: team.Nombre_Equipo }} onNewDocument={handleNewDocument} />
                )}
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
                    <TableBody emptyContent={"No hay documentos para mostrar"}>
                        {trackings.map((tracking) => (
                            <TableRow key={tracking.ID_Seguimiento}>
                                <TableCell>{tracking.Nombre_Tracking}</TableCell>
                                <TableCell>
                                    {usersTracking.has(tracking.ID_Usuario) && (
                                        <User
                                            name={`${usersTracking.get(tracking.ID_Usuario)?.Nombre} ${usersTracking.get(tracking.ID_Usuario)?.Apellido}`}
                                            description={usersTracking.get(tracking.ID_Usuario)?.Correo}
                                            avatarProps={{
                                                name: usersTracking.get(tracking.ID_Usuario)?.Nombre && usersTracking.get(tracking.ID_Usuario)?.Apellido
                                                    ? `${usersTracking.get(tracking.ID_Usuario)?.Nombre[0]}${usersTracking.get(tracking.ID_Usuario)?.Apellido[0]}`
                                                    : undefined,
                                                src: usersTracking.get(tracking.ID_Usuario)?.Perfil
                                                    ? `${storageUrl}/${usersTracking.get(tracking.ID_Usuario)?.Perfil}`
                                                    : undefined,
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{tracking.Fecha_Entrega}</TableCell>
                                <TableCell>{tracking.Fecha_Devolución}</TableCell>
                                <TableCell>{tracking.Comentario_Tracking}</TableCell>
                                <TableCell>{tracking.ID_Estado}</TableCell>
                                <TableCell>
                                    <div className="flex gap-4">
                                        <EyeIcon />
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