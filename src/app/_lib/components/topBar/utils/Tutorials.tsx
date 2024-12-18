import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { AddTeamIcon, FolderLibraryIcon, Layers02Icon, StepIntoIcon, UserAccountIcon } from "hugeicons-react";

export default function Tutorials() {
    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer">
                    <StepIntoIcon />
                    <p>Tutoriales</p>
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Tutorials Actions" variant="flat">
                <DropdownItem key="projects" className="h-14">
                    <div className="flex items-center gap-3">
                        <FolderLibraryIcon />
                        <p>Crear proyectos</p>
                    </div>
                </DropdownItem>
                <DropdownItem key="spaces" className="h-14">
                    <div className="flex items-center gap-3">
                        <UserAccountIcon />
                        <p>Crear espacios</p>
                    </div>
                </DropdownItem>
                <DropdownItem key="teams" className="h-14">
                    <div className="flex items-center gap-3">
                        <Layers02Icon />
                        <p>Crear equipos</p>
                    </div>
                </DropdownItem>
                <DropdownItem key="teams" className="h-14">
                    <div className="flex items-center gap-3">
                        <AddTeamIcon />
                        <p>Agregar miembros a un equipo</p>
                    </div>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}