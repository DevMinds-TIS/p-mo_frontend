'use client';
import { ThemeSwitcher } from "@/app/ThemeSwitcher";
import LogIn from "./LogIn";
import { Divider, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Image from "next/image";
import SingUp from "./SingUp";
import { UniversityIcon, Facebook02Icon, GithubIcon, HeartCheckIcon, CopyrightIcon } from "hugeicons-react"
import { useState } from "react";

export default function Landing() {
    const [isLoginPopoverOpen, setIsLoginPopoverOpen] = useState(false);
    const [isRegisterPopoverOpen, setIsRegisterPopoverOpen] = useState(false);

    return (
        <section className="flex flex-col items-stretch gap-y-8 bg-[#212121] text-white">
            <header className="py-2 gap-4 flex flex-wrap px-2 lg:justify-between justify-center bg-black">
                <div className="sm:ml-4 ml-1 flex sm:gap-4 gap-2 justify-center items-center lg:w-auto w-full">
                    <Image src="/p-mo.svg" alt="Logo de la aplicación" width={50} height={65} className="md:h-10 md:w-auto" />
                    <p className="text-inherit flex">Project Management Officer</p>
                    <Image src="/umss-logo.png" alt="Logo de la universidad" width={165} height={60} className="bg-white p-1 rounded-lg sm:w-[165px] w-[100px]"/>
                </div>

                {/* <div className="flex flex-1 justify-center">
                </div> */}

                <div className="flex items-center gap-4 justify-self-end">
                    <Popover placement="left" className="gap-x-4" onOpenChange={(open) => setIsLoginPopoverOpen(open)}>
                        <PopoverTrigger>
                            <span
                                className={`flex items-center gap-x-2 p-2 hover:scale-105 bg-[#2e6cb5] text-white hover:cursor-pointer rounded-lg`}
                            >
                                Iniciar Sesión
                            </span>
                        </PopoverTrigger>
                        <PopoverContent>
                            <LogIn />
                        </PopoverContent>
                    </Popover>
                    <Popover placement="left" className="gap-x-4" onOpenChange={(open) => setIsRegisterPopoverOpen(open)}>
                        <PopoverTrigger>
                            <span
                                className={`flex items-center gap-x-2 p-2 hover:scale-105 bg-[#2e6cb5] text-white hover:cursor-pointer rounded-lg`}
                            >
                                Registrarme
                            </span>
                        </PopoverTrigger>
                        <PopoverContent>
                            <SingUp />
                        </PopoverContent>
                    </Popover>
                    <ThemeSwitcher />
                </div>
            </header>
            <h1 className="lg:text-[100px] sm:text-[60px] text-[45px] text-center font-light lg:p-12 p-3">Bienvenido al evaluador basado en proyectos <br/> <i>P-MO</i></h1>
            <Divider className="border-solid"/>
            <div className="px-4 flex flex-col gap-y-2">
                <h2 className="sm:text-5xl text-3xl">Project Management Officer</h2>
                <p className="lg:w-1/3 md:w-1/2 w-full">Sistema diseñado para la gestión y evaluación de proyectos de la materia de Taller de Ingenieria de Sistemas</p>
            </div>
            <div className="flex flex-wrap">
                <div className="sm:w-3/4 w-full p-6 flex flex-col">
                    <h3 className="font-bold w-full">Enlaces</h3>
                    <div className="flex sm:flex-nowrap flex-wrap pt-10 sm:gap-x-2 gap-y-4 w-full">
                        <div className="sm:w-1/3 w-1/2">
                            <div className="pb-10 flex gap-x-4">
                                <a href="https://www.github.com" target="_blank" rel="noreferrer">
                                    <GithubIcon fill="white" size={20} color="#ffffff"/>
                                </a>
                                <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                                    <Facebook02Icon size={20} color="#ffffff"/>
                                </a>
                                <a href="https://www.umss.edu.bo" target="_blank" rel="noreferrer">
                                    <UniversityIcon size={20} color="#ffffff"/>
                                </a>
                            </div>
                            <p className="pb-4 font-bold">Acerca de nosotros</p>
                            <p>Acerca de nosotros</p>
                            <p>Politicas de Privacidad</p>
                        </div>
                        <div className="sm:w-1/3 w-1/2 ps-4">
                            <p className="pb-4 font-bold">Tutoriales</p>
                            <p>Crear espacios</p>
                            <p>Crear equipos</p>
                            <p>Crear proyectos</p>
                        </div>
                        <div className="sm:w-1/3 w-1/2">
                            <p className="pb-4 font-bold">Ayuda</p>
                            <p>Reportar un problema</p>
                        </div>
                        <div className="w-1/2 justify-center sm:hidden flex">
                            <Image
                                src="/p-mo.svg"
                                alt="Logo de la aplicación"
                                width={50}
                                height={65}
                                className="w-1/3"
                                priority
                            />
                        </div>
                    </div>
                    <div className="w-full self-end lg:mt-auto mt-8 flex justify-between">
                        <p>Hecho con <HeartCheckIcon fill="red" color="red" className="inline-block"/> por el equipo de DevMinds</p>
                        <p className="ps-2">Todos los derechos reservados <CopyrightIcon className="inline-block"/> 2024</p>
                    </div>
                </div>
                <div className="w-1/4 justify-center sm:flex hidden">
                    <Image
                        src="/p-mo.svg"
                        alt="Logo de la aplicación"
                        width={50}
                        height={65}
                        className="w-5/6"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
