'use client';

import Image from "next/image";
import { Avatar, BreadcrumbItem, Breadcrumbs, Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Popover, PopoverContent, PopoverTrigger, Tooltip, User } from "@nextui-org/react";
import Link from 'next/link';
import { Calendar03Icon, FolderLibraryIcon, Logout03Icon, Megaphone01Icon, Menu01Icon, Notification03Icon, TaskDaily01Icon, UserGroupIcon } from "hugeicons-react";
import { useEffect, useState } from 'react';
import { ThemeSwitcher } from "@/app/ThemeSwitcher";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
import ProtectedLayout from "./protected_layout";

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

const getNavItems = (roleId: number): { href: string, icon: any, label: string }[] => {
  const navItems: { [key: number]: { href: string, icon: any, label: string }[] } = {
    1: [
      { href: "/dashboard/announcement", icon: Megaphone01Icon, label: "Anuncios" },
      { href: "/dashboard/test", icon: TaskDaily01Icon, label: "Evaluaciones" },
      { href: "/dashboard/planning", icon: Calendar03Icon, label: "Planificación" },
      { href: "/dashboard/team", icon: UserGroupIcon, label: "Equipo" },
      { href: "/dashboard/projects", icon: FolderLibraryIcon, label: "Proyectos" },
      { href: "/dashboard/notification", icon: Notification03Icon, label: "Notificaciones" },
    ],
    2: [
      { href: "/dashboard/announcement", icon: Megaphone01Icon, label: "Anuncios" },
      { href: "/dashboard/projects", icon: FolderLibraryIcon, label: "Proyectos" },
      { href: "/dashboard/test", icon: TaskDaily01Icon, label: "Evaluaciones" },
      { href: "/dashboard/notification", icon: Notification03Icon, label: "Notificaciones" },
    ],
    3: [
      { href: "/dashboard/announcement", icon: Megaphone01Icon, label: "Anuncios" },
      { href: "/dashboard/test", icon: TaskDaily01Icon, label: "Evaluaciones" },
      { href: "/dashboard/planning", icon: Calendar03Icon, label: "Planificación" },
      { href: "/dashboard/team", icon: UserGroupIcon, label: "Equipo" },
      { href: "/dashboard/notification", icon: Notification03Icon, label: "Notificaciones" },
    ],
  };

  return navItems[roleId] || [];
};

const renderIcon = (IconComponent: any) => {
  return <IconComponent size={30} />;
};

const translations: { [key: string]: string } = {
  announcement: "Anuncios",
  test: "Evaluaciones",
  planning: "Planificación",
  details: "Detalles",
  team: "Equipo",
  projects: "Proyectos",
  spaces: "Espacios",
  notification: "Notificaciones",
  profile: "Perfil",
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const pathName = usePathname();

  const pathArray = pathName ? pathName.split('/').filter(x => x) : [];
  const dashboardIndex = pathArray.indexOf('dashboard');
  const filteredPathArray = dashboardIndex !== -1 ? pathArray.slice(dashboardIndex + 1) : [];

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
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

      const response = await fetch('http://localhost:8000/api/logout', {
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

  const userRoleId = user?.roles[0]?.idrol || 0;
  const filteredNavItems = getNavItems(userRoleId);

  return (
    <ProtectedLayout>
      <main className="h-screen overflow-hidden">
        <section className="flex flex-col h-full">
          <Navbar isBordered className="py-2 flex" maxWidth="full" height={"100%"} classNames={{ wrapper: "px-2 justify-normal", brand: "flex grow-0" }}>
            <Menu01Icon size={30} className="ml-3 hover:cursor-pointer" onClick={toggleNavbar} />
            <NavbarBrand className="ml-4 w-fit">
              <Image src="/p-mo.svg" alt="Logo de la aplicación" width={50} height={65} className="md:h-10 md:w-auto" />
              <p className="font-bold text-inherit flex">P-MO</p>
            </NavbarBrand>
            <div className="flex ml-auto">
              {filteredPathArray.length > 0 && (
                <Breadcrumbs>
                  {filteredPathArray.map((path, index) => (
                    <BreadcrumbItem key={index}>
                      <Link href={`/dashboard/${filteredPathArray.slice(0, index + 1).join('/')}`}>
                        {translations[path] || (path.charAt(0).toUpperCase() + path.slice(1))}
                      </Link>
                    </BreadcrumbItem>
                  ))}
                </Breadcrumbs>
              )}
            </div>
            <div className="flex ml-auto">
              <ThemeSwitcher />
            </div>
          </Navbar>
          <section className="flex h-full">
            <Navbar className={`flex flex-col ${isExpanded ? 'w-60 rounded-r-xl' : 'w-20'} border-r`} height={"100%"} classNames={{ wrapper: "flex flex-col h-full px-0 gap-0" }}>
              <NavbarContent className="flex flex-col w-auto p-4" style={{ justifyContent: 'space-between' }}>
                {filteredNavItems.map((item: { href: string, icon: any, label: string }, index: number) => (
                  <NavbarItem key={index} className={`flex content-center ${isExpanded ? 'w-full' : 'w-auto'} hover:scale-105 hover:bg-[#FE7F2D] hover:rounded-lg hover:text-white p-2 ${pathName && pathName.startsWith(item.href) ? "bg-[#EA6611] rounded-lg text-white" : ""}`}>
                    <Link href={item.href} className="flex items-center w-full gap-x-4" color="foreground">
                      {renderIcon(item.icon)}
                      <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>{item.label}</p>
                    </Link>
                  </NavbarItem>
                ))}
                <Popover placement="right-end" className="gap-x-4">
                  <PopoverTrigger>
                    <NavbarItem className={`flex items-center gap-x-4 ${isExpanded ? 'w-full' : 'w-auto'} hover:scale-105 hover:bg-[#FE7F2D] hover:rounded-lg hover:text-white hover:cursor-pointer p-2 ${pathName && pathName.startsWith('/dashboard/profile') ? "bg-[#EA6611] rounded-lg" : ""}`}>
                      <Avatar
                        name={!user?.profileuser ? `${user?.nameuser?.[0] || ''}${user?.lastnameuser?.[0] || ''}` : undefined}
                        src={user?.profileuser || undefined}
                        size="md"
                      />
                      <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Perfil</p>
                    </NavbarItem>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-col px-1 py-2 gap-y-2">
                      <Link href={"/dashboard/profile"} className="hover:border-1 hover:rounded-lg p-1 flex items-center w-full" color="foreground">
                        <Tooltip content="Editar perfil" placement="right">
                          <User
                            name={`${user?.nameuser} ${user?.lastnameuser}`}
                            description={user?.emailuser}
                            avatarProps={{
                              name: !user?.profileuser ? `${user?.nameuser?.[0] || ''}${user?.lastnameuser?.[0] || ''}` : undefined,
                              src: user?.profileuser || undefined,
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
              </NavbarContent>
            </Navbar>
            <section className="w-full h-full overflow-auto p-2">
              {children}
            </section>
          </section>
        </section>
      </main>
    </ProtectedLayout>
  );
}
