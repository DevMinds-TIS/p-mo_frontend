"use client";
import { Button, Input, Link, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Kbd, Chip } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { Login03Icon } from "hugeicons-react";
import userForms from "@/app/_lib/landing/useUserForm";

export default function LogIn() {
    const { login } = useAuth();
    const { showAlert } = useAlert();
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, passwd);
            showAlert("¡Inicio de sesión exitoso!", "", "success");
            onClose();
            router.push('/');
        } catch (error) {
            console.error('Error:', error);
            showAlert("Error al iniciar sesión.", "Correo o contraseña inválidos. Por favor, inténtelo de nuevo.", "danger");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button color="primary" radius="full" onPress={onOpen}>
                <Login03Icon />
                <p>Iniciar Sesión</p>
            </Button>
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            <p className="text-3xl">
                                Inicia Sesión
                            </p>
                        </DrawerHeader>
                        <DrawerBody>
                            <form onSubmit={handleLogin} className="w-full space-y-4">
                                <Input
                                    value={email}
                                    isClearable
                                    type="email"
                                    label="Correo Electrónico"
                                    placeholder="ej. usuario@dominio.edu.bo"
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
                                    placeholder="●●●●●●●●"
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                            {isVisible ? (
                                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            ) : (
                                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                    isInvalid={isPasswdTouched && isInvalidPasswd}
                                    errorMessage={passwordError}
                                    onValueChange={(passwd) => {
                                        setPasswd(passwd);
                                        setIsPasswdTouched(true);
                                    }}
                                    type={isVisible ? "text" : "password"}
                                    maxLength={20}
                                />
                                <div className="flex py-2 px-1 justify-between">
                                    <Link color="success" href="#" size="sm">
                                        ¿Olvidó su contraseña?
                                    </Link>
                                </div>
                                {isLoading ? (
                                    <Button isLoading className="w-full h-14 text-light" color="success">
                                        Iniciando...
                                    </Button>
                                ) : (
                                    <Button type="submit" isDisabled={!isLoginValid} color="success" className="w-full h-14">
                                        Iniciar Sesión
                                    </Button>
                                )}
                            </form>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" onPress={onClose}>Cerrar</Button>
                        </DrawerFooter>
                    </>
                </DrawerContent>
            </Drawer>
        </>
    );
}