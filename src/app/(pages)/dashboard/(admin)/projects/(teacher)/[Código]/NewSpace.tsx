import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, DateRangePicker } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { parseDate, isWeekend, DateValue } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";

type Project = {
    idproject: number;
    startproject: Date;
    endproject: Date;
};

type User = {
    iduser: number;
    nameuser: string;
    lastnameuser: string;
};

type NewSpaceProps = { 
    params: { ID_Proyecto: number }; 
    startDate: Date; 
    endDate: Date;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchUser = async (): Promise<User> => {
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

    const data: User = await response.json();
    return data;
};

export default function NewSpace({ params, startDate, endDate }: NewSpaceProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [minDate, setMinDate] = useState<DateValue>(parseDate(new Date().toISOString().split('T')[0]));
    const [maxDate, setMaxDate] = useState<DateValue>(parseDate(new Date().toISOString().split('T')[0]));
    const [namespace, setNamespace] = useState<string>("");
    const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue }>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });
    const [registrationRange, setRegistrationRange] = useState<{ start: DateValue; end: DateValue }>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });
    const [limitspace, setLimitspace] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const handleFileChange = (newFile: File | null) => {
        setFile(newFile);
    };

    useEffect(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!isNaN(start.getTime())) {
            setMinDate(parseDate(start.toISOString().split('T')[0]));
        }
        if (!isNaN(end.getTime())) {
            setMaxDate(parseDate(end.toISOString().split('T')[0]));
        }
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
                setNamespace(`${userData.nameuser} ${userData.lastnameuser}`);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };
        fetchUserData();
    }, [startDate, endDate]);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        const formData = new FormData();
        formData.append("namespace", namespace);
        formData.append("startspace", dateRange.start ? dateRange.start.toString() : "");
        formData.append("endspace", dateRange.end ? dateRange.end.toString() : "");
        formData.append("starregistrationspace", registrationRange.start ? registrationRange.start.toString() : "");
        formData.append("endregistrationspace", registrationRange.end ? registrationRange.end.toString() : "");
        formData.append("limitspace", limitspace !== null ? limitspace.toString() : "");
        formData.append("idproject", params.ID_Proyecto.toString());
        if (user) {
            formData.append("iduser", user.iduser.toString());
        }

        if (file) {
            formData.append("file", file);
        }

        try {
            const response = await fetch(`${backendUrl}/spaces`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al crear el espacio");
            }

            const result = await response.json();
            console.log("Espacio creado exitosamente:", result);
            onOpenChange();
        } catch (error) {
            console.error("Error al crear el espacio:", error);
        }
    };

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">Crear espacio</ModalHeader>
                            <ModalBody>
                                <Input 
                                    label="Nombre del espacio" 
                                    placeholder="Digite el nombre del espacio" 
                                    value={namespace} 
                                    onChange={(e) => setNamespace(e.target.value)} 
                                />
                                <I18nProvider locale="es-BO">
                                    <DateRangePicker
                                        allowsNonContiguousRanges
                                        isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                                        label="Duración del proyecto"
                                        minValue={minDate}
                                        maxValue={maxDate}
                                        visibleMonths={3}
                                        pageBehavior="single"
                                        value={dateRange}
                                        onChange={setDateRange}
                                    />
                                </I18nProvider>
                                <I18nProvider locale="es-BO">
                                    <DateRangePicker
                                        allowsNonContiguousRanges
                                        isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                                        label="Fase de inscripciones (estudiantes y equipos)"
                                        minValue={minDate}
                                        maxValue={maxDate}
                                        visibleMonths={2}
                                        pageBehavior="single"
                                        value={registrationRange}
                                        onChange={setRegistrationRange}
                                    />
                                </I18nProvider>
                                <Input 
                                    label="Límite de integrantes" 
                                    placeholder="Digite el límite de integrantes para sus equipos" 
                                    type="number" 
                                    value={limitspace !== null ? limitspace.toString() : ""}
                                    onChange={(e) => setLimitspace(Number(e.target.value))} 
                                />
                                <div>
                                    <p>Lista de alumnos</p>
                                    <FileUpload onChange={handleFileChange} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" className="w-full">Guardar</Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
