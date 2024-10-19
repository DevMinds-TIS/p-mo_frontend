"use client";
import Image from "next/image";
import {Button, Divider, Input, Link} from "@nextui-org/react";
import {EyeFilledIcon} from "@nextui-org/shared-icons";
import {EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import React from "react";
import userForms from "@/app/_lib/landing/userForm";
import SingUp from "./SingUp";
import { useRouter } from 'next/navigation';

export default function LogIn(){
    const router = useRouter();
    const {
        email,
        setEmail,
        passwd,
        setPasswd,
        passwordError,
        isPasswdTouched,
        setIsPasswdTouched,
        isEmailTouched,
        setIsEmailTouched,
        isInvalidEmail,
        isInvalidPasswd,
        isLoginValid,
        isVisible,
        setIsVisible,
        toggleVisibility,
    } = userForms();

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    
        const loginData = {
            emailuser: email,
            passworduser: passwd,
        };
    
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
    
            if (!response.ok) {
                throw new Error('Error al iniciar sesión');
            }
            const result = await response.json();
            console.log('Inicio de sesión exitoso:', result);
            // Almacena el token en el localStorage
            localStorage.setItem('token', result.token);
            // Redirige al dashboard u otra página
            router.push('/dashboard/profile');
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return(
        <section className="flex md:flex-row flex-col justify-center gap-10 h-screen">
            <div className="flex md:flex-col justify-center gap-4">
                <Image
                    src="/p-mo.svg"
                    alt="Logo de la aplicación"
                    width={50}
                    height={65}
                    className="md:h-[60%] md:w-auto"
                    priority
                />
                <div className="flex flex-col md:text-center">
                    <h1 className="text-3xl md:text-5xl">P-MO</h1>
                    <p className="text-[#777777]">PROJECT MANAGEMENT OFFICER</p>
                </div>
            </div>
            <div className="flex flex-col md:justify-center items-center self-center gap-4 md:w-[30%] w-[90%]">
                <h1 className="text-5xl">Inicia Sesión</h1>
                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <Input
                        value={email}
                        isClearable 
                        type="email" 
                        label="Correo Electrónico"
                        placeholder="Ingrese su correo electrónico"
                        isInvalid={isEmailTouched && isInvalidEmail}
                        errorMessage="Por favor, ingrese un correo electrónico valido"
                        onValueChange={(email) => {
                            setEmail(email);
                            setIsEmailTouched(true);
                        }}
                        maxLength={60}
                    />
                    <Input
                        value={passwd}
                        label="Contraseña"
                        placeholder="Ingrese su contraseña"
                        isInvalid={isPasswdTouched && isInvalidPasswd}
                        errorMessage={passwordError}
                        onValueChange={(passwd) => {
                            setPasswd(passwd);
                            setIsPasswdTouched(true);
                        }}
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        maxLength={20}
                    />
                    <Button type="submit" isDisabled={!isLoginValid} className="w-full h-14 bg-[#FF9B5A] text-white">
                        Iniciar Sesión
                    </Button>
                </form>
                <Link href="#" className="h-8 text-[#777777]">¿Olvidó su contraseña?</Link>
                <Divider className="my-4"/>
                <SingUp />
            </div>
        </section>
    );
}