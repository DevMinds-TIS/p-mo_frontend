"use client";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, useDisclosure, Tabs, Tab, Kbd } from "@nextui-org/react";
import StudentSignIn from "@/app/_lib/components/topBar/auth/register/Student";
import TeacherSignIn from "@/app/_lib/components/topBar/auth/register/Teacher";
import { Logout05Icon } from "hugeicons-react";

export default function SignUp() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <section className="w-full">
      <Button variant="bordered" color="secondary" onPress={onOpen}>
        <Logout05Icon />
        <p>Registrarse</p>
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="right" size="xl">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <p className="text-3xl">Únete</p>
              </DrawerHeader>
              <DrawerBody>
                <Tabs aria-label="Options" size="lg" color="primary" fullWidth>
                  <Tab key="student" title="Estudiante">
                    <StudentSignIn onClose={onClose} />
                  </Tab>
                  <Tab key="teacher" title="Docente">
                    <TeacherSignIn onClose={onClose} />
                  </Tab>
                </Tabs>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" onPress={onClose}>Cerrar</Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </section>
  );
}
