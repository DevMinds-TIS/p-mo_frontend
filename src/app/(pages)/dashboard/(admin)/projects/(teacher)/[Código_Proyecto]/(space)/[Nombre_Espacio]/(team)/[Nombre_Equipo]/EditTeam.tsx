import { FileUpload } from "@/app/_lib/components/FileUpload";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem } from "@nextui-org/react";
import { PencilEdit02Icon } from "hugeicons-react";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
    Icono_Rol: string;
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

type Space = {
    ID_Espacio: number;
    ID_Proyecto: number;
    ID_Usuario: number;
    Nombre_Espacio: string;
    Usuario: User;
    Inscritos: number;
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

interface UpdateTeamProps {
    onUpdateTeam: (team: Team) => void;
    params: { Nombre_Equipo: string };
}

const fetchSpaceByID = async (name: string): Promise<Space | null> => {
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

    const space = spaces.find((space) => space.Nombre_Espacio === name);
    return space || null;
};

const fetchUser = async () => {
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
    const userData = await response.json();
    return userData.data;
};

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

const updateTeam = async (teamId: number, teamData: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    const response = await fetch(`${backendUrl}/teams/${teamId}`, {
        method: 'POST', // Usa 'POST' con un método override si es necesario
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-HTTP-Method-Override': 'PUT',
        },
        body: teamData,
    });
    if (response.redirected) {
        throw new Error(`Request was redirected to: ${response.url}`);
    }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el equipo');
    }
    const responseData = await response.json();
    console.log("UpdateTeam", responseData.data);
    return responseData.data;
};

const companyteam = [
    { key: "", label: "Selecciona alguna opción", description: "" },
    { key: "S.R.L.", label: "S.R.L.", description: "Sociedad de responsabilidad limitada" },
    { key: "S.A.", label: "S.A.", description: "Sociedad anónima" },
    { key: "S.A.S.", label: "S.A.S.", description: "Sociedades por acciones simplificadas" },
    { key: "S.L.", label: "S.L.", description: "Sociedad limitada" },
    { key: "S.L.L.", label: "S.L.L.", description: "Sociedad laboral" },
    { key: "S.C.", label: "S.C.", description: "Sociedad colectiva" },
    { key: "S.Coop.", label: "S.Coop.", description: "Sociedades cooperativas" },
];

export default function EditTeam({ params, onUpdateTeam }: UpdateTeamProps) {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [shortName, setShortName] = useState("");
    const [emailTeam, setEmailTeam] = useState("");
    const [repoLink, setRepoLink] = useState("");
    const [localDeployLink, setLocalDeployLink] = useState("");
    const [externalDeployLink, setExternalDeployLink] = useState("");
    const [space, setSpace] = useState<Space | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);
    const [selectedKey, setSelectedKey] = useState<string>("");

    const selectedDescription = selectedKey === "" ? "" : companyteam.find(item => item.key === selectedKey)?.description;

    const handleSpecificationFileChange = (newFile: File | null) => {
        setSpecificationFile(newFile);
    };

    const handleSelectionChange = (keys: React.Key) => {
        setSelectedKey(keys.toString());
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamData = await fetchTeamByName(params.Nombre_Equipo);
                if (teamData) {
                    setTeam(teamData);
                    setShortName(teamData.Nombre_Equipo);
                    setEmailTeam(teamData.Correo_Equipo);
                    setSelectedKey(teamData.Razón_Social);
                    setRepoLink(teamData.Repositorio_Equipo);
                    setLocalDeployLink(teamData.Despliegue_Local);
                    setExternalDeployLink(teamData.Despliegue_Externo);
                }
            } catch (error) {
                console.error('Error al obtener los datos del equipo:', error);
            }
        };

        const fetchSpaceData = async () => {
            try {
                const spaceData = await fetchSpaceByID(params.Nombre_Equipo);
                if (spaceData) {
                    setSpace(spaceData);
                } else {
                    console.error('No se encontró el espacio con el ID proporcionado');
                }
            } catch (error) {
                console.error('Error al obtener los datos del espacio o documentos:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        fetchData();
        fetchSpaceData();
        fetchUserData();
    }, [params.Nombre_Equipo]);

    const handleSubmit = async () => {
        if (!team) return;

        try {
            const teamData = new FormData();
            teamData.append('nameteam', shortName);
            teamData.append('companyteam', selectedKey);
            teamData.append('emailteam', emailTeam);
            teamData.append('repositoryteam', repoLink);
            teamData.append('localdeployteam', localDeployLink);
            teamData.append('externaldeployteam', externalDeployLink);
            if (specificationFile) {
                teamData.append('logoteam', specificationFile);
            }
            if (user) {
                teamData.append('iduser', user.ID_Usuario.toString());
            }
            if (space) {
                teamData.append('idspace', space.ID_Espacio.toString());
            }
            console.log("Datos enviados para actualizar el equipo", Array.from(teamData.entries()));
            const response = await updateTeam(team.ID_Equipo, teamData);
            console.log("Respuesta de actualización del equipo", response);
            onUpdateTeam(response);
            onOpenChange();

            // Extraer los parámetros actuales de la URL usando window.location.pathname
            const pathSegments = window.location.pathname.split('/');
            const projectName = pathSegments[3]; // Suponiendo que 'projects' es el tercer segmento
            const spaceName = pathSegments[4];   // Suponiendo que 'space' es el cuarto segmento

            // Actualizar la ruta con el nuevo nombre del equipo
            router.push(`/dashboard/projects/${projectName}/${spaceName}/${shortName}`);
        } catch (error) {
            console.error('Error al actualizar el equipo:', error);
        }
    };


    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <PencilEdit02Icon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center" size="xl">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Editar equipo</ModalHeader>
                            <ModalBody>
                                <div className="flex justify-between gap-x-4">
                                    <Input
                                        value={shortName}
                                        onValueChange={setShortName}
                                        label="Nombre Equipo/Empresa"
                                        placeholder="Escribe el nombre de tu empresa"
                                        errorMessage="Este nombre ya está registrado"
                                        minLength={2}
                                    />
                                    <Select
                                        label="Razón Social"
                                        placeholder="Selecciona alguna opción"
                                        description={selectedDescription}
                                        selectedKeys={new Set([selectedKey])}
                                        onSelectionChange={(keys) => handleSelectionChange([...keys][0])}
                                        className="max-w-xs"
                                    >
                                        {companyteam.map((company) => (
                                            <SelectItem key={company.key}>{company.label}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <Input
                                    value={emailTeam}
                                    onValueChange={setEmailTeam}
                                    type="email"
                                    label="Correo electrónico de la grupo-empresa"
                                    placeholder="Escribe el correo de la grupo-empresa"
                                    errorMessage="Este correo ya está registrado"
                                    maxLength={80}
                                />
                                <div>
                                    <p>Logo de la empresa</p>
                                    <FileUpload
                                        onChange={handleSpecificationFileChange}
                                        existingFile={team?.Logo_Equipo ? { name: team.Nombre_Equipo, url: `${storageUrl}/${team.Logo_Equipo}` } : null}
                                    />
                                </div>
                                <Input
                                    value={repoLink}
                                    onValueChange={setRepoLink}
                                    label="Enlace al repositorio remoto"
                                    placeholder="Escribe el enlace a GitHub"
                                    errorMessage="Este enlace ya está registrado"
                                    minLength={2}
                                />
                                <Input
                                    value={localDeployLink}
                                    onValueChange={setLocalDeployLink}
                                    label="Enlace al despliegue local"
                                    placeholder="Escribe el enlace de despliegue local"
                                    errorMessage="Este enlace ya está registrado"
                                    minLength={2}
                                />
                                <Input
                                    value={externalDeployLink}
                                    onValueChange={setExternalDeployLink}
                                    label="Enlace al despliegue externo"
                                    placeholder="Escribe el enlace de despliegue externo"
                                    errorMessage="Este enlace ya está registrado"
                                    minLength={2}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={handleSubmit} className="w-full">
                                    Editar grupo-empresa
                                </Button>
                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}