'use client';
import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import NewRole from "./NewRole";
import {
    AccountSetting03Icon,
    ConferenceIcon,
    ConversationIcon,
    HierarchyIcon,
    ManagerIcon,
    StudentIcon,
    TeacherIcon,
    UserGroupIcon
} from "hugeicons-react";
import React, { useEffect, useState } from "react";

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
    Icono_Rol: string;
    Cantidad_Rol: number;
};

const iconMapping: { [key: string]: React.ElementType } = {
    ManagerIcon,
    TeacherIcon,
    StudentIcon,
    HierarchyIcon,
    UserGroupIcon,
    ConversationIcon,
    AccountSetting03Icon,
    ConferenceIcon,
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchRoles = async (): Promise<Role[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${backendUrl}/roles`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los roles');
    }

    const data = await response.json();
    console.log("DataRoles", data.data);
    return data.data;
};

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesData = await fetchRoles();
                setRoles(rolesData);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <section>
            <div className="flex justify-between">
                <h1 className="text-4xl">Roles</h1>
                <NewRole />
            </div>
            <div className="flex flex-wrap grow gap-4 p-3">
                {isLoading ? (
                    [...Array(8)].map((_, index) => (
                        <Card key={index} shadow="sm" isPressable>
                            <CardBody className="overflow-visible p-2 flex items-center">
                                <Skeleton className="w-28 h-12 rounded-lg" />
                            </CardBody>
                            <CardFooter className="text-small gap-4">
                                <Skeleton className="w-full h-4 rounded-lg" />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    roles.map(role => {
                        const RoleIcon = iconMapping[role.Icono_Rol] || UserGroupIcon;
                        return (
                            <Card key={role.ID_Rol} shadow="sm" isPressable>
                                <CardBody className="overflow-visible p-2 flex items-center">
                                    <RoleIcon size={48} />
                                </CardBody>
                                <CardFooter className="text-small gap-4">
                                    <b>{role.Nombre_Rol}</b>
                                    <b>{role.Cantidad_Rol}</b>
                                </CardFooter>
                            </Card>
                        );
                    })
                )}
            </div>
        </section>
    );
}