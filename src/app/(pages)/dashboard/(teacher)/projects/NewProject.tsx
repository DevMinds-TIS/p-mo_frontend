import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { isWeekend } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React from "react";
import FileUpload from "@/app/_lib/components/FileUpload";

export default function NewProject() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const minDate = parseDate("2024-08-12");
    const maxDate = parseDate("2024-12-27");

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30}/>
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear espacio</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Código del proyecto"
                                    placeholder="Escribe el código para enlazar al proyecto general"
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
                                    />
                                </I18nProvider>
                                <Input
                                    label="Limite de integrantes"
                                    placeholder="Digite el limite de integrantes para sus equipos"
                                />
                                <div>
                                    <p>Lista de alumnos</p>
                                    <FileUpload/>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose} className="w-full">
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}