'use client'
import Image from "next/image";
import { Avatar, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Calendar03Icon, FolderLibraryIcon, Megaphone01Icon, Menu01Icon, Notification03Icon, TaskDaily01Icon, UserGroupIcon } from "hugeicons-react";
import { useState } from 'react';
import { ThemeSwitcher } from "@/app/ThemeSwitcher";

export default function DashboardLayout(
  { children }: { children: React.ReactNode }
) {

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <main className="h-screen overflow-hidden">
      <section className="flex flex-col h-full">
        <Navbar isBordered className="py-2 flex" maxWidth="full" height={"100%"} classNames={{ wrapper: "px-2 justify-normal", brand: "flex grow-0" }}>
          <Menu01Icon
            size={40}
            className="ml-1 hover:cursor-pointer"
            onClick={toggleNavbar}
          />
          <NavbarBrand className="ml-4 w-fit">
            <Image
              src="/p-mo.svg"
              alt="Logo de la aplicación"
              width={50}
              height={65}
              className="md:h-10 md:w-auto"
            />
            <p className="font-bold text-inherit flex">P-MO</p>
          </NavbarBrand>
          <div className="flex ml-auto">
            <ThemeSwitcher />
          </div>
        </Navbar>
        <section className="flex h-full">
          <Navbar className={`flex flex-col ${isExpanded ? 'w-60' : 'w-20'} border-r`} height={"100%"} classNames={{ wrapper: "flex flex-col h-full" }}>
            <NavbarContent className="flex flex-col w-auto mt-5 mb-5 items-start">
              <NavbarItem className="hover:rounded-lg flex content-center w-full hover:scale-105 p-2">
                <Link href="" className="gap-x-4" color="foreground">
                  <Megaphone01Icon
                    size={40}
                  />
                  <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Anuncios</p>
                </Link>
              </NavbarItem>
              <NavbarItem className="hover:rounded-lg flex content-center w-full hover:scale-105 p-2">
                <Link href="/dashboard/test" className="gap-x-4" color="foreground">
                  <TaskDaily01Icon
                    size={40}
                  />
                  <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Evaluaciones</p>
                </Link>
              </NavbarItem>
              <NavbarItem className="hover:rounded-lg flex content-center w-full hover:scale-105 p-2">
                <Link href="/dashboard/planning" className="gap-x-4" color="foreground">
                  <Calendar03Icon
                    size={40}
                  />
                  <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Planificación</p>
                </Link>
              </NavbarItem>
              <NavbarItem className="hover:rounded-lg flex content-center w-full hover:scale-105 p-2">
                <Link href="/dashboard/team" className="gap-x-4" color="foreground">
                  <UserGroupIcon
                    size={40}
                  />
                  <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Equipo</p>
                </Link>
              </NavbarItem>
              <NavbarItem className="hover:rounded-lg flex content-center w-full hover:scale-105 p-2">
                <Link href="/dashboard/projects" className="gap-x-4" color="foreground">
                  <FolderLibraryIcon
                    size={40}
                  />
                  <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Proyectos</p>
                </Link>
              </NavbarItem>
              <NavbarItem className="hover:rounded-lg flex content-center w-full hover:scale-105 p-2">
                <Link href="" className="gap-x-4" color="foreground">
                  <Notification03Icon
                    size={40}
                  />
                  <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Notificaciones</p>
                </Link>
              </NavbarItem>
              <NavbarItem className="hover:rounded-lg flex content-center w-full hover:scale-105 p-2">
                <Link href="" className="gap-x-4" color="foreground">
                  <Avatar isBordered name="JC" className="bg-inherit" />
                  <p className={`text-xl ${isExpanded ? 'block' : 'hidden'}`}>Perfil</p>
                </Link>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          <section className="w-full h-full overflow-auto p-2">
            {children}
          </section>
        </section>
      </section>
    </main>
  )
}