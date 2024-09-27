'use client'
import Image from "next/image";
import { Avatar, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Calendar03Icon, FolderLibraryIcon, Megaphone01Icon, Menu01Icon, Notification03Icon, TaskDaily01Icon, UserGroupIcon } from "hugeicons-react";
import { useState } from "react";

export default function DashboardLayout(
    { children }: { children: React.ReactNode }
) {

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
      <html lang="en">
        <body className="bg-[#101010]">
          <main className="h-full">
            <section className="flex flex-col h-full">
              <Navbar isBordered className="bg-[#101010] border-white py-2 flex" maxWidth="full" height={"100%"} classNames={{wrapper:"px-2"}}>
                <NavbarBrand className="">
                  <Menu01Icon 
                    size={40} 
                    color={"#ffffff"}
                    className="mr-4"
                    onClick={toggleNavbar}
                  />
                  <Image
                    src="/p-mo.svg"
                    alt="Logo de la aplicación"
                    width={50}
                    height={65}
                    className="md:h-10 md:w-auto"
                  />
                  <p className="font-bold text-inherit text-white">P-MO</p>
                </NavbarBrand>
              </Navbar>
              <section className="flex h-full">
                <Navbar className={`flex flex-col ${isExpanded ? 'w-56' : 'w-16'} h-full bg-[#101010] border-white border-r-1`} height={"100%"} classNames={{wrapper:"flex flex-col h-full"}}>
                  <NavbarContent className="flex-col w-auto mt-10 items-start">
                    <NavbarItem className="hover:bg-[#2c2c2c] hover:rounded-lg">
                      <Link className="gap-x-5">
                        <Megaphone01Icon
                          size={40} 
                          color={"#ffffff"}
                        />
                        <p className={`text-white text-xl ${isExpanded ? 'block' : 'hidden'}`}>Anuncios</p>
                      </Link>
                    </NavbarItem>
                    <NavbarItem className="hover:bg-[#2c2c2c] hover:rounded-lg">
                      <Link className="gap-x-5">
                        <TaskDaily01Icon
                          size={40} 
                          color={"#ffffff"}
                        />
                        <p className={`text-white text-xl ${isExpanded ? 'block' : 'hidden'}`}>Evaluaciones</p>
                      </Link>
                    </NavbarItem>
                    <NavbarItem className="hover:bg-[#2c2c2c] hover:rounded-lg">
                      <Link className="gap-x-5">
                        <Calendar03Icon
                          size={40} 
                          color={"#ffffff"}
                        />
                        <p className={`text-white text-xl ${isExpanded ? 'block' : 'hidden'}`}>Planificación</p>
                      </Link>
                    </NavbarItem>
                    <NavbarItem className="hover:bg-[#2c2c2c] hover:rounded-lg">
                      <Link className="gap-x-5">
                        <UserGroupIcon
                          size={40} 
                          color={"#ffffff"}
                        />
                        <p className={`text-white text-xl ${isExpanded ? 'block' : 'hidden'}`}>Equipo</p>
                      </Link>
                    </NavbarItem>
                    <NavbarItem className="hover:bg-[#2c2c2c] hover:rounded-lg">
                        <Link className="gap-x-5">
                            <FolderLibraryIcon
                                size={40} 
                                color={"#ffffff"}
                            />
                            <p className={`text-white text-xl ${isExpanded ? 'block' : 'hidden'}`}>Proyectos</p>
                        </Link>
                    </NavbarItem>
                    <NavbarItem className="hover:bg-[#2c2c2c] hover:rounded-lg">
                      <Link className="gap-x-5">
                        <Notification03Icon
                          size={40} 
                          color={"#ffffff"}
                        />
                        <p className={`text-white text-xl ${isExpanded ? 'block' : 'hidden'}`}>Notificaciones</p>
                      </Link>
                    </NavbarItem>
                    <NavbarItem className="hover:bg-[#2c2c2c] hover:rounded-lg">
                      <Link className="gap-x-5">
                        <Avatar isBordered name="JC" className="bg-inherit text-white" />
                        <p className={`text-white text-xl ${isExpanded ? 'block' : 'hidden'}`}>Perfil</p>
                      </Link>
                    </NavbarItem>
                  </NavbarContent>
                </Navbar>
                <section className="ml-2 mt-2">
                  {children}
                </section>
              </section>
            </section>
          </main>
        </body>
      </html>
    )
  }