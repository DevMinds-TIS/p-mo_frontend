import { FileUpload } from "@/app/_lib/components/FileUpload";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import React, { useState } from "react";
// import { teachers } from "@/app/_lib/landing/teachers";

export default function NewTeam() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [shortName, setShortName] = React.useState("");
    const [largeName, setLargeName] = React.useState("");
    const [emailStudent, setEmailStudent] = React.useState("");
    const [emailTeam, setEmailTeam] = React.useState("");
    const [projectCode, setProjectCode] = React.useState("");
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);


    const handleSpecificationFileChange = (newFile: File | null) => {
        setSpecificationFile(newFile);
    };

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30}/>
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
                                    <Input
                                        value={largeName}
                                        onValueChange={setLargeName}
                                        label="Nombre Largo"
                                        placeholder="Escribe el nombre de tu empresa"
                                        errorMessage="Este nombre ya esta registrado"
                                        minLength={2}
                                    />
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
                                <div className="flex justify-between gap-x-4">
                                    <Input
                                        value={projectCode}
                                        onValueChange={setProjectCode}
                                        label="Código del proyecto"
                                        placeholder="Escribe el código del proyecto"
                                        errorMessage="Este nombre ya esta registrado"
                                        maxLength={10}
                                    />
                                    {/* <Select
                                        items={teachers}
                                        label="Docente"
                                        placeholder="Seleccione a su tutor/docente"
                                    >
                                        {(teacher) => <SelectItem key={teacher.key}>{teacher.label}</SelectItem>}
                                    </Select> */}
                                </div>
                                <div>
                                    <p>Logo de la empresa</p>
                                    <FileUpload onChange={handleSpecificationFileChange}/>
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