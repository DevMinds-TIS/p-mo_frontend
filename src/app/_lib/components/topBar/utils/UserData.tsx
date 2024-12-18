import { Avatar, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import { FolderLibraryIcon, Logout03Icon, UserIcon, UserSwitchIcon } from "hugeicons-react";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function UserData() {
    const { user, logout } = useAuth();
    const { showAlert } = useAlert();

    const handleLogout = async () => {
        try {
            await logout();
            showAlert("¡Cierre de sesión exitoso!", "", "success");
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name={`${user?.Nombre} ${user?.Apellido}`}
                    size="sm"
                    src={user?.Perfil ? `${process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL}/${user.Perfil}` : "NO"}
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14">
                    <div className="flex items-center gap-5">
                        <User
                            avatarProps={{
                                src: user?.Perfil ? `${process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL}/${user.Perfil}` : "NO",
                                size: "sm",
                                color: "secondary",
                                className: "transition-transform",
                                as: "button",
                                isBordered: true
                            }}
                            description={user?.Correo}
                            name={`${user?.Nombre} ${user?.Apellido}`}
                        />
                        <Chip color="secondary">
                            {user?.Roles?.[0]?.Nombre_Rol || 'Usuario'}
                        </Chip>
                    </div>
                </DropdownItem>
                <DropdownItem key="projects">
                    <Link href={"/projects"} className="flex items-center gap-4">
                        <FolderLibraryIcon />
                        <p>
                            Proyectos
                        </p>
                    </Link>
                </DropdownItem>
                <DropdownItem key="roles">
                    <div className="flex items-center gap-4">
                        <UserSwitchIcon />
                        <p>
                            Roles
                        </p>
                    </div>
                </DropdownItem>
                <DropdownItem key="profile">
                    <div className="flex items-center gap-4">
                        <UserIcon />
                        <p>
                            Perfil
                        </p>
                    </div>
                </DropdownItem>
                <DropdownItem key="logout" className="bg-danger text-light" color="danger" onPress={handleLogout}>
                    <div className="flex items-center gap-4">
                        <Logout03Icon />
                        <p>
                            Cerrar sesión
                        </p>
                    </div>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}