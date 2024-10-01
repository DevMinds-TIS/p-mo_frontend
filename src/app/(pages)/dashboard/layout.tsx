'use client';

import Image from "next/image";
import { Avatar, Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Popover, PopoverContent, PopoverTrigger, Tooltip, User } from "@nextui-org/react";
import Link from 'next/link';
import { Calendar03Icon, FolderLibraryIcon, Logout03Icon, Megaphone01Icon, Menu01Icon, Notification03Icon, TaskDaily01Icon, UserGroupIcon } from "hugeicons-react";
import { useState } from 'react';
import { ThemeSwitcher } from "@/app/ThemeSwitcher";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "", icon: Megaphone01Icon, label: "Anuncios" },
  { href: "/dashboard/test", icon: TaskDaily01Icon, label: "Evaluaciones" },
  { href: "/dashboard/planning", icon: Calendar03Icon, label: "Planificación" },
  { href: "/dashboard/team", icon: UserGroupIcon, label: "Equipo" },
  { href: "/dashboard/projects", icon: FolderLibraryIcon, label: "Proyectos" },
  { href: "", icon: Notification03Icon, label: "Notificaciones" },
  // { href: "", icon: Avatar, label: "Perfil", isAvatar: true }
];

const renderIcon = (IconComponent: any) => {
  // if (isAvatar) {
  //   return <Avatar isBordered name="JC" className="bg-inherit" />;
  // }

  return <IconComponent size={30} />;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const pathName = usePathname();

  return (
    <main className="h-screen overflow-hidden">
      <section className="flex flex-col h-full">
        <Navbar isBordered className="py-2 flex" maxWidth="full" height={"100%"} classNames={{ wrapper: "px-2 justify-normal", brand: "flex grow-0" }}>
          <Menu01Icon size={30} className="ml-3 hover:cursor-pointer" onClick={toggleNavbar} />
          <NavbarBrand className="ml-4 w-fit">
            <Image src="/p-mo.svg" alt="Logo de la aplicación" width={50} height={65} className="md:h-10 md:w-auto" />
            <p className="font-bold text-inherit flex">P-MO</p>
          </NavbarBrand>
          <div className="flex ml-auto">
            <ThemeSwitcher />
          </div>
        </Navbar>
        <section className="flex h-full">
          <Navbar className={`flex flex-col ${isExpanded ? 'w-60 rounded-r-xl' : 'w-20'} border-r`} height={"100%"} classNames={{ wrapper: "flex flex-col h-full px-0 gap-0" }}>
            <NavbarContent className="flex flex-col w-auto p-4" style={{ justifyContent: 'space-between' }}>
              {navItems.map((item, index) => (
                <NavbarItem key={index} className={`flex content-center ${isExpanded ? 'w-full' : 'w-auto'} hover:scale-105 hover:bg-[#FE7F2D] hover:rounded-lg hover:text-white p-2 ${pathName === item.href ? "bg-[#EA6611] rounded-lg text-white" : ""}`}>
                  <Link href={item.href} className="flex items-center w-full gap-x-4" color="foreground">
                    {renderIcon(item.icon)}
                    <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>{item.label}</p>
                  </Link>
                </NavbarItem>
              ))}
              <Popover placement="right-end" className="gap-x-4">
                <PopoverTrigger>
                  <NavbarItem className={`flex items-center gap-x-4 ${isExpanded ? 'w-full' : 'w-auto'} hover:scale-105 hover:bg-[#FE7F2D] hover:rounded-lg hover:text-white hover:cursor-pointer p-2`}>
                    <Avatar name="JC" size="md" />
                    <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Perfil</p>
                  </NavbarItem>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col px-1 py-2 gap-y-2">
                    <Link href={"/dashboard/profile"} className="hover:border-1 hover:rounded-lg p-1 flex items-center w-full" color="foreground">
                      <Tooltip content="Editar perfil" placement="right">
                        <User
                          name="Julio Cesar Severiche Orellana"
                          description="202001839@est.umss.edu"
                          avatarProps={{
                            name: "JC"
                          }}
                        />
                      </Tooltip>
                    </Link>
                    <Button className="bg-[#FF0000] min-w-1 text-white">
                        <Logout03Icon  />
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
  );
}
