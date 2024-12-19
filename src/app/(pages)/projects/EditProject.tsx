"use client";
import { Button, useDisclosure, Input, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@nextui-org/react";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import React, { useState, useEffect } from "react";
import { FileUpload } from "@/app/_lib/components/FileUpload";
import { useUser } from '@/contexts/UserContext';
import { useDocumentContext } from '@/contexts/DocumentContext';
import { useProject } from '@/contexts/ProjectContext';
import { useAlert } from "@/contexts/AlertContext";
import { Project } from "@/types/Project";
import { PencilEdit02Icon } from "hugeicons-react";

interface EditProjectProps {
    project: Project;
}

export default function EditProject({ project }: EditProjectProps) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const { user } = useUser();
    const { updateProject } = useProject();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const { documents, fetchDocuments } = useDocumentContext();
    const currentYear = new Date().getFullYear();
    const minDate = parseDate(`${currentYear}-01-01`);
    const maxDate = parseDate(`${currentYear}-12-31`);

    const [projectName, setProjectName] = useState(project.Nombre_Proyecto);
    const [projectCode, setProjectCode] = useState(project.Código_Proyecto);
    const [dateRange, setDateRange] = useState<{ start: string | null, end: string | null }>({
        start: project.Fecha_Inicio || "",
        end: project.Fecha_Fin || ""
    });
    const [invitationFile, setInvitationFile] = useState<File | null>(null);
    const [specificationFile, setSpecificationFile] = useState<File | null>(null);
    const [invitationError, setInvitationError] = useState<string | null>(null);
    const [specificationError, setSpecificationError] = useState<string | null>(null);
    const storageUrl = process.env.NEXT_PUBLIC_LARAVEL_PUBLIC_BACKEND_URL;

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const projectDocuments = documents.filter(doc => doc.ID_Proyecto === project.ID_Proyecto);

    const existingInvitationFile = projectDocuments.find(doc => doc.Nombre_Documento === 'Invitación del proyecto') || null;
    const existingSpecificationFile = projectDocuments.find(doc => doc.Nombre_Documento === 'Pliego de especificaciones') || null;

    const existingInvitationFileUrl = existingInvitationFile ? `${storageUrl}/${existingInvitationFile.Ruta_Documento}` : undefined;
    const existingSpecificationFileUrl = existingSpecificationFile ? `${storageUrl}/${existingSpecificationFile.Ruta_Documento}` : undefined;

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
            await updateProject(project.ID_Proyecto, formData);
            showAlert("¡Proyecto actualizado!", "El proyecto ha sido actualizado exitosamente.", "success");
            onOpenChange();
        } catch (error) {
            showAlert("Error al actualizar el proyecto", "Hubo un problema al actualizar el proyecto. Inténtalo de nuevo.", "danger");
            console.error("Error al actualizar el proyecto:", error);
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
                <PencilEdit02Icon />
                <p>Editar proyecto</p>
            </Button>
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <>
                        <DrawerHeader className="flex flex-col gap-1">Editar proyecto</DrawerHeader>
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
                                    onChange={(e) => setProjectCode(e.target.value)}
                                    errorMessage={errors["projectCode"]}
                                />
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
                                    <FileUpload
                                        onChange={handleInvitationFileChange}
                                        existingFile={existingInvitationFile ? { name: existingInvitationFile.Nombre_Documento, url: existingInvitationFileUrl as string } : null}
                                    />
                                    {invitationError && <p className="text-danger text-sm mt-1">{invitationError}</p>}
                                </div>
                                <div className="space-y-2">
                                    <p>Pliego de especificaciones del proyecto</p>
                                    <FileUpload
                                        onChange={handleSpecificationFileChange}
                                        existingFile={existingSpecificationFile ? { name: existingSpecificationFile.Nombre_Documento, url: existingSpecificationFileUrl as string } : null}
                                    />
                                    {errors["specificationFile"] && <span className="text-foreground">{errors["specificationFile"]}</span>}
                                </div>
                            </DrawerBody>
                            <DrawerFooter>
                                {isLoading ? (
                                    <Button isLoading className="w-full h-14 text-light" color="primary">
                                        Actualizando proyecto...
                                    </Button>
                                ) : (
                                    <Button color="primary" className="w-full h-12" type="submit" isDisabled={!isFormValid}>
                                        Actualizar proyecto
                                    </Button>
                                )}
                            </DrawerFooter>
                        </form>
                    </>
                </DrawerContent>
            </Drawer>
        </section>
    );
}
