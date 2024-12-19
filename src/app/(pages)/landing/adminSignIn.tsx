"use client";
import userAdmin from "@/app/_lib/landing/useUserForm";
import { useRouter } from 'next/navigation';
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Input } from "@nextui-org/react";
import { useState } from "react";
import ErrorModal from "@/app/mensajes"; // Import the ErrorModal

export default function AdminSignIn() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [clickCount, setClickCount] = useState(0);
    const targetClicks = 3;
    const [errorMessage, setErrorMessage] = useState('');

    const handleButtonClick = () => {
        setClickCount((prev) => {
            const newCount = prev + 1;
            if (newCount >= targetClicks) {
                onOpen();
            }
            return newCount;
        });
    };

    const handleModalClose = () => {
        setClickCount(0);
        onOpenChange();
    };

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
        name,
        setName,
        isNameTouched,
        setIsNameTouched,
        lastname,
        setLastname,
        isLastNameTouched,
        setIsLastNameTouched,
        isInvalidEmail,
        isInvalidPasswd,
        isInvalidName,
        isInvalidLastname,
        isSingupValid,
        isVisible,
        setIsVisible,
        toggleVisibility,
    } = userAdmin();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isSingupValid) {
            return;
        }

        const userData = {
            nameuser: name,
            lastnameuser: lastname,
            emailuser: email,
            passworduser: passwd,
            idrol: 1, // Role for admin
        };
        console.log(userData);

        try {
            const response = await fetch(`${backendUrl}/register-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Error al crear el usuario');
            }

            const result = await response.json();
            // Save the token to localStorage after a successful registration
            localStorage.setItem('token', result.token);
            router.push('/dashboard/profile'); // Redirect to dashboard

        } catch (error) {
            console.error('Error:', error);
            // Show error modal with a message
            setErrorMessage('Correo ya registrado.');
        }
    };

    return (
        <section className="w-full">
            <Button onPress={handleButtonClick}>
                Únete
            </Button>
            <Modal isOpen={isOpen} onOpenChange={(isOpen) => { if (!isOpen) { handleModalClose(); } onOpenChange(); }} scrollBehavior="outside" placement="center" size="xl" backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1 text-5xl">Únete</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit} className="space-y-4 mb-4">
                                    <div className="flex md:flex-row md:justify-between flex-col space-y-4 md:space-y-0">
                                        <Input
                                            value={name}
                                            isClearable
                                            label="Nombre"
                                            placeholder="Ingrese su nombre"
                                            isInvalid={isNameTouched && isInvalidName}
                                            errorMessage="El campo nombre debe contener al menos 3 caracteres"
                                            onValueChange={(name) => {
                                                setName(name);
                                                setIsNameTouched(true);
                                            }}
                                            maxLength={60}
                                            className="md:w-[48%]"
                                        />
                                        <Input
                                            value={lastname}
                                            isClearable
                                            label="Apellido"
                                            placeholder="Ingrese su apellido"
                                            isInvalid={isLastNameTouched && isInvalidLastname}
                                            errorMessage="El campo apellido debe contener al menos 5 caracteres"
                                            onValueChange={(lastname) => {
                                                setLastname(lastname);
                                                setIsLastNameTouched(true);
                                            }}
                                            maxLength={60}
                                            className="md:w-[48%]"
                                        />
                                    </div>
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
                                    <Button type="submit" isDisabled={!isSingupValid} className="w-full h-14 bg-[#2E6CB5] text-white">
                                        Unirse
                                    </Button>
                                    {/* Error Modal */}
                                    {errorMessage && (
                                        <ErrorModal
                                            message={errorMessage}
                                            onClose={() => setErrorMessage('')} // Clear error message on close
                                            className="z-100"
                                        />
                                    )}
                                </form>
                            </ModalBody>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
