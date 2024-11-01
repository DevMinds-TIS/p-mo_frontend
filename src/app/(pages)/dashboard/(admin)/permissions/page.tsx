// import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
// import NewPermission from "./NewPermission";

// export default function PermissionsPage() {
//     const rows = [
//         {
//             key: "1",
//             name: "Tony Reichert",
//             role: "CEO",
//             status: "Active",
//         },
//         {
//             key: "2",
//             name: "Zoey Lang",
//             role: "Technical Lead",
//             status: "Paused",
//         },
//         {
//             key: "3",
//             name: "Jane Fisher",
//             role: "Senior Developer",
//             status: "Active",
//         },
//         {
//             key: "4",
//             name: "William Howard",
//             role: "Community Manager",
//             status: "Vacation",
//         },
//     ];

//     const columns = [
//         {
//             key: "name",
//             label: "NAME",
//         },
//         {
//             key: "role",
//             label: "ROLE",
//         },
//         {
//             key: "status",
//             label: "STATUS",
//         },
//     ];

//     return (
//         <section>
//             <div className="flex justify-between">
//                 <h1 className="text-4xl">
//                     Permisos
//                 </h1>
//                 <NewPermission />
//             </div>
//             <div>
//                 <Table aria-label="Example table with dynamic content">
//                     <TableHeader columns={columns}>
//                         {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
//                     </TableHeader>
//                     <TableBody items={rows}>
//                         {(item) => (
//                             <TableRow key={item.key}>
//                                 {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>
//         </section>
//     );
// }

"use client";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Chip, User } from "@nextui-org/react";
import NewPermission from "./NewPermission";
import { EditIcon, DeleteIcon } from "@nextui-org/shared-icons";
import { EyeIcon } from "hugeicons-react";
import React from "react";

type Column = {
    name: string;
    uid: string;
};

type Users = {
    id: number;
    name: string;
    role: string;
    team: string;
    age: string;
    avatar: string;
    email: string;
}

export default function PermissionsPage() {
    const columns: Column[] = [
        { name: "NOMBRE", uid: "name" },
        { name: "PERMISO", uid: "role" },
        { name: "ACCIÓN", uid: "actions" },
    ];

    const users: Users[] = [
        {
            id: 1,
            name: "Tony Reichert",
            role: "CEO",
            team: "Management",
            age: "29",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            email: "tony.reichert@example.com",
        },
        {
            id: 2,
            name: "Zoey Lang",
            role: "Technical Lead",
            team: "Development",
            age: "25",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            email: "zoey.lang@example.com",
        },
        {
            id: 3,
            name: "Jane Fisher",
            role: "Senior Developer",
            team: "Development",
            age: "22",
            avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            email: "jane.fisher@example.com",
        },
        {
            id: 4,
            name: "William Howard",
            role: "Community Manager",
            team: "Marketing",
            age: "28",
            avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
            email: "william.howard@example.com",
        },
        {
            id: 5,
            name: "Kristen Copper",
            role: "Sales Manager",
            team: "Sales",
            age: "24",
            avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
            email: "kristen.cooper@example.com",
        },
    ];

    const renderCell = React.useCallback((user: Users, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof Users];

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

    return (
        <section>
            <div className="flex justify-between">
                <h1 className="text-4xl">Permisos</h1>
                <NewPermission />
            </div>
            <div className="p-4">
                <Table aria-label="Example table with custom cells">
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid} >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={users} emptyContent={"No hay datos para mostrar"}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
