"use client";
import { User } from '@/types/User';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  user: User | null;
  login: (emailuser: string, passworduser: string) => Promise<void>;
  logout: () => Promise<void>;
  registerAdmin: (userData: Record<string, any>) => Promise<void>;
  registerStudent: (userData: Record<string, any>) => Promise<void>;
  registerTeacher: (userData: Record<string, any>) => Promise<void>;
  fetchTeachers: () => Promise<{ key: number; label: string }[]>;
  requestTeacherCode: (email: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (emailuser: string, passworduser: string) => {
    const response = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailuser, passworduser }),
    });
    const data = await response.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch(`${backendUrl}/logout`, { method: 'POST' });
    setUser(null);
  };

  const registerAdmin = async (userData: Record<string, any>) => {
    const response = await fetch(`${backendUrl}/register-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    setUser(data.user);
  };

  const registerStudent = async (userData: Record<string, any>) => {
    const response = await fetch(`${backendUrl}/register-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    setUser(data.user);
  };

  const registerTeacher = async (userData: Record<string, any>) => {
    const response = await fetch(`${backendUrl}/register-teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    setUser(data.user);
  };

  const fetchTeachers = async () => {
    const response = await fetch(`${backendUrl}/role-user`);
    const data = await response.json();
    const teacherIds = data.data.filter((user: { 'ID_Rol': number }) => user['ID_Rol'] === 2).map((user: { 'ID_Usuario': number }) => user['ID_Usuario']);

    const teachersResponse = await fetch(`${backendUrl}/users`);
    const teachersData = await teachersResponse.json();

    if (Array.isArray(teachersData.data)) {
      return teachersData.data.filter((user: { 'ID_Usuario': number }) => teacherIds.includes(user['ID_Usuario']))
        .map((teacher: { 'ID_Usuario': number; Nombre: string; Apellido: string }) => ({
          key: teacher['ID_Usuario'],
          label: `${teacher['Nombre']} ${teacher['Apellido']}`,
        }));
    } else {
      throw new Error('Error: Expected an array but got:', teachersData.data);
    }
  };

  const requestTeacherCode = async (email: string, name: string) => {
    const requestData = { email, name };
    const response = await fetch(`${backendUrl}/sendEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) {
      throw new Error('Error al solicitar el código');
    } console.log('Código solicitado exitosamente');
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, registerAdmin, registerStudent, registerTeacher, fetchTeachers, requestTeacherCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
