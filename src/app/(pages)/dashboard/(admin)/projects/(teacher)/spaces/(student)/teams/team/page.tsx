"use client";
import { Card, CardBody, CardFooter, Chip, ChipProps, CircularProgress, Image, RangeCalendar, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import { EditIcon, DeleteIcon } from "@nextui-org/shared-icons";
import { EyeIcon, HierarchyIcon, TeacherIcon } from "hugeicons-react";
import Link from "next/link";
import React from "react";
import { isWeekend, parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

type Column = {
    name: string;
    uid: string;
};

type User = {
    id: number;
    name: string;
    role: string;
    team: string;
    status: string;
    age: string;
    avatar: string;
    email: string;
}

export default function TeamPage() {
    const columns: Column[] = [
        { name: "NAME", uid: "name" },
        { name: "ROLE", uid: "role" },
        { name: "STATUS", uid: "status" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const users: User[] = [
        {
            id: 1,
            name: "Tony Reichert",
            role: "CEO",
            team: "Management",
            status: "active",
            age: "29",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            email: "tony.reichert@example.com",
        },
        {
            id: 2,
            name: "Zoey Lang",
            role: "Technical Lead",
            team: "Development",
            status: "paused",
            age: "25",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            email: "zoey.lang@example.com",
        },
        {
            id: 3,
            name: "Jane Fisher",
            role: "Senior Developer",
            team: "Development",
            status: "active",
            age: "22",
            avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            email: "jane.fisher@example.com",
        },
        {
            id: 4,
            name: "William Howard",
            role: "Community Manager",
            team: "Marketing",
            status: "vacation",
            age: "28",
            avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
            email: "william.howard@example.com",
        },
        {
            id: 5,
            name: "Kristen Copper",
            role: "Sales Manager",
            team: "Sales",
            status: "active",
            age: "24",
            avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
            email: "kristen.cooper@example.com",
        },
    ];

    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const minDate = parseDate("2024-09-02");
    const maxDate = parseDate("2024-09-13");

    return (
        <section>
            <div>
                <h1 className="text-3xl p-4">
                    Equipo
                </h1>
            </div>
            <div className="p-4 flex gap-4 justify-between">
                <Card
                    className="border-none bg-background/60 dark:bg-default-100/50 w-[75%]"
                    shadow="sm"
                >
                    <CardBody>
                        <div className="flex items-center justify-center gap-4">
                            <div className="relative col-span-6 md:col-span-4">
                                <Image
                                    alt="Album cover"
                                    className="object-cover"
                                    shadow="md"
                                    src="https://nextui.org/images/album-cover.png"
                                    width="100%"
                                />
                            </div>
                            <div className="w-full h-full flex flex-col justify-between py-2">
                                <div className="flex gap-4">
                                    <TeacherIcon />
                                    <p>Corina Justina Flores Villarroel</p>
                                </div>
                                <div className="flex gap-4">
                                    <HierarchyIcon />
                                    <p>Abel Alejando Quise Mamani</p>
                                </div>
                                <div className="flex gap-4">
                                    <TeacherIcon />
                                    <p>Corina Justina Flores Villarroel</p>
                                </div>
                                <div className="flex gap-4">
                                    <TeacherIcon />
                                    <p>Corina Justina Flores Villarroel</p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="w-[25%] border-none bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <CardBody className="justify-center items-center pb-0">
                        <CircularProgress
                            classNames={{
                                svg: "w-36 h-36 drop-shadow-md",
                                indicator: "stroke-white",
                                track: "stroke-white/10",
                                value: "text-3xl font-semibold text-white",
                            }}
                            value={70}
                            strokeWidth={4}
                            showValueLabel={true}
                        />
                    </CardBody>
                    <CardFooter className="justify-center items-center pt-0">
                        <Chip
                            classNames={{
                                base: "border-1 border-white/30",
                                content: "text-white/90 text-small font-semibold",
                            }}
                            variant="bordered"
                        >
                            2800 Data points
                        </Chip>
                    </CardFooter>
                </Card>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Documentos
                </h1>
            </div>
            <div className="p-4">
                <Table aria-label="Example table with custom cells">
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={users}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Integrantes
                </h1>
            </div>
            <div className="p-4">
                <Table aria-label="Example table with custom cells">
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={users}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Planificación
                </h1>
            </div>
            <div className="p-4">
                <div className="flex flex-col w-fit space-y-4">
                    <Link
                        href="team/planning"
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
                </div>
            </div>
        </section>
    );
}