import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const translations: { [key: string]: string } = {
    announcement: "Anuncios",
    test: "Evaluaciones",
    planning: "Planificación",
    details: "Detalles",
    team: "Equipo",
    projects: "Proyectos",
    spaces: "Espacios",
    notification: "Notificaciones",
    profile: "Perfil",
    roles: "Roles",
    permissions: "Permisos",
    teams: "Equipos"
};

export default function BreadcrumbsComponent() {
    const pathName = usePathname();
    const pathArray = pathName ? pathName.split('/').filter(x => x) : [];

    return (
        <div className="flex ml-auto">
            {pathArray.length > 0 && (
                <Breadcrumbs>
                    {pathArray.map((path, index) => (
                        <BreadcrumbItem key={index}>
                            <Link href={`/${pathArray.slice(0, index + 1).join('/')}`} className="text-base">
                                {translations[path] || (path.charAt(0).toUpperCase() + path.slice(1))}
                            </Link>
                        </BreadcrumbItem>
                    ))}
                </Breadcrumbs>
            )}
        </div>
    );
}