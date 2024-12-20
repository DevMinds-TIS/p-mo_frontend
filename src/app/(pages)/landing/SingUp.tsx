// import { Tabs, Tab } from "@nextui-org/react";
// import StudentSignIn from "./studentSignIn";
// import TeacherSignIn from "./teacherSignIn";
// import AdminSignIn from "./adminSignIn";

// export default function SingUp() {
//     return (
//         <section className="w-full p-3">
//             <h3>
//                 <AdminSignIn/>
//             </h3>
//             <Tabs aria-label="Options" color="primary" size="lg" fullWidth>
//                 <Tab key="student" title="Estudiante">
//                     <StudentSignIn></StudentSignIn>
//                 </Tab>
//                 <Tab key="teacher" title="Docente">
//                     <TeacherSignIn></TeacherSignIn>
//                 </Tab>
//             </Tabs>
//         </section>
//     );
// }

import { Tabs, Tab } from "@nextui-org/react";
//import StudentSignIn from "./studentSignIn";
import StudentSignIn from "./studentSignIn";
import TeacherSignIn from "./teacherSignIn";
import AdminSignIn from "./adminSignIn";

export default function SingUp() {
    return (
        <section className="w-full p-3">
            <h3>
                <AdminSignIn />
            </h3>
            <Tabs aria-label="Options" color="primary" size="lg" fullWidth>
                <Tab key="student" title="Estudiante">
                    <StudentSignIn />
                </Tab>
                <Tab key="teacher" title="Docente">
                    <TeacherSignIn />
                </Tab>
            </Tabs>
        </section>
    );
}
