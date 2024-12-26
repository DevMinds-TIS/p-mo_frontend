import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    RangeCalendar,
    Input
} from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface NewSprintProps {
    onCreateSprint: (sprintData: {
        number: string;
        objective: string;
        startDate: string;
        endDate: string;
    }) => void;
}

type User = {
    ID_Usuario: number;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil?: string;
    ID_Docente: number;
    //  Roles?: Role[];
};

export default function NewSprint({ onCreateSprint }: NewSprintProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    let { locale } = useLocale();

    const [sprintNumber, setSprintNumber] = useState("");
    const [sprintObjective, setSprintObjective] = useState("");
    const [sprintHU, setSprintHU] = useState("");
    const [dateRange, setDateRange] = useState({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({ weeks: 1 })
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);

            // Crear un objeto User y asignarlo al estado
            const userToStore: User = {
                ID_Usuario: userData.ID_Usuario,
                Nombre: userData.Nombre,
                Apellido: userData.Apellido,
                Correo: userData.Correo,
                Perfil: userData.Perfil,
                ID_Docente: userData.ID_Docente,
            };

            // Establecer el estado con los datos del usuario
            setUser(userToStore);

            console.log('Usuario almacenado en el estado:', userToStore);
        } else {
            console.error('No se encontró userData en sessionStorage');
        }
    }, []);



    const handleSave = async () => {
        setIsLoading(true);
        setError(null);
        const storedUserData = sessionStorage.getItem('userData');

        const sprintData = {
            numsprint: sprintNumber, // Cambia esto según sea necesario para tu lógica de planificación
            startsprint: dateRange.start.toString(),
            endsprint: dateRange.end.toString(),
            goalsprint: sprintObjective,
            iduser: user?.ID_Usuario,
            iddocente: user?.ID_Docente,
            idteam: 2,
            cantHistoriasUsuario: sprintHU,
        };
        //console.log("datos de registro docente", sprintData.data);

        try {
            // Enviar datos al backend
            const response = await axios.post("http://localhost:8000/api/sprint", sprintData);
            console.log("Response:", response);

            // Manejar respuesta correcta
            if (response.status >= 200 && response.status < 300) {
                // Registrar localmente el sprint creado
                onCreateSprint({
                    number: `Sprint #${sprintNumber}`,
                    objective: sprintObjective,
                    startDate: dateRange.start.toString(),
                    endDate: dateRange.end.toString(),
                });

                // Cerrar modal
                onOpenChange();
            } else {
                console.error("Unexpected status code:", response.status);
                setError("El servidor respondió con un código inesperado.");
            }
        } catch (error: any) {
            console.error("Error response:", error.response);
            console.error("Error message:", error.message);
            setError(error.response?.data?.message || "Error desconocido al registrar el sprint.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior="outside"
                backdrop="blur"
                placement="center"
                className="w-fit"
            >
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear Sprint</ModalHeader>
                            <ModalBody>
                                <Input
                                    value={sprintNumber}
                                    onValueChange={setSprintNumber}
                                    label="Numeración de sprint"
                                    placeholder="Escribe el número del sprint"
                                    errorMessage={error && "Error en la numeración del sprint"}
                                    maxLength={15}
                                />
                                <Input
                                    value={sprintObjective}
                                    onValueChange={setSprintObjective}
                                    label="Objetivo del sprint"
                                    placeholder="Escribe el objetivo de este sprint"
                                    errorMessage={error && "Error en el objetivo del sprint"}
                                    maxLength={255}
                                />
                                <Input
                                    value={sprintHU}
                                    onValueChange={setSprintHU}
                                    label="Cantidad de Historias de ususario"
                                    placeholder="Escribe la cantidad de este Historias de usuario"
                                    errorMessage={error && "Error en la cantidad de historias de usuarios del sprint"}
                                    maxLength={10}
                                />
                                <RangeCalendar
                                    value={dateRange}
                                    onChange={setDateRange}
                                    allowsNonContiguousRanges
                                    isDateUnavailable={(date) => isWeekend(date, locale)}
                                />
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onPress={handleSave}
                                    className={`w-full ${sprintNumber && sprintObjective && sprintHU && !isLoading
                                        ? "bg-orange-500 hover:bg-orange-600"
                                        : "bg-gray-300 cursor-not-allowed"}`}
                                    isDisabled={!sprintNumber || !sprintObjective || !sprintHU || isLoading}
                                >
                                    {isLoading ? "Guardando..." : "Guardar"}
                                </Button>

                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
