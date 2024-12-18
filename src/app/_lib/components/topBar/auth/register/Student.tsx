"use client";
import { Avatar, Button, Input, Select, SelectedItems, SelectItem, SharedSelection } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { useRouter } from 'next/navigation';
import userStudent from "@/app/_lib/landing/useUserForm";
import React, { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTeacherList } from "@/contexts/TeacherListContext";
import { User } from '@/types/User';

export default function StudentSignIn({ onClose }: { onClose: () => void }) {
    const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const { registerStudent } = useAuth();
    const { showAlert } = useAlert();
    const { teachers } = useTeacherList();
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
        if (teachers && teachers.length > 0) {
            console.log('Teachers loaded:', teachers);
        }
    }, [teachers]);

    const handleSelectionChange = (keys: SharedSelection) => {
        if (keys === "all") {
            setSelectedKeys(new Set<string>());
        } else {
            setSelectedKeys(new Set(keys as Set<string>));
            const key = Array.from(keys)[0];
            const selectedTeacher = teachers?.find(teacher => teacher.ID_Usuario.toString() === key);
            if (selectedTeacher) {
                setDocenteId(selectedTeacher.ID_Usuario);
            } else {
                console.error('Error: El valor seleccionado no corresponde a ningún docente válido.');
            }
        }
    };

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
            router.push('/profile');
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
            <div>
                <Select
                    classNames={{
                        base: "w-full",
                        trigger: "h-12",
                    }}
                    label="Docente"
                    placeholder="Seleccione a su tutor/docente"
                    labelPlacement="outside"
                    selectedKeys={selectedKeys}
                    onSelectionChange={handleSelectionChange}
                    renderValue={(items: SelectedItems<User>) => {
                        return Array.from(items).map((item) => {
                            const selectedTeacher = teachers?.find(teacher => teacher.ID_Usuario.toString() === item.key);
                            return selectedTeacher ? (
                                <div key={selectedTeacher.ID_Usuario} className="flex items-center gap-2">
                                    <Avatar
                                        name={`${selectedTeacher?.Nombre?.[0] || ''}${selectedTeacher?.Apellido?.[0] || ''}`}
                                        src={selectedTeacher?.Perfil ? `${storageUrl}/${selectedTeacher.Perfil}` : undefined}
                                        size="md"
                                    />
                                    <div className="flex flex-col">
                                        <span>{selectedTeacher.Nombre} {selectedTeacher.Apellido}</span>
                                        <span className="text-default-500 text-tiny">({selectedTeacher.Correo})</span>
                                    </div>
                                </div>
                            ) : null;
                        });
                    }}
                >
                    {teachers?.map((teacher) => (
                        <SelectItem key={teacher.ID_Usuario.toString()} textValue={teacher.Nombre}>
                            <div className="flex gap-2 items-center">
                                <Avatar
                                    name={!teacher?.Perfil ? `${teacher?.Nombre?.[0] || ''}${teacher?.Apellido?.[0] || ''}` : undefined}
                                    src={teacher?.Perfil ? `${storageUrl}/${teacher.Perfil}` : undefined}
                                    size="md"
                                />
                                <div className="flex flex-col">
                                    <span className="text-small">{teacher.Nombre} {teacher.Apellido}</span>
                                    <span className="text-tiny text-default-400">{teacher.Correo}</span>
                                </div>
                            </div>
                        </SelectItem>
                    )) ?? []}
                </Select>
            </div>
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