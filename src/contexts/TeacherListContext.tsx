"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types/User';

interface TeacherListContextProps {
  teachers: User[] | null;
  fetchTeachers: () => Promise<void>;
}

const TeacherListContext = createContext<TeacherListContextProps | undefined>(undefined);
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const TeacherListProvider = ({ children }: { children: ReactNode }) => {
  const [teachers, setTeachers] = useState<User[] | null>(null);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${backendUrl}/role-user`);
      const data = await response.json();
      const teacherIds = data.data.filter((user: { ID_Rol: number }) => user.ID_Rol === 2).map((user: { ID_Usuario: number }) => user.ID_Usuario);

      const teachersResponse = await fetch(`${backendUrl}/users`);
      const teachersData = await teachersResponse.json();

      if (Array.isArray(teachersData.data)) {
        const teachersList: User[] = teachersData.data.filter((user: { ID_Usuario: number }) => teacherIds.includes(user.ID_Usuario)).map((teacher: { ID_Usuario: number; Nombre: string; Apellido: string; Correo: string; Perfil: string; }) => ({
          ID_Usuario: teacher.ID_Usuario,
          Nombre: teacher.Nombre,
          Apellido: teacher.Apellido,
          Correo: teacher.Correo,
          Perfil: teacher.Perfil,
        }));
        setTeachers(teachersList);
      } else {
        console.error('Error: Expected an array but got:', teachersData.data);
      }
    } catch (error) {
      console.error('Error al obtener los docentes:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <TeacherListContext.Provider value={{ teachers, fetchTeachers }}>
      {children}
    </TeacherListContext.Provider>
  );
};

export const useTeacherList = () => {
  const context = useContext(TeacherListContext);
  if (context === undefined) {
    throw new Error('useTeacherList must be used within a TeacherListProvider');
  }
  return context;
};