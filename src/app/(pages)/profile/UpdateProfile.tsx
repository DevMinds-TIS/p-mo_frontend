"use client";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Input,
    Select,
    SelectItem,
    Avatar,
    SelectedItems,
    SharedSelection
} from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import userStudent from "@/app/_lib/landing/useUserForm";
import { useTeacherList } from "@/contexts/TeacherListContext";
import { useUser } from "@/contexts/UserContext";
import { useAlert } from "@/contexts/AlertContext";
import { User } from "@/types/User";
import { useRouter } from 'next/navigation';
import { PencilEdit02Icon } from "hugeicons-react";
import { useEffect, useState } from "react";

export default function UpdateProfile() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { user, fetchUser, updateUser } = useUser();
    const { teachers } = useTeacherList();
    const { showAlert } = useAlert();

    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [profileuser, setProfileuser] = useState<File | null>(null);

    const { passwd, setPasswd, passwordError, isPasswdTouched, setIsPasswdTouched, name, setName, isNameTouched, setIsNameTouched, lastname, setLastname, isLastNameTouched, setIsLastNameTouched, isInvalidPasswd, isInvalidName, isInvalidLastname, isVisible, toggleVisibility } = userStudent();

    useEffect(() => {
        if (!user) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').ID_Usuario;
            fetchUser(userId);
        }
    }, [user, fetchUser]);

    if (!user) {
        return <div>Loading...</div>;
    }

    useEffect(() => {
        if (teachers && teachers.length > 0) {
            console.log('Teachers loaded:', teachers);
        }
    }, [teachers]);

    useEffect(() => {
        if (user.Docente?.ID_Usuario) {
            setSelectedKeys(new Set([user.Docente.ID_Usuario.toString()]));
        }
        setName(user.Nombre);
        setLastname(user.Apellido);
        setIsLoading(false);
    }, [user, setName, setLastname]);

    const isStudent = user.Roles.some(role => role.ID_Rol === 3);

    const handleSelectionChange = (keys: SharedSelection) => {
        if (keys === "all") {
            setSelectedKeys(new Set<string>());
        } else {
            setSelectedKeys(new Set(keys as Set<string>));
        }
    };

    const handleFileChange = async (newFile: File | null) => {
        setProfileuser(newFile);
        if (!newFile && user?.Perfil) {
            const response = await fetch(user.Perfil);
            const blob = await response.blob();
            setProfileuser(new File([blob], "Perfil", { type: blob.type }));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
    
        const formData = new FormData();
        formData.append("nameuser", name);
        formData.append("lastnameuser", lastname);
        if (passwd) {
            formData.append("passworduser", passwd);
        }
        if (selectedKeys.size > 0) {
            formData.append("use_iduser", Array.from(selectedKeys)[0]);
        }
        if (profileuser) {
            formData.append("profileuser", profileuser);
        }
    
        setIsLoading(true);
    
        try {
            await updateUser(user.ID_Usuario, formData);
            showAlert("¡Perfil actualizado!", "Tu perfil ha sido actualizado exitosamente.", "success"); // Mostrar alerta de éxito
            onOpenChange();
            // window.location.reload();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            showAlert("Error al actualizar", "Hubo un problema al actualizar tu perfil. Inténtalo de nuevo.", "danger"); // Mostrar alerta de error
        } finally {
            setIsLoading(false);
        }
    };    

    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <PencilEdit02Icon size={28} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Actualiza tu perfil</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div className="h-full">
                                            <p>Imagen de perfil</p>
                                            <FileUpload
                                                onChange={handleFileChange}
                                                existingFile={user?.Perfil ? { name: 'Perfil', url: `${storageUrl}/${user.Perfil}` } : null}
                                                readOnly={false} className="w-52"
                                            />
                                        </div>
                                        <div className="h-auto w-full space-y-4">
                                            <div>
                                                <p>Datos personales</p>
                                                <div className="h-full flex-col space-y-2">
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
                                                    />
                                                    <Input
                                                        value={lastname}
                                                        isClearable label="Apellido"
                                                        placeholder="Ingrese su apellido"
                                                        isInvalid={isLastNameTouched && isInvalidLastname}
                                                        errorMessage="El campo apellido debe contener al menos 5 caracteres"
                                                        onValueChange={(lastname) => {
                                                            setLastname(lastname);
                                                            setIsLastNameTouched(true);
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
                                                            <button
                                                                className="focus:outline-none"
                                                                type="button"
                                                                onClick={toggleVisibility}
                                                                aria-label="toggle password visibility"
                                                            >
                                                                {isVisible ? (
                                                                    <EyeSlashFilledIcon
                                                                        className="text-2xl text-default-400 pointer-events-none"
                                                                    />
                                                                ) : (
                                                                    <EyeFilledIcon
                                                                        className="text-2xl text-default-400 pointer-events-none"
                                                                    />
                                                                )}
                                                            </button>
                                                        }
                                                        type={isVisible ? "text" : "password"}
                                                        maxLength={20}
                                                    />
                                                </div>
                                            </div>
                                            {isStudent && (
                                                <div className="flex justify-end">
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
                                            )}
                                        </div>
                                    </div>
                                    {isLoading ? (
                                        <Button isLoading className="w-full h-14 text-light" color="primary">
                                            Actualizando datos...
                                        </Button>
                                    ) : (
                                        <Button color="primary" className="w-full h-12" type="submit">
                                            Actualizar
                                        </Button>
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