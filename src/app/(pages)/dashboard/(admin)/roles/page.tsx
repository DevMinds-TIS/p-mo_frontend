// import { Card, CardBody, CardFooter } from "@nextui-org/react";
// import NewRole from "./NewRole";
// import { AccountSetting03Icon, ConferenceIcon, ConversationIcon, HierarchyIcon, ManagerIcon, StudentIcon, TeacherIcon, UserGroupIcon } from "hugeicons-react";

// export default function RolesPage() {
//     return (
//         <section>
//             <div className="flex justify-between">
//                 <h1 className="text-4xl">
//                     Roles
//                 </h1>
//                 <NewRole />
//             </div>
//             <div className="flex flex-wrap grow gap-4 p-3">
//                 <Card shadow="sm" isPressable>
//                     <CardBody className="overflow-visible p-2 flex items-center">
//                         <ManagerIcon
//                             size={48}
//                         />
//                     </CardBody>
//                     <CardFooter className="text-small gap-4">
//                         <b>Administrador</b>
//                         <p className="text-default-500">3</p>
//                     </CardFooter>
//                 </Card>
//                 <Card shadow="sm" isPressable>
//                     <CardBody className="overflow-visible p-2 flex items-center">
//                         <TeacherIcon
//                             size={48}
//                         />
//                     </CardBody>
//                     <CardFooter className="text-small gap-4">
//                         <b>Docente</b>
//                         <p className="text-default-500">4</p>
//                     </CardFooter>
//                 </Card>
//                 <Card shadow="sm" isPressable>
//                     <CardBody className="overflow-visible p-2 flex items-center">
//                         <StudentIcon
//                             size={48}
//                         />
//                     </CardBody>
//                     <CardFooter className="text-small gap-4">
//                         <b>Estudiante</b>
//                         <p className="text-default-500">6</p>
//                     </CardFooter>
//                 </Card>
//                 <Card shadow="sm" isPressable>
//                     <CardBody className="overflow-visible p-2 flex items-center">
//                         <HierarchyIcon
//                             size={48}
//                         />
//                     </CardBody>
//                     <CardFooter className="text-small gap-4">
//                         <b>Representante legal</b>
//                         <p className="text-default-500">1</p>
//                     </CardFooter>
//                 </Card>
//                 <Card shadow="sm" isPressable>
//                     <CardBody className="overflow-visible p-2 flex items-center">
//                         <UserGroupIcon
//                             size={48}
//                         />
//                     </CardBody>
//                     <CardFooter className="text-small gap-4">
//                         <b>Miembro de equipo</b>
//                         <p className="text-default-500">5</p>
//                     </CardFooter>
//                 </Card>
//                 <Card shadow="sm" isPressable>
//                     <CardBody className="overflow-visible p-2 flex items-center">
//                         <ConversationIcon
//                             size={48}
//                         />
//                     </CardBody>
//                     <CardFooter className="text-small gap-4">
//                         <b>Product Owner</b>
//                         <p className="text-default-500">4</p>
//                     </CardFooter>
//                 </Card>
//                 <Card shadow="sm" isPressable>
//                     <CardBody className="overflow-visible p-2 flex items-center">
//                         <AccountSetting03Icon
//                             size={48}
//                         />
//                     </CardBody>
//                     <CardFooter className="text-small gap-4">
//                         <b>Scrum master</b>
//                         <p className="text-default-500">6</p>
//                     </CardFooter>
//                 </Card>
//                 <Card shadow="sm" isPressable>
//                     <CardBody className="overflow-visible p-2 flex items-center">
//                         <ConferenceIcon
//                             size={48}
//                         />
//                     </CardBody>
//                     <CardFooter className="text-small gap-4">
//                         <b>Scrum team</b>
//                         <p className="text-default-500">6</p>
//                     </CardFooter>
//                 </Card>
//             </div>
//         </section>
//     );
// }

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
