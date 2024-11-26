import { FileUpload } from "@/app/_lib/components/FileUpload";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import React, { useState } from "react";

const companyteam = [
    { key: "srl", label: "S.R.L.", description: "Sociedad de responsabilidad limitada" },
    { key: "sa", label: "S.A.", description: "Sociedad anónima" },
    { key: "sas", label: "S.A.S.", description: "Sociedades por acciones simplificadas" },
    { key: "sl", label: "S.L.", description: "Sociedad limitada" },
    { key: "sll", label: "S.L.L.", description: "Sociedad laboral" },
    { key: "sc", label: "S.C.", description: "Sociedad colectiva" },
    { key: "scoop", label: "S.Coop.", description: "Sociedades cooperativas" },
];

export default function NewTeam() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [shortName, setShortName] = useState("");
    const [largeName, setLargeName] = useState("");
    const [emailStudent, setEmailStudent] = useState("");
    const [emailTeam, setEmailTeam] = useState("");
    const [projectCode, setProjectCode] = useState("");
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);

    const [selectedKey, setSelectedKey] = useState<string>(companyteam[0].key);
    const selectedDescription = companyteam.find(item => item.key === selectedKey)?.description;

    const handleSpecificationFileChange = (newFile: File | null) => {
        setSpecificationFile(newFile);
    };

    const handleSelectionChange = (keys: React.Key) => {
        setSelectedKey(keys.toString());
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
                                        label="Nombre Corto"
                                        placeholder="Escribe el nombre de tu empresa"
                                        errorMessage="Este nombre ya esta registrado"
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
                                        {companyteam.map((companyteam) => (
                                            <SelectItem key={companyteam.key}>
                                                {companyteam.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <Input
                                    value={emailStudent}
                                    onValueChange={setEmailStudent}
                                    type="email"
                                    label="Correo electrónico del representante"
                                    placeholder="Escribe el correo del representante legal de la grupo-empresa"
                                    errorMessage="Este nombre ya esta registrado"
                                    maxLength={80}
                                />
                                <Input
                                    value={emailTeam}
                                    onValueChange={setEmailTeam}
                                    type="email"
                                    label="Correo electrónico de la grupo-empresa"
                                    placeholder="Escribe el correo de la grupo-empresa"
                                    errorMessage="Este nombre ya esta registrado"
                                    maxLength={80}
                                />
                                <div>
                                    <p>Logo de la empresa</p>
                                    <FileUpload onChange={handleSpecificationFileChange} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose} className="w-full">
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