export interface User {
    ID_Usuario: number;
    ID_Siscode?: number;
    ID_Permiso?: number;
    ID_Docente?: number;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Perfil?: string;
    ID_Rol: number;
    Roles: {
      ID_Rol: number;
      Nombre_Rol: string;
      Icono_Rol: string;
    }[];
    Docente?: User;
    ID_Espacio?: number;
    Permiso_Docente?: string;
    Código_SIS?: string;
    created_at: string;
    updated_at: string;
  }
  