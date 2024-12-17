import { Tabs, Tab } from "@nextui-org/react";
import StudentSignIn from "./studentSignIn";
import TeacherSignIn from "./teacherSignIn";
import AdminSignIn from "./adminSignIn";

export default function SingUp() {
    return (
        <section className="w-full">
            <h3 className="p-2">
                <AdminSignIn/>
            </h3>
            <Tabs aria-label="Options" color="primary" size="lg" fullWidth>
                <Tab key="student" title="Estudiante">
                    <StudentSignIn></StudentSignIn>
                </Tab>
                <Tab key="teacher" title="Docente">
                    <TeacherSignIn></TeacherSignIn>
                </Tab>
            </Tabs>
        </section>
    );
}