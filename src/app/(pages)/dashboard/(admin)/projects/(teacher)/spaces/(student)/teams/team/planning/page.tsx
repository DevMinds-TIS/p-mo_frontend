"use client";
import { Card, CardBody, CardFooter, Chip, CircularProgress, getKeyValue, Image, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea } from "@nextui-org/react";

const rows = [
    {
        key: "1",
        name: "Tony Reichert",
        role: "CEO",
        status: "Active",
    },
    {
        key: "2",
        name: "Zoey Lang",
        role: "Technical Lead",
        status: "Paused",
    },
    {
        key: "3",
        name: "Jane Fisher",
        role: "Senior Developer",
        status: "Active",
    },
    {
        key: "4",
        name: "William Howard",
        role: "Community Manager",
        status: "Vacation",
    },
];

const columns = [
    {
        key: "name",
        label: "NAME",
    },
    {
        key: "role",
        label: "ROLE",
    },
    {
        key: "status",
        label: "STATUS",
    },
];

export default function PlanningPage() {
    return (
        <section>
            <div>
                <h1 className="text-3xl p-4">
                    Sprint #1
                </h1>
            </div>
            <div className="p-4 flex gap-4 justify-between">
                <Card
                    className="border-none bg-background/60 dark:bg-default-100/50 w-[75%]"
                    shadow="sm"
                >
                    <CardBody>
                        <Textarea
                            isDisabled
                            size="lg"
                            labelPlacement="outside"
                            label="Objetivo"
                            defaultValue="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum tenetur sed fugiat! Cum totam delectus sapiente odio, dolore, quas at dignissimos accusantium voluptas voluptatibus commodi, dicta sunt vitae recusandae officiis."
                        />
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
                    Historias de usuario
                </h1>
            </div>
            <div className="p-4">
                <Table aria-label="Example table with dynamic content">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={rows}>
                        {(item) => (
                            <TableRow key={item.key}>
                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Tareas
                </h1>
            </div>
            <div className="p-4">
                <Table aria-label="Example table with dynamic content">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={rows}>
                        {(item) => (
                            <TableRow key={item.key}>
                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Entregables
                </h1>
            </div>
            <div className="p-4">
                <Table aria-label="Example table with dynamic content">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={rows}>
                        {(item) => (
                            <TableRow key={item.key}>
                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Autoevaluaciones
                </h1>
            </div>
            <div>
                <h1 className="text-3xl p-4">
                    Evaluación de pares
                </h1>
            </div>
        </section>
    );
}