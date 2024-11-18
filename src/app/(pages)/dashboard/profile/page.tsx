"use client";
import { Avatar, Divider, Skeleton, User } from "@nextui-org/react";
import { useState, useEffect } from "react";
import UpdateProfile from "./UpdateProfile";

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
                setUser(data);
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
            <section className="flex flex-col gap-y-8 p-4">
                <div className="flex w-full h-10 justify-between items-center">
                    <h1 className="text-3xl">Datos personales</h1>
                </div>
                <div className="flex flex-col md:flex-row w-full gap-4">
                    <Skeleton className="w-36 h-36 md:w-52 md:h-52 rounded-full" />
                    <section className="p-2 flex flex-col gap-4 grow justify-center">
                        <div className="flex flex-col md:flex-row gap-4">
                            <Skeleton className="h-12 md:h-14 w-full rounded-lg" />
                            <Skeleton className="h-12 md:h-14 w-full rounded-lg" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Skeleton className="h-12 md:h-14 w-full rounded-lg" />
                            <Skeleton className="h-12 md:h-14 w-full rounded-lg" />
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
                <h1 className="text-2xl md:text-3xl">Perfil</h1>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Columna Izquierda */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h1 className="font-bold text-lg md:text-xl">Datos personales</h1>
                        <UpdateProfile />
                    </div>
                    <div className="flex justify-center">
                        <Avatar
                            name={`${user.nameuser?.[0] || ""}${user.lastnameuser?.[0] || ""}`}
                            src={user.profileuser || undefined}
                            className="w-36 h-36 md:w-52 md:h-52 text-5xl md:text-7xl"
                        />
                    </div>
                    <p className="text-lg md:text-xl font-bold">
                        {`${user.nameuser} ${user.lastnameuser}`}
                    </p>
                    <p className="text-sm md:text-base font-light">
                        {user.emailuser}
                    </p>
                    {isStudent && user.user && (
                        <div className="flex flex-col gap-2">
                            <Divider />
                            <User
                                name={`${user.user.nameuser} ${user.user.lastnameuser}`}
                                description={user.user.emailuser}
                                avatarProps={{
                                    name: !user.user.profileuser
                                        ? `${user.user.nameuser?.[0] || ''}${user.user.lastnameuser?.[0] || ''}`
                                        : undefined,
                                    src: user.user.profileuser || undefined,
                                }}
                                className="justify-start"
                            />
                            <Divider />
                        </div>
                    )}
                </div>

                {/* Columna Derecha */}
                <div className="w-full md:w-2/3 bg-teal-600 p-4 rounded-md">
                    {/* Puedes agregar contenido adicional aquí */}
                </div>
            </div>
        </section>
    );
}
