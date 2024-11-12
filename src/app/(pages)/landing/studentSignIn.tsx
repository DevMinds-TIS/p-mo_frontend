import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { useRouter } from 'next/navigation';
import userStudent from "@/app/_lib/landing/useUserForm";
import React, { useEffect, useState } from 'react';

export default function StudentSignIn() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
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
        siscode,
        setSisCode,
        isSiscodeTouched,
        setIsSiscodeTouched,
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
        key: number;
        label: string;
    };

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [docenteId, setDocenteId] = useState<number | null>(null);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());


    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch(`${backendUrl}/role-user`);
                const data = await response.json();
                const teacherIds = data.data.filter((user: { 'ID Rol': number }) => user['ID Rol'] === 2).map((user: { 'ID Usuario': number }) => user['ID Usuario']);
    
                const teachersResponse = await fetch(`${backendUrl}/users`);
                const teachersData = await teachersResponse.json();
    
                if (Array.isArray(teachersData.data)) {
                    const teachersList: Teacher[] = teachersData.data.filter((user: { 'ID Usuario': number }) => teacherIds.includes(user['ID Usuario'])).map((teacher: { 'ID Usuario': number; Nombre: string; Apellido: string }) => ({
                        key: teacher['ID Usuario'],
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
        if (!isSingupValid || docenteId === null) {
            console.error('El formulario no es válido o el docente no ha sido seleccionado.');
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
            const registerResponse = await fetch(`${backendUrl}/register-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!registerResponse.ok) {
                throw new Error('Error al crear el usuario');
            }
            const loginResponse = await fetch(`${backendUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailuser: email, passworduser: passwd }),
            });
            if (!loginResponse.ok) {
                throw new Error('Error al iniciar sesión');
            }
            const result = await loginResponse.json();
            // console.log('Usuario creado e inició sesión:', result);
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
            <Input
                value={siscode}
                isClearable
                label="Codigo SIS"
                placeholder="Ingrese su codigo SIS"
                isInvalid={isSiscodeTouched && isInvalidSiscode}
                errorMessage="El campo codigo SIS debe contener al menos 9 caracteres"
                onValueChange={(siscode) => {
                    setSisCode(siscode);
                    setIsSiscodeTouched(true);
                }}
                maxLength={20}
            />
            <Select
                label="Docente"
                placeholder="Seleccione a su tutor/docente"
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => {
                    setSelectedKeys(keys as Set<string>);
                    const key = Array.from(keys)[0];
                    const selectedTeacher = teachers.find(teacher => teacher.key.toString() === key);
                    if (selectedTeacher) {
                        setDocenteId(selectedTeacher.key);
                    } else {
                        console.error('Error: El valor seleccionado no corresponde a ningún docente válido.');
                    }
                }}
            >
                {teachers.map((teacher: Teacher) => (
                    <SelectItem key={teacher.key.toString()} value={teacher.key.toString()}>
                        {teacher.label}
                    </SelectItem>
                ))}
            </Select>
            <Button type="submit" isDisabled={!isSingupValid || !docenteId} className="w-full h-14 bg-[#FF9B5A] text-white">
                Unirse
            </Button>
        </form>
    );
}