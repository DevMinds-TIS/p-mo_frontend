import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import {DateRangePicker} from "@nextui-org/react";
import {getLocalTimeZone, parseDate, today} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";
import {isWeekend } from "@internationalized/date";
import {useLocale} from "@react-aria/i18n";
import { I18nProvider } from "@react-aria/i18n";
import React from "react";
import { NextUIProvider } from "@nextui-org/react";

export default function NewProject() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [value, setValue] = React.useState({
        start: parseDate("2024-04-01"),
        end: parseDate("2024-04-08"),
    });

    let formatter = useDateFormatter({dateStyle: "long"});
    let {locale} = useLocale();
    const minDate = parseDate("2024-08-12");
    const maxDate = parseDate("2024-12-27");
  
    return (
      <section>
        <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent">
            <AddSquareIcon className="w-fit h-full"/>
        </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                    <div>
                        <ModalHeader className="flex flex-col gap-1">Crear espacio</ModalHeader>
                        <ModalBody>
                            {/* <div>
                                <DateRangePicker 
                                    label="Duración del proyecto" 
                                    className="max-w-xs"
                                    visibleMonths={3}
                                    pageBehavior="single"
                                    value={value}
                                    onChange={setValue}
                                />
                                <p className="text-default-500 text-sm">
                                    Selected date:{" "}
                                    {value
                                        ? formatter.formatRange(
                                            value.start.toDate(getLocalTimeZone()),
                                            value.end.toDate(getLocalTimeZone()),
                                        )
                                        : "--"}
                                </p>
                            </div>
                            <div className="w-full flex flex-row gap-4">
                                <div className="w-full flex flex-col gap-1">
                                    <h3>Min date</h3>
                                    <DateRangePicker
                                    label="Date and time"
                                    minValue={today(getLocalTimeZone())}
                                    defaultValue={{
                                        start: today(getLocalTimeZone()).subtract({days: 1}),
                                        end: parseDate("2024-04-08"),
                                    }}
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-1">
                                    <h3>Max date</h3>
                                    <DateRangePicker
                                    label="Date and time"
                                    maxValue={today(getLocalTimeZone())}
                                    defaultValue={{
                                        start: today(getLocalTimeZone()).subtract({days: 1}),
                                        end: parseDate("2024-04-08"),
                                    }}
                                    />
                                </div>
                            </div>
                            <DateRangePicker 
                                label="Fase de inscripciones (estudiantes y equipos)" 
                                className="max-w-xs"
                                visibleMonths={2}
                                pageBehavior="single"
                            />
                            <DateRangePicker
                                allowsNonContiguousRanges
                                isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                                label="Time off request"
                                minValue={today(getLocalTimeZone())}
                                visibleMonths={2}
                            /> */}
                            <I18nProvider locale="es-BO">
                                <DateRangePicker
                                    allowsNonContiguousRanges
                                    isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                                    label="Solicitud de tiempo libre"
                                    minValue={minDate}
                                    maxValue={maxDate}
                                    visibleMonths={3}
                                    pageBehavior="single"
                                />
                            </I18nProvider>
                        </ModalBody>
                        <ModalFooter>
                        <Button onPress={onClose} className="w-full">
                            Action
                        </Button>
                        </ModalFooter>
                    </div>
                    )}
                </ModalContent>
            </Modal>
      </section>
    );
  }