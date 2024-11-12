"use client";

import { RangeCalendar } from "@nextui-org/react";
import NewSprint from "./NewSprint";
import { isWeekend, parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import Link from "next/link";

export default function PlanningPage() {
    const minDate = parseDate("2024-09-02");
    const maxDate = parseDate("2024-09-13");

    return (
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Sprints</h1>
                <NewSprint />
            </section>
            <section className="flex flex-col w-fit space-y-4">
                <Link
                    href="/dashboard/planning/details"
                    className="bg-[#EA6611] rounded-lg text-center p-4 text-white"
                >
                    Sprint #1
                </Link>
                <I18nProvider locale="es-BO">
                    <RangeCalendar
                        aria-label="Date (Read Only)"
                        isReadOnly
                        allowsNonContiguousRanges
                        defaultValue={{
                            start: minDate,
                            end: maxDate,
                        }}
                        isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                    />
                </I18nProvider>
            </section>
        </section>
    );
}