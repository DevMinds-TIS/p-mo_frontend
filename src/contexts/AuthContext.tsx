"use client";
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/User';
import { useUser } from './UserContext';

interface AuthContextProps {
  user: User | null;
  login: (emailuser: string, passworduser: string) => Promise<void>;
  logout: () => Promise<void>;
  registerAdmin: (userData: Record<string, any>) => Promise<void>;
  registerStudent: (userData: Record<string, any>) => Promise<void>;
  registerTeacher: (userData: Record<string, any>) => Promise<void>;
  requestTeacherCode: (email: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [setUser]);

  const login = async (emailuser: string, passworduser: string) => {
    const response = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailuser, passworduser }),
    });
    const data = await response.json();
    setUser(data.user);
    console.log("USERDATA", data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = async () => {
    await fetch(`${backendUrl}/logout`, { method: 'POST' });
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const registerAdmin = async (userData: Record<string, any>) => {
    const response = await fetch(`${backendUrl}/register-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const registerStudent = async (userData: Record<string, any>) => {
    const response = await fetch(`${backendUrl}/register-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const registerTeacher = async (userData: Record<string, any>) => {
    const response = await fetch(`${backendUrl}/register-teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
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
    <AuthContext.Provider value={{ user, login, logout, registerAdmin, registerStudent, registerTeacher, requestTeacherCode }}>
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