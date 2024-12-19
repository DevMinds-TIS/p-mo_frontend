"use client";
import { useTheme } from "next-themes";
import { Bank, Copyright, FacebookLogo, GithubLogo, Heart } from "@phosphor-icons/react";
import Image from "next/image";
import { bricolage, inria } from "@/app/fonts";
import Link from "next/link";
import { BankIcon, CourtHouseIcon, Github01Icon, Globe02Icon } from "hugeicons-react";

export default function FooterComponent() {
    const { theme } = useTheme();

    const footerThemeClass = theme === "light" ? "bg-dark text-light" : "bg-light text-dark";

    return (
        <section className={`border-t flex flex-col w-full h-auto gap-2 ${bricolage.className} ${footerThemeClass}`}>
            <div className="w-1/2 flex flex-col gap-2 p-4">
                <h1 className={`${inria.className} font-bold text-4xl`}>
                    Project Management Officer
                </h1>
                <p>
                    Sistema diseñado para la gestión y evaluación de proyectos de la materia de Taller de Ingeniería de Sistemas.
                </p>
            </div>
            <div className="flex justify-between gap-2">
                <div className="w-[70%] flex flex-col gap-2 justify-between">
                    <div className="flex justify-center gap-2 items-center h-full">
                        <div className="flex flex-col w-[30%] space-y-10">
                            <div className="flex-col space-y-2">
                                <h1 className="font-bold">
                                    Enlaces
                                </h1>
                                <div className="flex gap-2">
                                    <a href="https://www.bnb.com.bo/" target="_blank">
                                        <BankIcon size={25} />
                                    </a>
                                    <a href="https://www.facebook.com/" target="_blank">
                                        <Globe02Icon size={25} />
                                    </a>
                                    <a href="https://www.umss.edu.bo/" target="_blank">
                                        <CourtHouseIcon size={25} />
                                    </a>
                                    <a href="https://www.github.com/DevMinds-TIS" target="_blank">
                                        <Github01Icon size={25} />
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <h1 className="font-bold">
                                    Acerca de nosotros
                                </h1>
                                <div className="flex-col">
                                    <p className="font-normal">Acerca de nosotros</p>
                                    <p className="font-normal">Políticas de privacidad</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-[30%] space-y-2">
                            <h1 className="font-bold">
                                Tutoriales
                            </h1>
                            <div className="flex-col">
                                <p className="font-normal">Crear espacios</p>
                                <p className="font-normal">Crear equipos</p>
                                <Link href={"tutoriales"}>
                                    <p className="font-normal">Crear proyectos</p>
                                </Link>
                            </div>
                        </div>
                        <div className="w-[30%] space-y-2">
                            <h1 className="font-bold">
                                Ayuda
                            </h1>
                            <div className="flex-col">
                                <a href="mailto:devminds44@gmail.com" className="font-normal">Reportar un problema</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full justify-between items-center p-4">
                        <p className="flex items-center gap-1">Hecho con <Heart size={32} weight="fill" color="red" /> por el equipo de DevMinds</p>
                        |
                        <p className="flex items-center gap-1">Todos los derechos reservados <Copyright size={32} weight="fill" /> 2024</p>
                    </div>
                </div>
                <div className="w-[30%] p-2 flex flex-col justify-center items-center">
                    <Image src="/p-mo.svg" alt="Logo de la aplicación" width={100} height={100} className="w-3/6" />
                    <Image src="/umss-logo.svg" alt="Logo de la institución" width={100} height={100} className="w-2/3" />
                </div>
            </div>
        </section>
    );
}
