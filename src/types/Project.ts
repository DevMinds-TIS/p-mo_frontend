import { Document } from "./Document";

export interface Project {
    ID_Proyecto: number;
    ID_Usuario: number;
    Nombre_Proyecto: string;
    Código_Proyecto: string;
    Documentos: Document[];
    Gestión_Proyecto?: string;
    Fecha_Inicio?: string;
    Fecha_Fin?: string;
    created_at: string;
    updated_at: string;
}