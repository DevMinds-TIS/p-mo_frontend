"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Pagination,
    Card,
    CardBody,
} from "@nextui-org/react";
import {
    AccountSetting03Icon,
    AddSquareIcon,
    ConferenceIcon,
    ConversationIcon,
    HierarchyIcon,
    ManagerIcon,
    StudentIcon,
    TeacherIcon,
    UserGroupIcon,
} from "hugeicons-react";
import React, { useState } from "react";

const roles = [
    { Icon: ManagerIcon },
    { Icon: TeacherIcon },
    { Icon: StudentIcon },
    { Icon: HierarchyIcon },
    { Icon: UserGroupIcon },
    { Icon: ConversationIcon },
    { Icon: AccountSetting03Icon },
    { Icon: ConferenceIcon },
];

export default function NewRole() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPage, setSelectedPage] = useState(1);

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear rol</ModalHeader>
                            <form>
                                <ModalBody>
                                    <Input label="Nombre del rol" placeholder="Escribe el nombre del rol" />
                                    <p>Icono representativo del rol</p>
                                    <Pagination
                                        loop
                                        showControls
                                        color="success"
                                        total={roles.length}
                                        initialPage={1}
                                        onChange={(page) => setSelectedPage(page)}
                                    />
                                    <Card shadow="sm" isPressable>
                                        <CardBody className="overflow-visible p-2 flex items-center">
                                            {React.createElement(roles[selectedPage - 1].Icon, { size: 70 })}
                                        </CardBody>
                                    </Card>
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
