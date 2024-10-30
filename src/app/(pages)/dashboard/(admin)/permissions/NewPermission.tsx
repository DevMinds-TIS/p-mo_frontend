import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
} from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import React, { useState } from "react";

export default function NewPermission() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear permiso</ModalHeader>
                            <form>
                                <ModalBody>
                                    <Input label="Codigo del permiso" placeholder="Escribe el codigo para el permiso" />
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="submit" className="w-full">
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
