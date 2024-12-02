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
import { AddSquareIcon, Delete01Icon } from "hugeicons-react";
import { Chip } from "@nextui-org/chip";

type ImportanceLevel = "low" | "medium" | "high";

type Aviso = {
    id: number;
    text: string;
    importance: ImportanceLevel;
};

type AvisosProps = {
    isAdmin: boolean;
    userType: "admin" | "teacher";
};

export default function Avisos({ isAdmin, userType }: AvisosProps) {
    const [avisos, setAvisos] = useState<{ [key in "admin" | "teacher"]: Aviso[] }>({
        admin: [],
        teacher: [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAvisoText, setNewAvisoText] = useState("");
    const [importance, setImportance] = useState<ImportanceLevel>("low");
    const [errorMessage, setErrorMessage] = useState("");

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => {
        setNewAvisoText("");
        setImportance("low");
        setErrorMessage(""); // Limpiar mensaje de error
        setIsModalOpen(false);
    };

    const handleCreateAviso = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAvisoText.trim() === "") {
            setErrorMessage("El campo no puede estar vacío."); // Mostrar mensaje de error
            return;
        }
        setAvisos((prevAvisos) => ({
            ...prevAvisos,
            [userType]: [
                ...prevAvisos[userType],
                { id: Date.now(), text: newAvisoText.trim(), importance },
            ],
        }));
        handleCloseModal();
    };

    const handleDeleteAviso = (id: number) => {
        setAvisos((prevAvisos) => ({
            ...prevAvisos,
            [userType]: prevAvisos[userType].filter((aviso) => aviso.id !== id),
        }));
    };

    const getChipColor = (level: ImportanceLevel) => {
        switch (level) {
            case "low":
                return "success";
            case "medium":
                return "warning";
            case "high":
                return "danger";
        }
    };

    return (
        <section className="flex flex-col gap-y-4 p-4">
            {/* Header */}
            <section className="flex w-full justify-between items-center">
                <h1 className="text-3xl font-bold">
                    Avisos ({userType === "admin" ? "Administradores" : "Docentes"})
                </h1>
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
                {avisos[userType].length === 0 ? (
                    <p className="text-gray-500">No hay avisos disponibles.</p>
                ) : (
                    avisos[userType].map((aviso) => (
                        <div
                            key={aviso.id}
                            className="p-4 bg-[#191919] rounded-lg shadow flex justify-between items-center"
                        >
                            <div className="flex items-center gap-4">
                                <Chip color={getChipColor(aviso.importance)} size="sm">
                                    {aviso.importance === "low"
                                        ? "Baja"
                                        : aviso.importance === "medium"
                                        ? "Media"
                                        : "Alta"}
                                </Chip>
                                <span>{aviso.text}</span>
                            </div>
                            {isAdmin && (
                                <Button
                                    onPress={() => handleDeleteAviso(aviso.id)}
                                    className="min-w-0 p-0 bg-transparent text-red-500 hover:text-red-700"
                                >
                                    <Delete01Icon size={20} color={"#fff"} />
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
                                        onChange={(e) => {
                                            setNewAvisoText(e.target.value);
                                            setErrorMessage(""); // Limpiar error al escribir
                                        }}
                                        className="w-full"
                                        color={errorMessage ? "danger" : "default"}
                                    />
                                    {errorMessage && (
                                        <p className="text-danger text-sm mt-2">
                                            {errorMessage}
                                        </p>
                                    )}
                                    <div className="flex flex-col mt-4 gap-2">
                                        <label className="font-medium">Importancia</label>
                                        <div className="flex gap-2">
                                            {(["low", "medium", "high"] as ImportanceLevel[]).map((level) => (
                                                <Button
                                                    key={level}
                                                    onPress={() => setImportance(level)}
                                                    className={`${
                                                        importance === level
                                                            ? "border-2 border-current"
                                                            : ""
                                                    }`}
                                                    style={{
                                                        backgroundColor:
                                                            importance === level
                                                                ? `var(--${getChipColor(level)}-500)`
                                                                : `var(--${getChipColor(level)}-200)`,
                                                        color: "white",
                                                    }}
                                                >
                                                    {level === "low"
                                                        ? "Baja"
                                                        : level === "medium"
                                                        ? "Media"
                                                        : "Alta"}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
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
