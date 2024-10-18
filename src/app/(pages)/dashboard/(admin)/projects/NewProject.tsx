// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
// import { AddSquareIcon } from "hugeicons-react";
// import { DateRangePicker } from "@nextui-org/react";
// import { parseDate } from "@internationalized/date";
// import { isWeekend } from "@internationalized/date";
// import { I18nProvider } from "@react-aria/i18n";
// import React, { useState } from "react";
// import { FileUpload } from "@/app/_lib/components/FileUpload";

// export default function NewProject() {
//     const { isOpen, onOpen, onOpenChange } = useDisclosure();

//     const currentYear = new Date().getFullYear();

//     const minDate = parseDate(`${currentYear}-01-01`);
//     const maxDate = parseDate(`${currentYear}-12-31`);

//     const [file, setFile] = useState<File | null>(null);

//     const handleFileChange = (newFile: File | null) => {
//         setFile(newFile);
//       };

//     return (
//         <section>
//             <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
//                 <AddSquareIcon size={30} />
//             </Button>
//             <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
//                 <ModalContent>
//                     {(onClose) => (
//                         <div>
//                             <ModalHeader className="flex flex-col gap-1">Crear proyecto</ModalHeader>
//                             <form action="">
//                                 <ModalBody>
//                                     <Input
//                                         label="Nombre del proyecto"
//                                         placeholder="Escribe el nombre del proyecto"
//                                     />
//                                     <Input
//                                         label="Código del proyecto"
//                                         placeholder="Escribe el código del proyecto"
//                                     />
//                                     <I18nProvider locale="es-BO">
//                                         <DateRangePicker
//                                             allowsNonContiguousRanges
//                                             isDateUnavailable={(date) => isWeekend(date, "es-BO")}
//                                             label="Duración del proyecto"
//                                             minValue={minDate}
//                                             maxValue={maxDate}
//                                             visibleMonths={3}
//                                             pageBehavior="single"
//                                         />
//                                     </I18nProvider>
//                                     <div className="space-y-2">
//                                         <p>Invitación del proyecto</p>
//                                         <FileUpload onChange={handleFileChange}/>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <p>Pliego de especificaciones del proyecto</p>
//                                         <FileUpload onChange={handleFileChange}/>
//                                     </div>
//                                 </ModalBody>
//                                 <ModalFooter>
//                                     <Button onPress={onClose} className="w-full">
//                                         Guardar
//                                     </Button>
//                                 </ModalFooter>
//                             </form>
//                         </div>
//                     )}
//                 </ModalContent>
//             </Modal>
//         </section>
//     );
// }

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { isWeekend } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useState } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";

export default function NewProject() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const currentYear = new Date().getFullYear();
    const minDate = parseDate(`${currentYear}-01-01`);
    const maxDate = parseDate(`${currentYear}-12-31`);

    const [projectName, setProjectName] = useState("");
    const [projectCode, setProjectCode] = useState("");
    const [dateRange, setDateRange] = useState<{ start: string | null, end: string | null }>({ start: null, end: null });
    const [invitationFile, setInvitationFile] = useState<File | null>(null);
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);

    const handleInvitationFileChange = (newFile: File | null) => {
        setInvitationFile(newFile);
    };

    const handleSpecificationFileChange = (newFile: File | null) => {
        setSpecificationFile(newFile);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        const formData = new FormData();
        formData.append("nameproject", projectName);
        formData.append("codeproject", projectCode);
        formData.append("startproject", dateRange.start ? dateRange.start.toString() : "");
        formData.append("endproject", dateRange.end ? dateRange.end.toString() : "");
        if (invitationFile) formData.append("invitation", invitationFile);
        if (specificationFile) formData.append("specification", specificationFile);

        try {
            const response = await fetch("http://localhost:8000/api/projects", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al crear el proyecto");
            }

            const result = await response.json();
            console.log("Proyecto creado exitosamente:", result);
            onOpenChange(); // Cerrar el modal
        } catch (error) {
            console.error("Error al crear el proyecto:", error);
        }
    };


    return (
        <section>
            <Button onPress={onOpen} className="min-w-0 p-0 bg-transparent items-center">
                <AddSquareIcon size={30} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside" backdrop="blur" placement="center">
                <ModalContent>
                    {(onClose) => (
                        <div>
                            <ModalHeader className="flex flex-col gap-1">Crear proyecto</ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody>
                                    <Input
                                        label="Nombre del proyecto"
                                        placeholder="Escribe el nombre del proyecto"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                    <Input
                                        label="Código del proyecto"
                                        placeholder="Escribe el código del proyecto"
                                        value={projectCode}
                                        onChange={(e) => setProjectCode(e.target.value)}
                                    />
                                    <I18nProvider locale="es-BO">
                                        <DateRangePicker
                                            allowsNonContiguousRanges
                                            isDateUnavailable={(date) => isWeekend(date, "es-BO")}
                                            label="Duración del proyecto"
                                            minValue={minDate}
                                            maxValue={maxDate}
                                            visibleMonths={3}
                                            pageBehavior="single"
                                            onChange={(range) => setDateRange({ start: range.start.toString(), end: range.end.toString() })}
                                        />
                                    </I18nProvider>
                                    <div className="space-y-2">
                                        <p>Invitación del proyecto</p>
                                        <FileUpload onChange={handleInvitationFileChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <p>Pliego de especificaciones del proyecto</p>
                                        <FileUpload onChange={handleSpecificationFileChange} />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="submit" className="w-full">
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
