import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Image from "next/image";
import LogIn from "./LogIn";
import SingUp from "./SingUp";
import { useState } from "react";

export default function Header() {
    const [isLoginPopoverOpen, setIsLoginPopoverOpen] = useState(false);
    const [isRegisterPopoverOpen, setIsRegisterPopoverOpen] = useState(false);

    return (
        <header className="py-2 gap-4 flex flex-wrap px-2 lg:justify-between justify-center bg-black">
            <div className="sm:ml-4 ml-1 flex sm:gap-4 gap-2 justify-center items-center lg:w-auto w-full">
                <Image
                    src="/p-mo.svg"
                    alt="Logo de la aplicación"
                    width={50}
                    height={65}
                    className="md:h-10 md:w-auto"
                />
                <p className="text-inherit flex">Project Management Officer</p>
                <Image
                    src="/umss-logo.png"
                    alt="Logo de la universidad"
                    width={165}
                    height={60}
                    className="bg-white p-1 rounded-lg sm:w-[165px] w-[100px]"
                />
            </div>

            <div className="flex items-center gap-4 justify-self-end">
                <Popover
                    placement="left"
                    className="gap-x-4"
                    onOpenChange={(open) => setIsLoginPopoverOpen(open)}
                >
                    <PopoverTrigger>
                        <button
                            className={`flex items-center gap-x-2 p-2 hover:scale-105 bg-[#2e6cb5] text-white hover:cursor-pointer rounded-lg`}
                        >
                            Iniciar Sesión
                        </button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <LogIn />
                    </PopoverContent>
                </Popover>
                <Popover
                    placement="left"
                    className="gap-x-4"
                    onOpenChange={(open) => setIsRegisterPopoverOpen(open)}
                >
                    <PopoverTrigger>
                        <button
                            className={`flex items-center gap-x-2 p-2 hover:scale-105 bg-[#2e6cb5] text-white hover:cursor-pointer rounded-lg`}
                        >
                            Registrarme
                        </button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <SingUp />
                    </PopoverContent>
                </Popover>
                {/* <ThemeSwitcher /> */}
            </div>
        </header>
    );
}
