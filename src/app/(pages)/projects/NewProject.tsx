"use client";
import { Button, useDisclosure, Input, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@nextui-org/react";
import { AddSquareIcon } from "hugeicons-react";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useState, useEffect } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import { useUser } from '@/contexts/UserContext';
import { useProject } from '@/contexts/ProjectContext';
import { useAlert } from "@/contexts/AlertContext";

export default function NewProject() {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const { user } = useUser();
    const { createProject } = useProject();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const currentYear = new Date().getFullYear();
    const minDate = parseDate(`${currentYear}-01-01`);
    const maxDate = parseDate(`${currentYear}-12-31`);

    const [projectName, setProjectName] = useState("");
    const [projectCode, setProjectCode] = useState("");
    const [dateRange, setDateRange] = useState<{ start: string | null, end: string | null }>({ start: null, end: null });
    const [invitationFile, setInvitationFile] = useState<File | null>(null);
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);
    const [invitationError, setInvitationError] = useState<string | null>(null);
    const [specificationError, setSpecificationError] = useState<string | null>(null);

    useEffect(() => {
        validateForm();
    }, [projectName, projectCode, dateRange, invitationFile, specificationFile]);

    const validateForm = () => {
        let formErrors: { [key: string]: string } = {};

        if (!projectName) {
            formErrors["projectName"] = "El nombre del proyecto es obligatorio.";
        } else if (projectName.length < 7) {
            formErrors["projectName"] = "El nombre del proyecto debe tener al menos 7 caracteres.";
        }

        if (!projectCode) {
            formErrors["projectCode"] = "El código del proyecto es obligatorio.";
        } else if (projectCode.includes(" ")) {
            formErrors["projectCode"] = "El código del proyecto no debe tener espacios.";
        }

        if (invitationFile && invitationFile.size > 2 * 1024 * 1024) {
            formErrors["invitationFile"] = "El archivo de invitación no debe ser mayor a 2 MB.";
        }

        if (specificationFile && specificationFile.size > 2 * 1024 * 1024) {
            formErrors["specificationFile"] = "El archivo de especificaciones no debe ser mayor a 2 MB.";
        }

        setErrors(formErrors);
        setIsFormValid(Object.keys(formErrors).length === 0);
    };

    const handleFileValidation = (file: File | null, setError: React.Dispatch<React.SetStateAction<string | null>>): File | null => {
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Solo se permiten archivos en formato PDF.");
                return null;
            } else {
                setError(null);
                return file;
            }
        }
        return null;
    };

    const [namespaceError, setNamespaceError] = useState<string>("");

    const handleNamespaceChange = (value: string) => {
        if (/\s/.test(value)) {
            setNamespaceError("El código no puede contener espacios.");
        } else {
            setNamespaceError("");
        }
        setProjectCode(value);
    };

    const handleInvitationFileChange = (newFile: File | null) => {
        setInvitationFile(handleFileValidation(newFile, setInvitationError));
    };

    const handleSpecificationFileChange = (newFile: File | null) => {
        setSpecificationFile(handleFileValidation(newFile, setSpecificationError));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isFormValid) {
            return;
        }

        const formData = new FormData();
        formData.append("iduser", user?.ID_Usuario.toString() || "");
        formData.append("nameproject", projectName);
        formData.append("codeproject", projectCode);

        const startProjectDate = dateRange.start ? new Date(dateRange.start) : null;
        const endProjectDate = dateRange.end ? new Date(dateRange.end) : null;

        const termProject = calculateTermProject(startProjectDate, endProjectDate);

        formData.append("startproject", startProjectDate ? startProjectDate.toISOString().split('T')[0] : "");
        formData.append("endproject", endProjectDate ? endProjectDate.toISOString().split('T')[0] : "");
        formData.append("termproject", termProject);

        const documents = [
            { file: invitationFile, field: "invitation" },
            { file: specificationFile, field: "specification" }
        ];
        documents.forEach(document => {
            if (document.file) {
                formData.append(document.field, document.file);
            }
        });

        setIsLoading(true);
        try {
            await createProject(formData);
            showAlert("¡Proyecto creado!", "El proyecto ha sido creado exitosamente.", "success");
            onOpenChange();
        } catch (error) {
            showAlert("Error al crear el proyecto", "Hubo un problema al crear el proyecto. Inténtalo de nuevo.", "danger");
            console.error("Error al crear el proyecto:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTermProject = (startProjectDate: Date | null, endProjectDate: Date | null): string => {
        if (!startProjectDate || !endProjectDate) return "";

        const year = startProjectDate.getFullYear();
        const startMonth = startProjectDate.getMonth() + 1;
        const endMonth = endProjectDate.getMonth() + 1;

        if (startMonth <= 6 && endMonth <= 6) {
            return `1/${year}`;
        } else if (startMonth >= 7 && endMonth >= 7) {
            return `2/${year}`;
        } else {
            return `Span/${year}`;
        }
    };

    return (
        <section>
            <Button onPress={onOpen} color="primary" className="flex items-center">
                <AddSquareIcon />
                <p>Nuevo proyecto</p>
            </Button>
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <>
                        <DrawerHeader className="flex flex-col gap-1">Crear proyecto</DrawerHeader>
                        <form onSubmit={handleSubmit}>
                            <DrawerBody>
                                <Input
                                    label="Nombre del proyecto"
                                    placeholder="Escribe el nombre del proyecto"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    errorMessage={errors["projectName"]}
                                />
                                <Input
                                    label="Código del proyecto"
                                    placeholder="Escribe el código del proyecto"
                                    value={projectCode}
                                    onChange={(e) => handleNamespaceChange(e.target.value)}
                                    errorMessage={errors["projectCode"]}
                                />
                                {namespaceError && <p className="text-red-500 text-sm mt-1">{namespaceError}</p>}
                                <I18nProvider locale="es-BO">
                                    <DateRangePicker
                                        allowsNonContiguousRanges
                                        label="Duración del proyecto"
                                        minValue={minDate}
                                        maxValue={maxDate}
                                        visibleMonths={3}
                                        pageBehavior="single"
                                        onChange={(range) => {
                                            if (range) {
                                                setDateRange({
                                                    start: range.start ? range.start.toString() : null,
                                                    end: range.end ? range.end.toString() : null
                                                });
                                            }
                                        }}
                                    />
                                </I18nProvider>
                                <div className="space-y-2">
                                    <p>Invitación del proyecto</p>
                                    <FileUpload onChange={handleInvitationFileChange} />
                                    {invitationError && <p className="text-danger text-sm mt-1">{invitationError}</p>}
                                </div>
                                <div className="space-y-2">
                                    <p>Pliego de especificaciones del proyecto</p>
                                    <FileUpload onChange={handleSpecificationFileChange} />
                                    {specificationError && <p className="text-danger text-sm mt-1">{specificationError}</p>}
                                </div>
                            </DrawerBody>
                            <DrawerFooter>
                                {isLoading ? (
                                    <Button isLoading className="w-full h-14 text-light" color="primary">
                                        Creando proyecto...
                                    </Button>
                                ) : (
                                    <Button color="primary" className="w-full h-12" type="submit" isDisabled={
                                        !isFormValid ||
                                        !projectCode ||
                                        namespaceError !== "" ||
                                        invitationError !== null ||
                                        specificationError !== null ||
                                        invitationFile?.type !== "application/pdf" ||
                                        specificationFile?.type !== "application/pdf"
                                    }>
                                        Crear proyecto
                                    </Button>
                                )}
                            </DrawerFooter>
                        </form>
                    </>
                </DrawerContent>
            </Drawer>
        </section >
    );
}