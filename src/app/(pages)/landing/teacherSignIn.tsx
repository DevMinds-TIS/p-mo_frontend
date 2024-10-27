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
        isNameTouched,
        setIsNameTouched,
        lastname,
        setLastname,
        isLastNameTouched,
        setIsLastNameTouched,
        code,
        setCode,
        isCodeTouched,
        setIsCodeTouched,
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
            teacherpermission: code,
        };
        console.log(userData);

        try {
            const response = await fetch('http://localhost:8000/api/register-teacher', {
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
            localStorage.setItem('token', result.token);
            router.push('/dashboard/profile');

        } catch (error) {
            console.error('Error:', error);
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
            <div className="flex space-x-4">
                <Input
                    value={code}
                    isClearable
                    label="Código secreto"
                    placeholder="Solicita el código y escríbele aquí"
                    isInvalid={isCodeTouched && isInvalidCode}
                    errorMessage="El código debe contener al menos 8 caracteres"
                    onValueChange={(code) => {
                        setCode(code);
                        setIsCodeTouched(true);
                    }}
                    maxLength={12}
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