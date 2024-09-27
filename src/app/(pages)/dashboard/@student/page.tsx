'use client'

import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Avatar } from "@nextui-org/react";
import Image from "next/image";
import { Menu01Icon } from "hugeicons-react";
import { Megaphone01Icon } from "hugeicons-react";
import { TaskDaily01Icon } from "hugeicons-react";
import { Calendar03Icon } from "hugeicons-react";
import { UserGroupIcon } from "hugeicons-react";
import { Notification03Icon } from "hugeicons-react";
import { FolderLibraryIcon } from "hugeicons-react";
import { useState } from 'react';

export default function StudentDashboard(){
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
      };
    return (
        <section className="flex flex-col">
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
            <Navbar className={`flex flex-col ${isExpanded ? 'w-56' : 'w-16'} h-screen bg-[#101010] border-white border-r-1`} height={"100%"} classNames={{wrapper:"flex flex-col h-full"}}>
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
        </section>
    );
}