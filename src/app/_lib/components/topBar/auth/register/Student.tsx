"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { useRouter } from 'next/navigation';
import userStudent from "@/app/_lib/landing/useUserForm";
import React, { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";

export default function StudentSignIn({ onClose }: { onClose: () => void }) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const { registerStudent, fetchTeachers } = useAuth();
    const { showAlert } = useAlert();
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

    const [isLoading, setIsLoading] = useState(false);

    type Teacher = { key: number; label: string; };

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [docenteId, setDocenteId] = useState<number | null>(null);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [isInvalidUMSSEmail, setIsInvalidUMSSEmail] = useState(false);

    const validateUMSSEmail = (email: string) => {
        const domain = email.split('@')[1];
        if (domain !== 'est.umss.edu') {
            setIsInvalidUMSSEmail(true);
        } else {
            setIsInvalidUMSSEmail(false);
        }
    };

    useEffect(() => {
        const loadTeachers = async () => {
            try {
                const teachersList = await fetchTeachers();
                setTeachers(teachersList);
            } catch (error) {
                console.error('Error al obtener los docentes:', error);
            }
        };

        loadTeachers();
    }, [fetchTeachers]);

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

        console.log("Estudiante", userData);
        setIsLoading(true);

        try {
            await registerStudent(userData);
            showAlert("¡Registro exitoso!", "El usuario ha sido creado exitosamente y ha iniciado sesión.", "success");
            onClose();
            router.push('/');
        } catch (error) {
            console.error('Error:', error);
            showAlert("Error al registrar", "Error al registrar el estudiante. Por favor, intente de nuevo.", "danger");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex md:flex-row md:justify-between flex-col space-y-4 md:space-y-0">
                <Input
                    value={name}
                    isClearable
                    label="Nombre"
                    placeholder="ej. Manuel"
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
                    placeholder="ej. Alvarado"
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
                placeholder="ej. 202400001@est.umss.edu"
                isInvalid={(isEmailTouched && isInvalidEmail) || isInvalidUMSSEmail}
                errorMessage={isInvalidUMSSEmail ? "Usted no pertenece a la U.M.S.S." : "Por favor, ingrese un correo electrónico válido"}
                onValueChange={(email) => {
                    setEmail(email);
                    setIsEmailTouched(true);
                    validateUMSSEmail(email);
                }}
                maxLength={60}
            />
            <Input
                value={passwd}
                label="Contraseña"
                placeholder="●●●●●●●●"
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
                placeholder="ej. 202400001"
                isInvalid={isSiscodeTouched && isInvalidSiscode}
                errorMessage="El campo codigo SIS debe contener al menos 9 caracteres"
                onValueChange={(siscode) => {
                    setSisCode(siscode);
                    setIsSiscodeTouched(true);
                }}
                maxLength={9}
                onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                    }
                }}
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
            {isLoading ? (
                <Button isLoading className="w-full h-14 text-light" color="success">
                    Registrando estudiante...
                </Button>
            ) : (
                <Button type="submit" color="success" isDisabled={!isSingupValid || !docenteId || isInvalidUMSSEmail} className="w-full h-14">
                    Registrarse
                </Button>
            )}
        </form>
    );
}
