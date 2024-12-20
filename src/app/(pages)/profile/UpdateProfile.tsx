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

    // Fetch user if not already available
    useEffect(() => {
        if (!user) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').ID_Usuario;
            fetchUser(userId);
        }
    }, [user, fetchUser]);

    // Log teachers when they are loaded
    useEffect(() => {
        if (teachers && teachers.length > 0) {
            console.log('Teachers loaded:', teachers);
        }
    }, [teachers]);

    // Initialize user data when it's available
    useEffect(() => {
        if (user) {
            if (user.Docente?.ID_Usuario) {
                setSelectedKeys(new Set([user.Docente.ID_Usuario.toString()]));
            }
            setName(user.Nombre);
            setLastname(user.Apellido);
            setIsLoading(false);
        }
    }, [user, setName, setLastname]);

    //const isStudent = user?.Roles.some(role => role.ID_Rol === 3);

    const isStudent = user?.Roles?.some(role => role.ID_Rol === 3);

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
            if (!user) {
                throw new Error("El usuario no está disponible.");
            }

            await updateUser(user.ID_Usuario, formData);
            showAlert("¡Perfil actualizado!", "Tu perfil ha sido actualizado exitosamente.", "success");
            onOpenChange();
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            showAlert("Error", "No se pudo actualizar tu perfil.", "danger");
        }
        finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

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
                                    {/* Content... */}
                                </form>
                            </ModalBody>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
