"use client";

import { FileUpload } from "@/app/_lib/components/FileUpload";
import { Avatar, Input, Skeleton, User } from "@nextui-org/react";
import { PencilEdit01Icon } from "hugeicons-react";
import { useState, useEffect } from "react";
import UpdateProfile from "./update/Profile";

type Role = {
    idroleuser: number;
    idrol: number;
};

type Docente = {
    nameuser: string;
    lastnameuser: string;
    emailuser: string;
    profileuser?: string;
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
                <div className="flex w-full h-10 justify-between items-center">
                    <h1 className="text-3xl">Datos personales</h1>
                </div>
                <div className="flex w-full">
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
                </div>
            </section>
        );
    }

    const isStudent = user.roles.some((role) => role.idrol === 3);

    return (
        <section className="flex flex-col gap-y-8 p-4">
            <div className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Perfil</h1>
            </div>
            <div className="flex">
                <div className="w-[30%] flex flex-col text-center">
                    <h1 className="font-bold text-xl">
                        Datos personales
                    </h1>
                    <div className="flex justify-center">
                        <Avatar
                            name={`${user.nameuser?.[0] || ""}${user.lastnameuser?.[0] || ""}`}
                            src={user.profileuser || undefined}
                            className="w-52 h-52 text-7xl"
                        />
                    </div>
                    <p className="text-xl font-bold">
                        {`${user.nameuser} ${user.lastnameuser}`}
                    </p>
                    <p className="font-light">
                        {user.emailuser}
                    </p>
                    {isStudent && user.user && (
                        <div>
                            <User
                                name={`${user.user.nameuser} ${user.user.lastnameuser}`}
                                description={user.user.emailuser}
                                avatarProps={{
                                    name: !user.user.profileuser ? `${user.user.nameuser?.[0] || ''}${user.user.lastnameuser?.[0] || ''}` : undefined,
                                    src: user.user.profileuser || undefined,
                                }}
                                className="border w-fit p-2"
                            />
                        </div>
                    )}
                </div>
                <div className="w-[70%] bg-teal-600">

                </div>
            </div>
        </section>
    );
}