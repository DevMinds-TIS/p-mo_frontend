import { Card, CardBody, CardFooter } from "@nextui-org/react";
import NewRole from "./NewRole";
import {
    AccountSetting03Icon,
    ConferenceIcon,
    ConversationIcon,
    HierarchyIcon,
    ManagerIcon,
    StudentIcon,
    TeacherIcon,
    UserGroupIcon
} from "hugeicons-react";

const roles = [
    { Icon: ManagerIcon, title: "Administrador", count: 3 },
    { Icon: TeacherIcon, title: "Docente", count: 4 },
    { Icon: StudentIcon, title: "Estudiante", count: 6 },
    { Icon: HierarchyIcon, title: "Representante legal", count: 1 },
    { Icon: UserGroupIcon, title: "Miembro de equipo", count: 5 },
    { Icon: ConversationIcon, title: "Product Owner", count: 4 },
    { Icon: AccountSetting03Icon, title: "Scrum master", count: 6 },
    { Icon: ConferenceIcon, title: "Scrum team", count: 6 }
];

export default function RolesPage() {
    return (
        <section>
            <div className="flex justify-between">
                <h1 className="text-4xl">Roles</h1>
                <NewRole />
            </div>
            <div className="flex flex-wrap grow gap-4 p-3">
                {roles.map((role, index) => (
                    <Card key={index} shadow="sm" isPressable>
                        <CardBody className="overflow-visible p-2 flex items-center">
                            <role.Icon size={48} />
                        </CardBody>
                        <CardFooter className="text-small gap-4">
                            <b>{role.title}</b>
                            <p className="text-default-500">{role.count}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
