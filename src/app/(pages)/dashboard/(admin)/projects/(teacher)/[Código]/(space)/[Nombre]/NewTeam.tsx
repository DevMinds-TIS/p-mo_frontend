import { FileUpload } from "@/app/_lib/components/FileUpload";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import React, { useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

type Team = {
    ID_Equipo: number;
    ID_Usuario: number;
    ID_Espacio: number;
    Nombre: string;
    Razón_Social: string;
    Correo: string;
    Logo: string;
}

interface NewTeamProps {
    onNewTeam: (team: Team) => void;
}

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
    { key: "srl", label: "S.R.L.", description: "Sociedad de responsabilidad limitada" },
    { key: "sa", label: "S.A.", description: "Sociedad anónima" },
    { key: "sas", label: "S.A.S.", description: "Sociedades por acciones simplificadas" },
    { key: "sl", label: "S.L.", description: "Sociedad limitada" },
    { key: "sll", label: "S.L.L.", description: "Sociedad laboral" },
    { key: "sc", label: "S.C.", description: "Sociedad colectiva" },
    { key: "scoop", label: "S.Coop.", description: "Sociedades cooperativas" },
];

const createTeam = async (teamData: FormData) => {
    const token = localStorage.getItem('token');
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
        throw new Error(errorData.message || 'Error al crear el equipo');
    }

    const responseData = await response.json();
    return responseData;
};

export default function NewTeam({ onNewTeam }: NewTeamProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [shortName, setShortName] = useState("");
    const [emailTeam, setEmailTeam] = useState("");
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);
    const [selectedKey, setSelectedKey] = useState<string>("");
    const selectedDescription = selectedKey === "" ? "" : companyteam.find(item => item.key === selectedKey)?.description;
    const handleSpecificationFileChange = (newFile: File | null) => {
        setSpecificationFile(newFile);
    };
    const handleSelectionChange = (keys: React.Key) => {
        setSelectedKey(keys.toString());
    };

    const handleSubmit = async () => {
        try {
            const userData = await fetchUser();

            const teamData = new FormData();
            teamData.append('nameteam', shortName);
            teamData.append('companyteam', selectedKey);
            teamData.append('emailteam', emailTeam);
            if (specificationFile) {
                teamData.append('logoteam', specificationFile);
            }
            teamData.append('iduser', userData.ID_Usuario);

            const response = await createTeam(teamData);
            onNewTeam(response);
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