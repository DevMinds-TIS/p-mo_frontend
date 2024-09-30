import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, ModalProps } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { isWeekend } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { I18nProvider } from "@react-aria/i18n";
import React from "react";
import FileUpload from "@/app/_lib/components/FileUpload";

export default function NewProject() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [value, setValue] = React.useState({
        start: parseDate("2024-04-01"),
        end: parseDate("2024-04-08"),
    });

    let formatter = useDateFormatter({ dateStyle: "long" });
    let { locale } = useLocale();
    const minDate = parseDate("2024-08-12");
    const maxDate = parseDate("2024-12-27");

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent">
                <AddSquareIcon className="w-fit h-full" />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear espacio</ModalHeader>
                            <ModalBody>
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