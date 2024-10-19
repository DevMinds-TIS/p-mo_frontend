import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { useRouter } from 'next/navigation';
import userStudent from "@/app/_lib/landing/userForm";
import React, { useEffect, useState } from 'react';

export default function StudentSignIn() {
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
        siscode,
        setSisCode,
        isInvalidEmail,
        isInvalidPasswd,
        isInvalidName,
        isInvalidLastname,
        isInvalidSiscode,
        isSingupValid,
        isVisible,
        setIsVisible,
        toggleVisibility,
    } = userStudent();

    type Teacher = {
        key: string;
        label: string;
    };

    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const [docenteId, setDocenteId] = useState<number | null>(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/role-user');
                const data = await response.json();
                const teacherIds = data.data.filter((user: { 'ID Rol': number }) => user['ID Rol'] === 2).map((user: { 'ID Usuario': number }) => user['ID Usuario']);

                const teachersResponse = await fetch('http://localhost:8000/api/users');
                const teachersData = await teachersResponse.json();

                if (Array.isArray(teachersData.data)) {
                    const teachersList: Teacher[] = teachersData.data
                        .filter((user: { 'ID Usuario': number }) => teacherIds.includes(user['ID Usuario']))
                        .map((teacher: { 'ID Usuario': number; Nombre: string; Apellido: string }) => ({
                            key: teacher['ID Usuario'].toString(),
                            label: `${teacher['Nombre']} ${teacher['Apellido']}`,
                        }));
                    setTeachers(teachersList);
                } else {
                    console.error('Error: Expected an array but got:', teachersData.data);
                }

            } catch (error) {
                console.error('Error al obtener los docentes:', error);
            }
        };

        fetchTeachers();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isSingupValid && !docenteId) {
            return;
        }

        const userData = {
            nameuser: name,
            lastnameuser: lastname,
            emailuser: email,
            passworduser: passwd,
            idrol: 3,
            siscode: siscode,
            use_iduser: docenteId,
        };

        try {
            const response = await fetch('http://localhost:8000/api/register', {
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
            <Input
                value={siscode}
                isClearable
                label="Codigo SIS"
                placeholder="Ingrese su codigo SIS"
                isInvalid={isInvalidSiscode}
                errorMessage="El campo codigo SIS debe contener al menos 9 caracteres"
                onValueChange={setSisCode}
                maxLength={20}
            />
            <Select
                label="Docente"
                placeholder="Seleccione a su tutor/docente"
                onSelectionChange={(key) => setDocenteId(Number(key))}>
                {teachers.map((teacher: Teacher) => (
                    <SelectItem key={teacher.key} value={teacher.key}>
                        {teacher.label}
                    </SelectItem>
                ))}
            </Select>

            <Button type="submit" isDisabled={!isSingupValid && !docenteId} className="w-full h-14 bg-[#FF9B5A] text-white">
                Unirse
            </Button>
        </form>
    );
}