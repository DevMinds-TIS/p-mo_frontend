"use client";

import { Avatar, Input } from "@nextui-org/react";
import { PencilEdit01Icon } from "hugeicons-react";

export default function Profile() {
    return (
        <section className="flex flex-col gap-y-8">
            <section className="flex w-full h-10 justify-between items-center">
                <h1 className="text-3xl">Datos personales</h1>
            </section>
            <section className="flex w-full">
                <Avatar name="JC" className="w-52 h-52 text-7xl" />
                <section className="p-2 flex flex-col gap-4 grow">
                    <div className="flex gap-4">
                        <Input
                            label="Nombre"
                            value="Julio Cesar Severiche Orellana"
                            isDisabled
                        />
                        <PencilEdit01Icon
                            className="bg-[#FF9B5A] rounded-lg p-1"
                            size={60}
                            // color={"#FFFFFF"}
                        />
                        <Input
                            label="Correo electrónico"
                            type="email"
                            value="202001839@est.umss.edu"
                            isDisabled
                        />
                        <PencilEdit01Icon
                            className="bg-[#FF9B5A] rounded-lg p-1"
                            size={60}
                            color={"#FFFFFF"}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Input
                            label="Contraseña"
                            type="password"
                            value="********"
                            isDisabled
                        />
                        <PencilEdit01Icon
                            className="bg-[#FF9B5A] rounded-lg p-1"
                            size={60}
                            color={"#FFFFFF"}
                        />
                        <Input
                            label="Docente"
                            value="Corina Justina Flores Villarroel"
                            isDisabled
                        />
                        <PencilEdit01Icon
                            className="bg-[#FF9B5A] rounded-lg p-1"
                            size={60}
                            // color={"#FFFFFF"}
                        />
                    </div>
                </section>
            </section>
        </section>
    );
}