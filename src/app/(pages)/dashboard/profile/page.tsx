"use client";
import { Avatar, Divider, Skeleton, User as NextUser } from "@nextui-org/react";
import { useState, useEffect } from "react";
import UpdateProfile from "./UpdateProfile";

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
};

type Docente = {
    Nombre: string;
    Apellido: string;
    Correo: string;
    Imagen_Perfil?: string;
};

type User = {
    ID_Usuario: number;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Imagen_Perfil?: string;
    Roles: Role[];
    Docente?: Docente;
};

export default function Profile() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/user`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los datos del usuario");
                }

                const data = await response.json();
                setUser(data.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [backendUrl]);

    if (isLoading || !user) {
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

    const isStudent = user?.Roles?.some(role => role.ID_Rol === 3) ?? false;
    console.log("Role", isStudent);

    return (
        <section className="flex flex-col gap-y-8 p-4">
            <div className="flex w-full h-10 justify-between items-center">
                <h1 className="text-2xl sm:text-3xl">Perfil</h1>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-[40%] lg:w-[30%] flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h1 className="font-bold text-lg md:text-xl">
                            Datos personales
                        </h1>
                        <UpdateProfile />
                    </div>
                    <div className="flex justify-center">
                        <Avatar
                            name={`${user.Nombre?.[0] || ""}${user.Apellido?.[0] || ""}`}
                            src={user.Imagen_Perfil || undefined}
                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 text-6xl md:text-7xl"
                        />
                    </div>
                    <p className="text-lg sm:text-xl font-bold">
                        {`${user.Nombre} ${user.Apellido}`}
                    </p>
                    <p className="font-light text-sm sm:text-base">
                        {user.Correo}
                    </p>
                    {isStudent && user.Docente && (
                        <div className="flex flex-col gap-2">
                            <Divider />
                            <NextUser
                                name={`${user.Docente.Nombre} ${user.Docente.Apellido}`}
                                description={user.Docente.Correo}
                                avatarProps={{
                                    name: !user.Docente.Imagen_Perfil ? `${user.Docente.Nombre?.[0] || ''}${user.Docente.Apellido?.[0] || ''}` : undefined,
                                    src: user.Docente.Imagen_Perfil || undefined,
                                }}
                                className="justify-start"
                            />
                            <Divider />
                        </div>
                    )}
                </div>
                <div className="w-full md:w-[60%] lg:w-[70%] bg-teal-600 p-4">
                </div>
            </div>
        </section>
    );
}
