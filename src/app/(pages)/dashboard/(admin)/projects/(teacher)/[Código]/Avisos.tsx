import { useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent,
    Input,
} from "@nextui-org/react";
import { AddSquareIcon, Delete01Icon } from "hugeicons-react"; // Cambiado a CloseSquareIcon para la "X"

type Aviso = {
    id: number;
    text: string;
};

type AvisosProps = {
    isAdmin: boolean; // Prop para determinar si el usuario es admin
};

export default function Avisos({ isAdmin }: AvisosProps) {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAvisoText, setNewAvisoText] = useState("");

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setNewAvisoText("");
        setIsModalOpen(false);
    };

    const handleCreateAviso = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAvisoText.trim() !== "") {
            setAvisos((prevAvisos) => [
                ...prevAvisos,
                { id: Date.now(), text: newAvisoText.trim() },
            ]);
            handleCloseModal();
        }
    };

    const handleDeleteAviso = (id: number) => {
        setAvisos((prevAvisos) => prevAvisos.filter((aviso) => aviso.id !== id));
    };

    return (
        <section className="flex flex-col gap-y-4 p-4">
            {/* Header */}
            <section className="flex w-full justify-between items-center">
                <h1 className="text-3xl font-bold">Avisos</h1>
                {isAdmin && (
                    <Button
                        onPress={handleOpenModal}
                        className="min-w-0 p-0 bg-transparent items-center"
                    >
                        <AddSquareIcon size={30} />
                    </Button>
                )}
            </section>

            {/* Lista de avisos */}
            <section className="flex flex-col gap-y-4">
                {avisos.length === 0 ? (
                    <p className="text-gray-500">No hay avisos disponibles.</p>
                ) : (
                    avisos.map((aviso) => (
                        <div
                            key={aviso.id}
                            className="p-4 bg-[#191919] rounded-lg shadow flex justify-between items-center"
                        >
                            <span>{aviso.text}</span>
                            {isAdmin && (
                                <Button
                                    onPress={() => handleDeleteAviso(aviso.id)}
                                    className="min-w-0 p-0 bg-transparent text-red-500 hover:text-red-700"
                                >
                                    <Delete01Icon size={20} color={"#fff"}/>
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </section>

            {/* Modal para crear aviso */}
            {isAdmin && (
                <Modal
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    scrollBehavior="outside"
                    backdrop="blur"
                    placement="center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <form onSubmit={handleCreateAviso}>
                                <ModalHeader className="flex flex-col gap-1">
                                    Crear un nuevo aviso
                                </ModalHeader>
                                <ModalBody>
                                    <Input
                                        label="Nuevo aviso"
                                        placeholder="Escribe el texto del aviso"
                                        value={newAvisoText}
                                        onChange={(e) => setNewAvisoText(e.target.value)}
                                        className="w-full"
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        type="button"
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" color="success">
                                        Publicar
                                    </Button>
                                </ModalFooter>
                            </form>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </section>
    );
}
