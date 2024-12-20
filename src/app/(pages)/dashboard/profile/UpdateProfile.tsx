// "use client";
// import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Input, Select, SelectItem, Avatar, SelectedItems, User, SharedSelection } from "@nextui-org/react";
// import { PencilEdit02Icon } from "hugeicons-react";
// import { useEffect, useState } from "react";
// import userStudent from "@/app/_lib/landing/useUserForm";
// import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
// import { FileUpload } from "@/app/_lib/components/FileUpload";
// import { useRouter } from 'next/navigation';
// import ErrorModal from "@/app/mensajes";

// type Role = {
//     ID_Rol: number;
//     Nombre_Rol: string;
// };

// type User = {
//     data: User;
//     ID_Usuario: number;
//     Nombre: string;
//     Apellido: string;
//     Correo: string;
//     Perfil?: string;
//     Roles: Role[];
//     Docente?: User;
// };

// export default function UpdateProfile() {
//     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//     const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;
//     const router = useRouter();
//     const { isOpen, onOpen, onOpenChange } = useDisclosure();
//     const [user, setUser] = useState<User | null>(null);
//     const [docentes, setDocentes] = useState<User[]>([]);
//     const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
//     const [isLoading, setIsLoading] = useState(true);
//     const [profileuser, setProfileuser] = useState<File | null>(null);
//     const [imageError, setImageError] = useState<string | null>(null);  // Estado para el error de la imagen
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [successMessage, setSuccessMessage] = useState<string | null>(null);

//     const {
//         passwd,
//         setPasswd,
//         passwordError,
//         isPasswdTouched,
//         setIsPasswdTouched,
//         name,
//         setName,
//         isNameTouched,
//         setIsNameTouched,
//         lastname,
//         setLastname,
//         isLastNameTouched,
//         setIsLastNameTouched,
//         isInvalidPasswd,
//         isInvalidName,
//         isInvalidLastname,
//         isVisible,
//         toggleVisibility,
//     } = userStudent();

//     useEffect(() => {
//         const fetchDocentes = async () => {
//             try {
//                 const response = await fetch(`${backendUrl}/role-user`);
//                 const data = await response.json();
//                 const teacherIds = data.data
//                     .filter((user: { ID_Rol: number }) => user['ID_Rol'] === 2)
//                     .map((user: { ID_Usuario: number }) => user['ID_Usuario']);
//                 const teachersResponse = await fetch(`${backendUrl}/users`);
//                 const teachersData = await teachersResponse.json();
//                 if (Array.isArray(teachersData.data)) {
//                     const teachersList: User[] = teachersData.data
//                         .filter((user: { ID_Usuario: number }) => teacherIds.includes(user['ID_Usuario']))
//                         .map((teacher: {
//                             ID_Usuario: number;
//                             Nombre: string;
//                             Apellido: string;
//                             Correo: string;
//                             Perfil: string;
//                         }) => ({
//                             ID_Usuario: teacher['ID_Usuario'],
//                             Nombre: teacher['Nombre'],
//                             Apellido: teacher['Apellido'],
//                             Correo: teacher['Correo'],
//                             Perfil: teacher['Perfil'],
//                         }));
//                     setDocentes(teachersList);
//                 } else {
//                     console.error('Error: Expected an array but got:', teachersData.data);
//                 }
//             } catch (error) {
//                 console.error('Error al obtener los docentes:', error);
//             }
//         };
//         fetchDocentes();
//     }, [backendUrl]);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 console.error("No token found");
//                 return;
//             }

//             try {
//                 const response = await fetch(`${backendUrl}/user`, {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error("Error al obtener los datos del usuario");
//                 }

//                 const data = await response.json();
//                 setUser(data.data);

//                 if (data.data?.Docente?.ID_Usuario) {
//                     setSelectedKeys(new Set([data.data.Docente.ID_Usuario.toString()]));
//                 }

//                 setName(data.data.Nombre);
//                 setLastname(data.data.Apellido);
//                 setIsLoading(false);
//             } catch (error) {
//                 console.error("Error al obtener los datos del usuario:", error);
//                 setIsLoading(false);
//             }
//         };
//         fetchUserData();
//     }, [backendUrl, setName, setLastname]);


//     // if (!user) {
//     //     console.log("No se encontraron usuarios");
//     //     return null;
//     // }

//     if (!user) {
//         console.log("No se encontraron usuarios");
//         return <div>Cargando...</div>;
//     }


//     const isStudent = user?.Roles?.some(role => role.ID_Rol === 3) ?? false;

//     const handleSelectionChange = (keys: SharedSelection) => {
//         if (keys === "all") {
//             setSelectedKeys(new Set<string>());
//         } else {
//             setSelectedKeys(new Set(keys as Set<string>));
//         }
//     };

//     const handleFileChange = async (newFile: File | null) => {
//         if (newFile) {
//             // Verificar el tipo de archivo
//             const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
//             if (!validFormats.includes(newFile.type)) {
//                 setImageError("Por favor, sube una imagen en formato JPG, JPEG o PNG.");  // Establecer el mensaje de error
//                 return; // No actualices el estado si el archivo no es válido
//             }
//             setImageError(null);  // Limpiar el error si el archivo es válido
//         }

//         setProfileuser(newFile);
//         if (!newFile && user?.Perfil) {
//             const response = await fetch(user.Perfil);
//             const blob = await response.blob();
//             setProfileuser(new File([blob], "Perfil", { type: blob.type }));
//         }
//     };


//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
//         const token = localStorage.getItem("token");
//         if (!token) {
//             console.error("No token found");
//             return;
//         }
//         const formData = new FormData();
//         formData.append("nameuser", name);
//         formData.append("lastnameuser", lastname);
//         if (passwd) {
//             formData.append("passworduser", passwd);
//         }
//         if (selectedKeys.size > 0) {
//             formData.append("use_iduser", Array.from(selectedKeys)[0]);
//         }
//         if (profileuser) {
//             formData.append("profileuser", profileuser);
//         }

//         try {
//             const response = await fetch(`${backendUrl}/users/${user.ID_Usuario}`, {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "X-HTTP-Method-Override": "PUT",
//                 },
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 setErrorMessage(`Error al actualizar los datos de usuario: ${errorData.message}`);
//                 throw new Error(`Error al actualizar los datos de usuario: ${errorData.message}`);
//             }

//             const data = await response.json();
//             setUser(data.data);
//             setSuccessMessage("Los datos se actualizaron con éxito.");
//             onOpenChange();
//             window.location.reload();
//         } catch (error) {
//             console.error("Error al actualizar los datos del usuario:", error);
//             setErrorMessage("Error al actualizar los datos de usuario");
//         }
//     };

//     return (
//         <section>
//             <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
//                 <PencilEdit02Icon size={28} />
//             </Button>
//             <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
//                 <ModalContent>
//                     {(onClose) => (
//                         <div>
//                             <ModalHeader className="flex flex-col gap-1">Actualiza tu perfil</ModalHeader>
//                             <ModalBody>
//                                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                                     <div className="flex gap-4">
//                                         <div className="h-full">
//                                             <p>Imagen de perfil</p>
//                                             <FileUpload
//                                                 onChange={handleFileChange}
//                                                 existingFile={user?.Perfil ? { name: 'Perfil', url: `${storageUrl}/${user.Perfil}` } : null}
//                                                 readOnly={false}
//                                                 className="w-52"
//                                             />
//                                             {imageError && <p className="text-red-500 text-sm">{imageError}</p>} {/* Mensaje de error debajo de la imagen */}
//                                         </div>
//                                         <div className="flex flex-col justify-between">
//                                             <div>
//                                                 <p>Datos personales</p>
//                                                 <div className="flex gap-2">
//                                                     <Input
//                                                         value={name}
//                                                         isClearable
//                                                         label="Nombre"
//                                                         placeholder="Ingrese su nombre"
//                                                         isInvalid={isNameTouched && isInvalidName}
//                                                         errorMessage="El campo nombre debe contener al menos 3 caracteres"
//                                                         onValueChange={(name) => {
//                                                             setName(name);
//                                                             setIsNameTouched(true);
//                                                         }}
//                                                         maxLength={60}
//                                                     />
//                                                     <Input
//                                                         value={lastname}
//                                                         isClearable
//                                                         label="Apellido"
//                                                         placeholder="Ingrese su apellido"
//                                                         isInvalid={isLastNameTouched && isInvalidLastname}
//                                                         errorMessage="El campo apellido debe contener al menos 5 caracteres"
//                                                         onValueChange={(lastname) => {
//                                                             setLastname(lastname);
//                                                             setIsLastNameTouched(true);
//                                                         }}
//                                                         maxLength={60}
//                                                     />
//                                                 </div>
//                                                 <Input
//                                                     value={passwd}
//                                                     label="Contraseña"
//                                                     placeholder="Ingrese su nueva contraseña"
//                                                     isInvalid={isPasswdTouched && isInvalidPasswd}
//                                                     errorMessage={passwordError}
//                                                     onValueChange={(passwd) => {
//                                                         setPasswd(passwd);
//                                                         setIsPasswdTouched(true);
//                                                     }}
//                                                     endContent={
//                                                         <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
//                                                             {isVisible ? (
//                                                                 <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
//                                                             ) : (
//                                                                 <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
//                                                             )}
//                                                         </button>
//                                                     }
//                                                     type={isVisible ? "text" : "password"}
//                                                     maxLength={20}
//                                                 />
//                                             </div>
//                                             {isStudent && user.Docente && (
//                                                 <Select
//                                                     items={docentes}
//                                                     label="Docente"
//                                                     placeholder="Selecciona a tu docente"
//                                                     labelPlacement="outside"
//                                                     classNames={{ base: "w-full", trigger: "h-12" }}
//                                                     selectedKeys={selectedKeys}
//                                                     onSelectionChange={handleSelectionChange}
//                                                     renderValue={(items: SelectedItems<User>) => {
//                                                         return items.map((item) => (
//                                                             <div key={item.key} className="flex items-center gap-2">
//                                                                 <Avatar
//                                                                     name={`${item.data?.Nombre?.[0] || ""}${item.data?.Apellido?.[0] || ""}`}
//                                                                     src={item.data?.Perfil ? `${storageUrl}/${item.data.Perfil}` : undefined}
//                                                                     className="flex-shrink-0"
//                                                                     size="sm"
//                                                                 />
//                                                                 <div className="flex flex-col">
//                                                                     <span>{item.data?.Nombre} {item.data?.Apellido}</span>
//                                                                     <span className="text-default-500 text-tiny">({item.data?.Correo})</span>
//                                                                 </div>
//                                                             </div>
//                                                         ));
//                                                     }}
//                                                 >
//                                                     {(docente) => (
//                                                         <SelectItem key={docente.ID_Usuario.toString()} textValue={docente.Nombre}>
//                                                             <div className="flex gap-2 items-center">
//                                                                 <Avatar
//                                                                     name={!docente?.Perfil ? `${docente?.Nombre?.[0] || ''}${docente?.Apellido?.[0] || ''}` : undefined}
//                                                                     src={docente?.Perfil ? `${storageUrl}/${docente.Perfil}` : undefined}
//                                                                     size="md"
//                                                                 />
//                                                                 <div className="flex flex-col">
//                                                                     <span className="text-small">{docente.Nombre} {docente.Apellido}</span>
//                                                                     <span className="text-tiny text-default-400">{docente.Correo}</span>
//                                                                 </div>
//                                                             </div>
//                                                         </SelectItem>
//                                                     )}
//                                                 </Select>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <Button className="w-full h-12 bg-[#2E6CB5] text-white text-lg font-bold" type="submit">
//                                         Actualizar
//                                     </Button>
//                                     {errorMessage && (
//                                         <ErrorModal
//                                             message={errorMessage}
//                                             onClose={() => setErrorMessage('')} // Limpiar mensaje de error al cerrar
//                                             className="z-100"
//                                         />
//                                     )}
//                                 </form>
//                             </ModalBody>
//                         </div>
//                     )}
//                 </ModalContent>
//             </Modal>
//         </section>
//     );
// }




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
import { PencilEdit02Icon } from "hugeicons-react";
import { useEffect, useState } from "react";
import userStudent from "@/app/_lib/landing/useUserForm";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import { useRouter } from "next/navigation";
import ErrorModal from "@/app/mensajes";

type Role = {
    ID_Rol: number;
    Nombre_Rol: string;
};

type Docente = {
    ID_Usuario: number;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil?: string;
};

type User = {
    ID_Usuario: number;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil?: string;
    Roles: Role[];
    Docente?: Docente;
};

export default function UpdateProfile() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL!;
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [user, setUser] = useState<User | null>(null);
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [profileuser, setProfileuser] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
                    .filter((roleUser: { ID_Rol: number }) => roleUser.ID_Rol === 2)
                    .map((roleUser: { ID_Usuario: number }) => roleUser.ID_Usuario);

                const teachersResponse = await fetch(`${backendUrl}/users`);
                const teachersData = await teachersResponse.json();
                if (Array.isArray(teachersData.data)) {
                    const teachersList: Docente[] = teachersData.data
                        .filter((teacher: { ID_Usuario: number }) => teacherIds.includes(teacher.ID_Usuario))
                        .map((teacher: Docente) => teacher);
                    setDocentes(teachersList);
                }
            } catch (error) {
                console.error("Error al obtener los docentes:", error);
            }
        };
        fetchDocentes();
    }, [backendUrl]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No se encontró el token.");
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
                    throw new Error("Error al obtener los datos del usuario.");
                }

                const data = await response.json();
                setUser(data.data);

                if (data.data?.Docente?.ID_Usuario) {
                    setSelectedKeys(new Set([data.data.Docente.ID_Usuario.toString()]));
                }

                setName(data.data.Nombre);
                setLastname(data.data.Apellido);
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [backendUrl, setName, setLastname]);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <div>No se encontraron usuarios</div>;
    }

    const isStudent = user?.Roles?.some((role) => role.ID_Rol === 3) ?? false;

    const handleSelectionChange = (keys: SharedSelection) => {
        if (keys === "all") {
            setSelectedKeys(new Set<string>());
        } else {
            setSelectedKeys(new Set(keys as Set<string>));
        }
    };

    const handleFileChange = async (newFile: File | null) => {
        const validFormats = ["image/jpeg", "image/png", "image/jpg"];
        if (newFile && !validFormats.includes(newFile.type)) {
            setImageError("Por favor, sube una imagen en formato JPG, JPEG o PNG.");
            return;
        }
        setImageError(null);
        setProfileuser(newFile);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No se encontró el token.");
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

        try {
            const response = await fetch(`${backendUrl}/users/${user.ID_Usuario}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-HTTP-Method-Override": "PUT",
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
                throw new Error(errorData.message);
            }

            const data = await response.json();
            setUser(data.data);
            setSuccessMessage("Los datos se actualizaron con éxito.");
            onOpenChange();
            router.refresh();
        } catch (error) {
            console.error("Error al actualizar los datos del usuario:", error);
            setErrorMessage("Error al actualizar los datos del usuario.");
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
                            <ModalHeader>Actualiza tu perfil</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {/* Sección del formulario */}
                                </form>
                            </ModalBody>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
