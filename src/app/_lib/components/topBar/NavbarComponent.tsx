"use client";

import { ThemeSwitcher } from "@/app/ThemeSwitcher";
import { Avatar, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, User } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { bricolage } from "@/app/fonts";
import { AddTeamIcon, FolderLibraryIcon, Layers02Icon, Logout03Icon, Logout05Icon, StepIntoIcon, UserAccountIcon, UserIcon, UserSwitchIcon } from "hugeicons-react";
import LogIn from "./auth/LogIn";
import SignUp from "@/app/_lib/components/topBar/auth/SingUp";

export default function NavBarComponent() {
    return (
        <Navbar isBordered className={`h-20 flex max-w-none ${bricolage.className}`} classNames={{ wrapper: "max-w-none" }}>
            <NavbarBrand className="flex items-center">
                <Image src="/p-mo.svg" alt="Logo de la aplicación" width={60} height={75} />
                <div className="text-sm flex-col">
                    <p>Project</p>
                    <p>Management</p>
                    <p>Officer</p>
                </div>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-10" justify="center">
                <NavbarItem>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <StepIntoIcon />
                                <p>Tutoriales</p>
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Tutorials Actions" variant="flat">
                            <DropdownItem key="projects" className="h-14">
                                <div className="flex items-center gap-3">
                                    <FolderLibraryIcon />
                                    <p>Crear proyectos</p>
                                </div>
                            </DropdownItem>
                            <DropdownItem key="spaces" className="h-14">
                                <div className="flex items-center gap-3">
                                    <UserAccountIcon />
                                    <p>Crear espacios</p>
                                </div>
                            </DropdownItem>
                            <DropdownItem key="teams" className="h-14">
                                <div className="flex items-center gap-3">
                                    <Layers02Icon />
                                    <p>Crear equipos</p>
                                </div>
                            </DropdownItem>
                            <DropdownItem key="teams" className="h-14">
                                <div className="flex items-center gap-3">
                                    <AddTeamIcon />
                                    <p>Agregar miembros a un equipo</p>
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
                <NavbarItem isActive>
                    <SignUp />
                </NavbarItem>
                <NavbarItem>
                    <LogIn />
                </NavbarItem>
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <ThemeSwitcher />
                {/* <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="secondary"
                            name="Jason Hughes"
                            size="sm"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14">
                            <div className="flex items-center gap-5">
                                <User
                                    avatarProps={{
                                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                                        size: "sm",
                                        color: "secondary",
                                        className: "transition-transform",
                                        as: "button",
                                        isBordered: true
                                    }}
                                    description="zoeey@example.com"
                                    name="Jane Doe"
                                />
                                <Chip color="secondary">
                                    Docente
                                </Chip>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="projects">
                            <div className="flex items-center gap-4">
                                <FolderLibraryIcon />
                                <p>
                                    Proyectos
                                </p>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="roles">
                            <div className="flex items-center gap-4">
                                <UserSwitchIcon />
                                <p>
                                    Roles
                                </p>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="profile">
                            <div className="flex items-center gap-4">
                                <UserIcon />
                                <p>
                                    Perfil
                                </p>
                            </div>
                        </DropdownItem>
                        <DropdownItem key="logout" className="bg-danger text-light" color="danger">
                            <div className="flex items-center gap-4">
                                <Logout03Icon />
                                <p>
                                    Cerrar sesión
                                </p>
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown> */}
            </NavbarContent>
        </Navbar>
    );
}