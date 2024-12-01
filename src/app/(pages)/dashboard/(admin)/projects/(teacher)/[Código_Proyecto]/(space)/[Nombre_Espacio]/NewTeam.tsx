import { FileUpload } from "@/app/_lib/components/FileUpload";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import React, { useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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

type Space = {
    ID_Espacio: number;
    ID_Proyecto: number;
    ID_Usuario: number;
    Nombre_Espacio: string;
    Usuario: User;
    Inscritos: number;
}

type Team = {
    ID_Equipo: number;
    ID_Usuario: number;
    ID_Espacio: number;
    Nombre_Equipo: string;
    Razón_Social: string;
    Correo_Equipo: string;
    Logo_Equipo: string;
    Integrantes: number;
}

interface NewTeamProps {
    onNewTeam: (team: Team) => void;
    params: { Nombre_Espacio: string };
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

const createTeam = async (teamData: FormData) => {
    const token = localStorage.getItem('token');
    console.log("Token", token);
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${backendUrl}/teams`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: teamData,
    });

    if (response.redirected) {
        throw new Error(`Request was redirected to: ${response.url}`);
    }

    if (!response.ok) {
        const errorData = await response.json();
        console.log("Error", errorData.message);
        throw new Error(errorData.message || 'Error al crear el equipo');
    }

    const responseData = await response.json();
    return responseData;
};

export default function NewTeam({ params, onNewTeam }: NewTeamProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [shortName, setShortName] = useState("");
    const [emailTeam, setEmailTeam] = useState("");
    const [space, setSpace] = useState<Space | null>(null);
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
                const spaceData = await fetchSpaceByID(params.Nombre_Espacio);
                if (spaceData) {
                    setSpace(spaceData);
                } else {
                    console.error('No se encontró el espacio con el ID proporcionado');
                }
            } catch (error) {
                console.error('Error al obtener los datos del espacio o documentos:', error);
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
    }, [params.Nombre_Espacio]);

    const handleSubmit = async () => {
        try {
            const teamData = new FormData();
            teamData.append('nameteam', shortName);
            teamData.append('companyteam', selectedKey);
            teamData.append('emailteam', emailTeam);
            if (specificationFile) {
                teamData.append('logoteam', specificationFile);
            }
            if (user) {
                teamData.append('iduser', user.ID_Usuario.toString());
            }
            if (space) {
                teamData.append('idspace', space.ID_Espacio.toString());
            }
            const response = await createTeam(teamData);
            onNewTeam(response.data);
            onOpenChange();
        } catch (error) {
            console.error('Error al crear el equipo:', error);
        }
    };

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center" size="xl">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear equipo</ModalHeader>
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
                                            <SelectItem key={company.key}>
                                                {company.label}
                                            </SelectItem>
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
                                    <FileUpload onChange={handleSpecificationFileChange} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={handleSubmit} className="w-full">
                                    Registrar grupo-empresa
                                </Button>
                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}