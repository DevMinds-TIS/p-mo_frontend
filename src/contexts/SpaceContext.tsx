"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Space } from '@/types/Space';

interface SpaceContextProps {
    spaces: Space[];
    fetchSpaces: () => Promise<void>;
    addSpace: (newSpace: Space) => void;
    updateSpace: (updatedSpace: Space) => void;
    deleteSpace: (spaceId: number) => void;
}

const SpaceContext = createContext<SpaceContextProps | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [token, setToken] = useState<string | null>(null);

    const fetchSpaces = useCallback(async () => {
        if (token) {
            const storedSpaces = localStorage.getItem('spaces');
            if (storedSpaces) {
                setSpaces(JSON.parse(storedSpaces));
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/spaces`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setSpaces(data.data);
                localStorage.setItem('spaces', JSON.stringify(data.data));
            }
        }
    }, [token]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        fetchSpaces();
    }, [fetchSpaces]);

    const addSpace = (newSpace: Space) => {
        setSpaces(prevSpaces => {
            const updatedSpaces = [...prevSpaces, newSpace];
            localStorage.setItem('spaces', JSON.stringify(updatedSpaces));
            return updatedSpaces;
        });
    };

    const updateSpace = (updatedSpace: Space) => {
        setSpaces(prevSpaces => {
            const updatedSpaces = prevSpaces.map(space =>
                space.ID_Espacio === updatedSpace.ID_Espacio ? updatedSpace : space
            );
            localStorage.setItem('spaces', JSON.stringify(updatedSpaces));
            return updatedSpaces;
        });
    };

    const deleteSpace = (spaceId: number) => {
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/spaces/${spaceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                setSpaces(prevSpaces => {
                    const updatedSpaces = prevSpaces.filter(space => space.ID_Espacio !== spaceId);
                    localStorage.setItem('spaces', JSON.stringify(updatedSpaces));
                    return updatedSpaces;
                });
            }).catch(err => console.error(err));
        }
    };

    return (
        <SpaceContext.Provider
            value={{
                spaces,
                fetchSpaces,
                addSpace,
                updateSpace,
                deleteSpace,
            }}
        >
            {children}
        </SpaceContext.Provider>
    );
};

export const useSpaceContext = () => {
    const context = useContext(SpaceContext);
    if (!context) {
        throw new Error('useSpaceContext debe ser usado dentro de un SpaceProvider');
    }
    return context;
};
