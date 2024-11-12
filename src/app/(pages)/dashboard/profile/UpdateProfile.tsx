"use client";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Image, Input, Select, SelectItem, Avatar, SelectedItems, User, SharedSelection } from "@nextui-org/react";
import { PencilEdit02Icon } from "hugeicons-react";
import { useEffect, useState } from "react";
import userStudent from "@/app/_lib/landing/userForm";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { FileUpload } from "@/app/_lib/components/FileUpload";

type Role = {
    idroleuser: number;
    idrol: number;
};

type Docente = {
    iduser: number;
    nameuser: string;
    lastnameuser: string;
    emailuser: string;
    profileuser?: string;
};

type User = {
    iduser: number;
    nameuser: string;
    lastnameuser: string;
    emailuser: string;
    passworduser: string;
    profileuser?: string;
    roles: Role[];
    user?: Docente;
};

export default function UpdateProfile() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [user, setUser] = useState<User | null>(null);
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [profileuser, setProfileuser] = useState<File | null>(null);

    const {
        passwd,
        setPasswd,
        passwordError,
        isPasswdTouched,
        setIsPasswdTouched,
        name,
        setName,
        isNameTouched,
        setIsNameTouched,
        lastname,
        setLastname,
        isLastNameTouched,
        setIsLastNameTouched,
        isInvalidPasswd,
        isInvalidName,
        isInvalidLastname,
        isVisible,
        toggleVisibility,
    } = userStudent();

    
    useEffect(() => {
        const fetchDocentes = async () => {
            try {
                const response = await fetch(`${backendUrl}/role-user`);
                const data = await response.json();
                const teacherIds = data.data
                    .filter((user: { ID_Rol: number }) => user['ID_Rol'] === 2)
                    .map((user: { ID_Usuario: number }) => user['ID_Usuario']);
                const teachersResponse = await fetch(`${backendUrl}/users`);
                const teachersData = await teachersResponse.json();
                if (Array.isArray(teachersData.data)) {
                    const teachersList: Docente[] = teachersData.data
                        .filter((user: { ID_Usuario: number }) => teacherIds.includes(user['ID_Usuario']))
                        .map((teacher: {
                            ID_Usuario: number;
                            Nombre: string;
                            Apellido: string;
                            Correo: string;
                        }) => ({
                            iduser: teacher['ID_Usuario'],
                            nameuser: teacher['Nombre'],
                            lastnameuser: teacher['Apellido'],
                            emailuser: teacher['Correo'],
                        }));
                    setDocentes(teachersList);
                } else {
                    console.error('Error: Expected an array but got:', teachersData.data);
                }
            } catch (error) {
                console.error('Error al obtener los docentes:', error);
            }
        };
        fetchDocentes();
    }, []);

    
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }
            try {
                const response = await fetch(`${backendUrl}/user`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del usuario");
                }
                const data = await response.json();
                setUser(data);
                if (data?.user?.iduser) {
                    setSelectedKeys(new Set([data.user.iduser.toString()]));
                }
                setName(data.nameuser);
                setLastname(data.lastnameuser);
                // setPasswd(data.passworduser);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (isLoading || !user) {
        console.log("No se encontraron usuarios");
        return null;
    }

    const isStudent = user.roles.some((role) => role.idrol === 3);

    const handleSelectionChange = (keys: SharedSelection) => {
        if (keys === "all") {
            setSelectedKeys(new Set<string>());
        } else {
            setSelectedKeys(new Set(keys as Set<string>));
        }
    };

    // const handleFileChange = async (newFile: File | null) => {
    //     setProfileuser(newFile);
    //     if (!newFile && user?.profileuser) {
    //         const response = await fetch(user.profileuser);
    //         const blob = await response.blob();
    //         setProfileuser(new File([blob], "Imagen_Perfil"));
    //     }
    // };


    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault();

    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         console.error("No token found");
    //         return;
    //     }

    //     const updatedUser = {
    //         nameuser: name,
    //         lastnameuser: lastname,
    //         passworduser: passwd,
    //         use_iduser: Array.from(selectedKeys)[0]
    //     };

    //     try {
    //         const response = await fetch(`http://localhost:8000/api/users/${user.iduser}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(updatedUser),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Error al actualizar el usuario");
    //         }

    //         const data = await response.json();
    //         setUser(data);
    //         onOpenChange();
    //         window.location.reload();
    //     } catch (error) {
    //         console.error("Error al actualizar el usuario:", error);
    //     }
    // };

    const handleFileChange = async (newFile: File | null) => {
        setProfileuser(newFile);
        if (!newFile && user?.profileuser) {
            const response = await fetch(user.profileuser);
            const blob = await response.blob();
            setProfileuser(new File([blob], "Imagen_Perfil", { type: blob.type }));
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
    
        // Print the formData keys and values
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        console.log("Sending fetch request to update user...");
    
        try {
            const response = await fetch(`${backendUrl}/users/${user.iduser}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
    
            console.log("Fetch response status:", response.status);
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response from server:", errorData);
                throw new Error(`Error al actualizar el usuario: ${errorData.message}`);
            }
    
            const data = await response.json();
            console.log("User updated successfully:", data);
            setUser(data);
            onOpenChange();
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
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
                                    <div className="flex gap-2">
                                        <div className="h-full">
                                            {/* <Image
                                                alt="User Profile"
                                                className="object-cover"
                                                height={200}
                                                shadow="md"
                                                src="https://nextui.org/images/album-cover.png"
                                                width="100%"
                                            /> */}
                                            <FileUpload
                                                onChange={handleFileChange}
                                                existingFile={user?.profileuser ? { name: "Imagen_Perfil", url: user.profileuser } : null}
                                                readOnly={false}
                                            />

                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex gap-2">
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
                                                />
                                            </div>
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
                                            {isStudent && user.user && (
                                                <Select
                                                    items={docentes}
                                                    label="Docente"
                                                    placeholder="Selecciona a tu docente"
                                                    labelPlacement="outside"
                                                    classNames={{ base: "w-full", trigger: "h-12" }}
                                                    selectedKeys={selectedKeys}
                                                    onSelectionChange={handleSelectionChange}
                                                    renderValue={(items: SelectedItems<Docente>) => {
                                                        return items.map((item) => (
                                                            <div key={item.key} className="flex items-center gap-2">
                                                                <Avatar
                                                                    alt={item.data?.nameuser}
                                                                    name={`${item.data?.nameuser?.[0] || ""}${item.data?.lastnameuser?.[0] || ""}`}
                                                                    src={item.data?.profileuser || undefined}
                                                                    className="flex-shrink-0"
                                                                    size="sm"
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span>{item.data?.nameuser} {item.data?.lastnameuser}</span>
                                                                    <span className="text-default-500 text-tiny">({item.data?.emailuser})</span>
                                                                </div>
                                                            </div>
                                                        ));
                                                    }}
                                                >
                                                    {(docente) => (
                                                        <SelectItem key={docente.iduser.toString()} textValue={docente.nameuser}>
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar
                                                                    alt={docente.nameuser}
                                                                    name={`${docente.nameuser?.[0] || ""}${docente.lastnameuser?.[0] || ""}`}
                                                                    src={docente.profileuser || undefined}
                                                                    className="flex-shrink-0"
                                                                    size="sm"
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">{docente.nameuser} {docente.lastnameuser}</span>
                                                                    <span className="text-tiny text-default-400">{docente.emailuser}</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>
                                            )}
                                        </div>
                                    </div>
                                    <Button className="w-full" type="submit">
                                        Actualizar
                                    </Button>
                                </form>
                            </ModalBody>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}