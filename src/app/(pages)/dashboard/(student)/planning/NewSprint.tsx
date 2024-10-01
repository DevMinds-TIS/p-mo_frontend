import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Calendar, RangeCalendar, Input } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import React from "react";

export default function NewSprint() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    let { locale } = useLocale();
    const [sprint, setSprint] = React.useState("");

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30}/>
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center" className="w-fit">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear equipo</ModalHeader>
                            <ModalBody>
                                <Input
                                    value={sprint}
                                    onValueChange={setSprint}
                                    label="Numeración de sprint"
                                    placeholder="Escribe el numero de sprint"
                                    errorMessage="Este nombre ya esta registrado"
                                    maxLength={15}
                                />
                                <RangeCalendar
                                    allowsNonContiguousRanges
                                    defaultValue={{
                                        start: today(getLocalTimeZone()),
                                        end: today(getLocalTimeZone()).add({ weeks: 1 }),
                                    }}
                                    isDateUnavailable={(date) => isWeekend(date, locale)}
                                />
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