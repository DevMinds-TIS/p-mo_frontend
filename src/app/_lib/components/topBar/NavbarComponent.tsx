"use client";

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { bricolage } from "@/app/fonts";
import { ThemeSwitcher } from "@/app/ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import LogIn from "./auth/LogIn";
import SignUp from "./auth/SingUp";
import BreadCrumbsComponent from "./utils/BreadCrumbsComponent";
import Tutorials from "./utils/Tutorials";
import UserData from "./utils/UserData";

export default function NavBarComponent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();

    return (
        <Navbar isBordered className={`h-20 flex max-w-none ${bricolage.className}`} classNames={{ wrapper: "max-w-none" }} isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>

            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            <NavbarContent className="" justify="start">
                <NavbarBrand className="flex gap-4">
                    <Image src="/p-mo.svg" alt="Logo de la aplicación" width={40} height={55} />
                    <div className="text-sm flex-col">
                        <p>Project</p>
                        <p>Management</p>
                        <p>Officer</p>
                    </div>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-10" justify="center">
                {!user ? (
                    <>
                        <NavbarItem>
                            <Tutorials />
                        </NavbarItem>
                        <NavbarItem isActive>
                            <SignUp />
                        </NavbarItem>
                        <NavbarItem>
                            <LogIn />
                        </NavbarItem>
                    </>
                ) : (
                    <BreadCrumbsComponent />
                )}
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <ThemeSwitcher />
                {user && <UserData />}
            </NavbarContent>

            <NavbarMenu className="mt-6">
                {!user ? (
                    <>
                        <NavbarMenuItem>
                            <Tutorials />
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <SignUp />
                        </NavbarMenuItem>
                        <NavbarMenuItem>
                            <LogIn />
                        </NavbarMenuItem>
                    </>
                ) : (
                    <BreadCrumbsComponent />
                )}
            </NavbarMenu>
        </Navbar>
    );
}