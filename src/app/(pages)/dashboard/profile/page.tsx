"use client";

import { Avatar, Input, Skeleton } from "@nextui-org/react";
import { PencilEdit01Icon } from "hugeicons-react";
import { useState, useEffect } from "react";

type Role = {
    idroleuser: number;
    idrol: number;
};

type Docente = {
    nameuser: string;
    lastnameuser: string;
};

type User = {
    nameuser: string;
    lastnameuser: string;
    emailuser: string;
    profileuser?: string;
    roles: Role[];
    user?: Docente;
};

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/user", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener los datos del usuario");
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (!user) {
        return (
            <section className="flex flex-col gap-y-8">
                <section className="flex w-full h-10 justify-between items-center">
                    <h1 className="text-3xl">Datos personales</h1>
                </section>
                <section className="flex w-full">
                    <Skeleton className="w-52 h-52 rounded-full" />
                    <section className="p-2 flex flex-col gap-4 grow justify-center">
                        <div className="flex gap-4">
                            <Skeleton className="h-14 w-full rounded-lg" />
                            <Skeleton className="h-14 w-full rounded-lg" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-14 w-full rounded-lg" />
                            <Skeleton className="h-14 w-full rounded-lg" />
                        </div>
                    </section>
                </section>
            </section>
        );
    }

    const isStudent = user.roles.some((role) => role.idrol === 3);

    return (
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Datos personales</h1>
            </section>
            <section className="flex w-full">
                <Avatar
                    name={`${user.nameuser?.[0] || ""}${user.lastnameuser?.[0] || ""}`}
                    src={user.profileuser || undefined}
                    className="w-52 h-52 text-7xl"
                />
                <section className="p-2 flex flex-col gap-4 grow justify-center">
                    <div className="flex gap-4">
                        <Input
                            label="Nombre"
                            value={`${user.nameuser} ${user.lastnameuser}`}
                            isDisabled
                        />
                        <PencilEdit01Icon className="bg-[#FF9B5A] rounded-lg p-1" size={60} />
                        <Input
                            label="Correo electrónico"
                            type="email"
                            value={user.emailuser}
                            isDisabled
                        />
                        <PencilEdit01Icon
                            className="bg-[#FF9B5A] rounded-lg p-1"
                            size={60}
                            color={"#FFFFFF"}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Input
                            label="Contraseña"
                            type="password"
                            value="********"
                            isDisabled
                        />
                        <PencilEdit01Icon
                            className="bg-[#FF9B5A] rounded-lg p-1"
                            size={60}
                            color={"#FFFFFF"}
                        />
                        {isStudent && user.user && (
                            <>
                                <Input
                                    label="Docente"
                                    value={`${user.user.nameuser} ${user.user.lastnameuser}`}
                                    isDisabled
                                />
                                <PencilEdit01Icon className="bg-[#FF9B5A] rounded-lg p-1" size={60} />
                            </>
                        )}
                    </div>
                </section>
            </section>
        </section>
    );
}