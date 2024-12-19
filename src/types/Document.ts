export interface Document {
    ID_Documento: number;
    ID_Proyecto: number;
    ID_Espacio?: number;
    ID_Planificación?: number;
    ID_Seguimiento?: number;
    ID_Historia?: number;
    ID_Tarea?: number;
    ID_Equipo?: number;
    Nombre_Documento: string;
    Ruta_Documento: string;
    created_at: string;
    updated_at: string;
}