"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/User';

interface UserContextProps {
  users: User[] | null;
  user: User | null;
  fetchUsers: () => Promise<void>;
  fetchUser: (userId: number) => Promise<void>;
  updateUser: (userId: number, userData: FormData) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/users`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const fetchUser = async (userId: number) => {
    try {
      const response = await fetch(`${backendUrl}/users/${userId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }
      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  const updateUser = async (userId: number, userData: FormData) => {
    try {
      const response = await fetch(`${backendUrl}/users/${userId}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "X-HTTP-Method-Override": "PUT"
        },
        body: userData,
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }
      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`${backendUrl}/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      setUsers(users => users ? users.filter(user => user.ID_Usuario !== userId) : null);
      setUser(null);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <UserContext.Provider value={{ users, user, fetchUsers, fetchUser, updateUser, deleteUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};