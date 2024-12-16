import { Avatar, Button, Popover, PopoverContent, PopoverTrigger, Tooltip, User } from "@nextui-org/react";
import Image from "next/image";
import LogIn from "./LogIn";
import SingUp from "./SingUp";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logout03Icon } from "hugeicons-react";
import { useRouter } from "next/navigation";

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
};

type Docente = {
    Nombre: string;
    Apellido: string;
};

type User = {
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil?: string;
    Roles: Role[];
    user?: Docente;
};

const navItems: { [key: number]: { href: string, label: string }[] } = {
    1: [
        { href: "/dashboard/projects", label: "Proyectos" },
        { href: "/dashboard/roles", label: "Roles" },
        { href: "/dashboard/notification", label: "Notificaciones" },
    ],
    2: [
        { href: "/dashboard/projects", label: "Proyectos" },
        { href: "/dashboard/reportes", label: "Reportes" },
        { href: "/dashboard/notification", label: "Notificaciones" },
    ],
    3: [
        { href: "/dashboard/projects", label: "Proyectos" },
        { href: "/dashboard/notification", label: "Notificaciones" },
    ],
};


export default function Header() {
    const [isLoginPopoverOpen, setIsLoginPopoverOpen] = useState(false);
    const [isRegisterPopoverOpen, setIsRegisterPopoverOpen] = useState(false);
    const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const fetchUserData = async () => {
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
                console.log(data);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            }
        };
        fetchUserData();
    }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }


      const response = await fetch(`${backendUrl}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });


      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }


      localStorage.removeItem('token');
      router.push('/landing');


      console.log('Cierre de sesión exitoso');
    } catch (error) {
      console.error('Error:', error);
    }
  };

    return (
        <header className="py-2 gap-4 flex lg:flex-nowrap flex-wrap px-2 lg:justify-between justify-center bg-black">
            <div className="sm:ml-4 ml-1 flex sm:gap-4 gap-2 lg:justify-start justify-center items-center lg:w-1/3 w-full">
                <Image
                    src="/p-mo.svg"
                    alt="Logo de la aplicación"
                    width={50}
                    height={65}
                    className="md:h-10 md:w-auto"
                />
                <p className="text-inherit flex">Project Management Officer</p>
                <Image
                    src="/umss-logo.png"
                    alt="Logo de la universidad"
                    width={165}
                    height={60}
                    className="bg-white p-1 rounded-lg sm:w-[165px] w-[100px]"
                />
            </div>
            {
                user ?
                    <div className="flex gap-4 items-center justify-center">
                        {navItems[user?.Roles?.[0]?.ID_Rol].map((item) => {
                            return <a key={item.href} href={item.href}>{item.label}</a>;
                        })}
                    </div>
                    :
                    null
            }

            <div className="flex items-center lg:justify-end justify-center gap-4 justify-self-end lg:w-1/3 w-full">
                {user ? <>
                    <div className={`flex items-center gap-x-2 p-2 hover:scale-105 hover:bg-[#2e6cb5] hover:rounded-lg hover:text-white hover:cursor-pointer ${isProfilePopoverOpen ? "bg-[#2e6cb5] text-white" : ""} rounded-lg`}>
                        <Popover placement="bottom-end" className="gap-x-4" onOpenChange={(open) => setIsProfilePopoverOpen(open)}>
                            <PopoverTrigger>
                                <Avatar
                                    name={!user?.Perfil ? `${user?.Nombre?.[0] || ''}${user?.Apellido?.[0] || ''}` : undefined}
                                    src={user?.Perfil ? `${storageUrl}/${user.Perfil}` : undefined}
                                    size="md"
                                />
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="flex flex-col px-1 py-2 gap-y-2">
                                    <Link href={"/dashboard/profile"} className="hover:border-1 hover:rounded-lg p-1 flex items-center w-full" color="foreground">
                                        <Tooltip content="Editar perfil" placement="left">
                                            <User
                                                name={`${user?.Nombre} ${user?.Apellido}`}
                                                description={user?.Correo}
                                                avatarProps={{
                                                    name: !user?.Perfil ? `${user?.Nombre?.[0] || ''}${user?.Apellido?.[0] || ''}` : undefined,
                                                    src: user?.Perfil ? `${storageUrl}/${user.Perfil}` : undefined,
                                                }}
                                            />
                                        </Tooltip>
                                    </Link>
                                    <Button
                                        className="bg-[#FF0000] min-w-1 text-white"
                                        onClick={handleLogout}
                                    >
                                        <Logout03Icon />
                                        <p>Cerrar sesión</p>
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </>
                    :
                    <>
                        <Popover
                            placement="left"
                            className="gap-x-4"
                            onOpenChange={(open) => setIsLoginPopoverOpen(open)}
                        >
                            <PopoverTrigger>
                                <button
                                    className={`flex items-center gap-x-2 p-2 hover:scale-105 bg-[#2e6cb5] text-white hover:cursor-pointer rounded-lg`}
                                >
                                    Iniciar Sesión
                                </button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <LogIn />
                            </PopoverContent>
                        </Popover>
                        <Popover
                            placement="left"
                            className="gap-x-4"
                            onOpenChange={(open) => setIsRegisterPopoverOpen(open)}
                        >
                            <PopoverTrigger>
                                <button
                                    className={`flex items-center gap-x-2 p-2 hover:scale-105 bg-[#2e6cb5] text-white hover:cursor-pointer rounded-lg`}
                                >
                                    Registrarme
                                </button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <SingUp />
                            </PopoverContent>
                        </Popover>
                    </>
                }
                {/* <ThemeSwitcher /> */}
            </div>
        </header>
    );
}
