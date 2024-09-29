import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Tabs, Tab} from "@nextui-org/react";
import StudentSignIn from "./studentSignIn";
import TeacherSignIn from "./teacherSignIn";

export default function SingUp() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <section>
      <Button onPress={onOpen} className="w-full h-14 bg-[#fe7f2d] text-white">
          Crea una nueva cuenta
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="xl" backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-5xl">Únete</ModalHeader>
                <ModalBody>
                  <Tabs aria-label="Options" size="lg" fullWidth>
                    <Tab key="student" title="Estudiante">
                      <StudentSignIn></StudentSignIn>
                    </Tab>
                    <Tab key="teacher" title="Docente">
                      <TeacherSignIn></TeacherSignIn>
                    </Tab>
                  </Tabs>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
    </section>
  );
}