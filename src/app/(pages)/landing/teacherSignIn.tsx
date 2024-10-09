"use client";
import userTeacher from "@/app/_lib/landing/userForm";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";

export default function TeacherSignIn() {
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
        lastname,
        setLastname,
        code,
        setCode,
        isInvalidEmail,
        isInvalidPasswd,
        isInvalidName,
        isInvalidLastname,
        isInvalidCode,
        isSingupValid,
        isVisible,
        setIsVisible,
        toggleVisibility,
    } = userTeacher();

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
            idrol: 2,
            teachertoken: code,
        };

        try {
            const response = await fetch('http://localhost:8000/api/users', {
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
            console.log('Usuario creado:', result);
            // Redirigir a /dashboard después de un registro exitoso
            router.push('/dashboard/profile');

        } catch (error) {
            console.error('Error:', error);
            // Manejar el error, como mostrar un mensaje de error al usuario
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex md:flex-row md:justify-between flex-col space-y-4 md:space-y-0">
                <Input
                    value={name}
                    isClearable
                    label="Nombre"
                    placeholder="Ingrese su nombre"
                    isInvalid={isInvalidName}
                    errorMessage="El campo nombre debe contener al menos 3 caracteres"
                    onValueChange={setName}
                    maxLength={60}
                    className="md:w-[48%]"
                />
                <Input
                    value={lastname}
                    isClearable
                    label="Apellido"
                    placeholder="Ingrese su apellido"
                    isInvalid={isInvalidLastname}
                    errorMessage="El campo apellido debe contener al menos 5 caracteres"
                    onValueChange={setLastname}
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
            <div className="flex space-x-4">
                <Input
                    value={code}
                    label="Código secreto"
                    placeholder="Solicita el código y escríbele aquí"
                    onValueChange={setCode}
                >
                </Input>
                <Button className="text-white bg-[#ff9b5a] h-auto" isDisabled={true}>
                    Solicitar
                </Button>
            </div>
            <Button type="submit" isDisabled={!isSingupValid} className="w-full h-14 bg-[#FF9B5A] text-white">
                Unirse
            </Button>
        </form>
    );
}