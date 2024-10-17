import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { isWeekend } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";

export default function NewProject() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const currentYear = new Date().getFullYear();

    const minDate = parseDate(`${currentYear}-01-01`);
    const maxDate = parseDate(`${currentYear}-12-31`);

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear proyecto</ModalHeader>
                            <form action="">
                                <ModalBody>
                                    <Input
                                        label="Nombre del proyecto"
                                        placeholder="Escribe el nombre del proyecto"
                                    />
                                    <Input
                                        label="Código del proyecto"
                                        placeholder="Escribe el código del proyecto"
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
                                    <div className="space-y-2">
                                        <p>Invitación del proyecto</p>
                                        <FileUpload />
                                    </div>
                                    <div className="space-y-2">
                                        <p>Pliego de especificaciones del proyecto</p>
                                        <FileUpload />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onPress={onClose} className="w-full">
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