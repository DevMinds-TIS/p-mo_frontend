// src/context/UserContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { getUserFromToken } from '../utils/auth';  // Implementa esta función en utils

interface UserContextType {
    user: { role: string } | null;
    setUser: (user: { role: string } | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ role: string } | null>(null);

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (token) {
            const decodedUser = getUserFromToken(token);
            setUser(decodedUser);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
