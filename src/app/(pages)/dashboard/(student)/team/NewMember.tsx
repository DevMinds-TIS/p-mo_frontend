import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import React from "react";

export default function NewMember() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [emailStudent, setEmailStudent] = React.useState("");

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent">
                <AddSquareIcon className="w-fit h-full" />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="bottom">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Invitar miembro</ModalHeader>
                            <ModalBody>
                                <Input
                                    value={emailStudent}
                                    onValueChange={setEmailStudent}
                                    type="email"
                                    label="Correo electrónico del miembro a invitar"
                                    placeholder="Escribe el correo a invitar"
                                    errorMessage="Este nombre ya esta registrado"
                                    maxLength={80}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose} className="w-full">
                                    Enviar
                                </Button>
                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}