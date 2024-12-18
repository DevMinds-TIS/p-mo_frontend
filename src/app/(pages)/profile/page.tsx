"use client";

import ProfileSkeletons from "@/app/_lib/components/skeletons/ProfileSkeletons";
import { Alert, Avatar, Divider, User } from "@nextui-org/react";
import { useUser } from "@/contexts/UserContext";
import { useAlert } from "@/contexts/AlertContext";
import UpdateProfile from "./UpdateProfile";
import { ComingSoon02Icon } from "hugeicons-react";
import { useEffect } from "react";

export default function Profile() {
    const { alertTitle, alertDescription, alertVisible, alertColor, hideAlert } = useAlert();
    const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;
    const { user, fetchUser } = useUser();

    useEffect(() => {
        if (!user) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').ID_Usuario;
            fetchUser(userId);
        }
    }, [user, fetchUser]);

    if (!user) {
        return <ProfileSkeletons />;
    }

    const isStudent = user.Roles.some(role => role.ID_Rol === 3);

    return (
        <section className="flex flex-col gap-y-8 p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-[40%] lg:w-[30%] flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <h1 className="font-bold text-lg md:text-xl">
                            Datos personales
                        </h1>
                        <UpdateProfile />
                    </div>
                    <div className="flex justify-center">
                        <Avatar
                            name={!user?.Perfil ? `${user?.Nombre?.[0] || ''}${user?.Apellido?.[0] || ''}` : undefined}
                            src={user?.Perfil ? `${storageUrl}/${user.Perfil}` : undefined}
                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 text-6xl md:text-7xl"
                        />
                    </div>
                    <p className="text-lg sm:text-xl font-bold">
                        {`${user.Nombre} ${user.Apellido}`}
                    </p>
                    <p className="font-light text-sm text-gray-500 sm:text-base">
                        {user.Correo}
                    </p>
                    {isStudent && user.Docente && (
                        <div className="flex flex-col gap-2">
                            <Divider />
                            <User
                                name={`${user.Docente.Nombre} ${user.Docente.Apellido}`}
                                description={user.Docente.Correo}
                                avatarProps={{
                                    name: !user?.Perfil ? `${user?.Nombre?.[0] || ''}${user?.Apellido?.[0] || ''}` : undefined,
                                    src: user.Docente.Perfil ? `${storageUrl}/${user.Docente.Perfil}` : undefined,
                                }}
                                className="justify-start"
                            />
                            <Divider />
                        </div>
                    )}
                </div>
                <div className="flex w-full md:w-[60%] lg:w-[70%] p-4 justify-center items-center">
                    <ComingSoon02Icon size={80} />
                    <h1 className="text-2xl font-bold">Novedades, próximamente</h1>
                </div>
            </div>
            {alertVisible && (
                <div className="alert-fixed">
                    <Alert
                        color={alertColor}
                        title={alertTitle}
                        description={alertDescription}
                        onClose={hideAlert}
                        variant="solid"
                    />
                </div>
            )}
        </section>
    );
}