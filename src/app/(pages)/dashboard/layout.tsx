'use client';

import Image from "next/image";
import { Avatar, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from 'next/link';
import { Calendar03Icon, FolderLibraryIcon, Megaphone01Icon, Menu01Icon, Notification03Icon, TaskDaily01Icon, UserGroupIcon } from "hugeicons-react";
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
  { href: "", icon: Avatar, label: "Perfil", isAvatar: true }
];

const renderIcon = (IconComponent: any, isAvatar: boolean) => {
  if (isAvatar) {
    return <Avatar isBordered name="JC" className="bg-inherit" />;
  }
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
          <Navbar className={`flex flex-col ${isExpanded ? 'w-60' : 'w-20'} border-r`} height={"100%"} classNames={{ wrapper: "flex flex-col h-full px-0 gap-0"  }}>
            <NavbarContent className="flex flex-col w-auto p-4" style={{ justifyContent: 'space-between' }}>
              {navItems.map((item, index) => (
                <NavbarItem key={index} className={`flex content-center ${isExpanded ? 'w-full' : 'w-auto'} hover:scale-105 p-2 ${pathName === item.href ? "bg-[#EA6611] rounded-lg text-white" : ""}`}>
                  <Link href={item.href} className="flex items-center w-full gap-x-4" color="foreground">
                    {renderIcon(item.icon, item.isAvatar ?? false)}
                    <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>{item.label}</p>
                  </Link>
                </NavbarItem>
              ))}
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
