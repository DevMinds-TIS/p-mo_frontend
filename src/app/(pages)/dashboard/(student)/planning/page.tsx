"use client";

import { Link, RangeCalendar } from "@nextui-org/react";
import NewSprint from "./NewSprint";
import { isWeekend, parseDate } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";


export default function PlanningPage() {
    const minDate = parseDate("2024-09-02");
    const maxDate = parseDate("2024-09-13");
    let { locale } = useLocale();

    return (
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between">
                <h1 className="text-4xl">Sprint's</h1>
                <NewSprint />
            </section>
            <section className="flex flex-col w-fit space-y-4">
                <Link
                    href="/dashboard/planning/details"
                    className="bg-[#EA6611] rounded-lg justify-center p-4 text-white"
                >
                    Sprint #1
                </Link>
                <RangeCalendar
                    aria-label="Date (Read Only)"
                    isReadOnly
                    allowsNonContiguousRanges
                    defaultValue={{
                        start: minDate,
                        end: maxDate,
                    }}
                    isDateUnavailable={(date) => isWeekend(date, locale)}
                />
            </section>
        </section>
    );
}