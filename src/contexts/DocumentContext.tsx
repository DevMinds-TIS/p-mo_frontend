"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Document } from '@/types/Document';

interface DocumentContextProps {
    documents: Document[];
    fetchDocuments: () => Promise<void>;
    addDocument: (newDocument: Document) => void;
    updateDocument: (updatedDocument: Document) => void;
    deleteDocument: (documentId: number) => void;
}

const DocumentContext = createContext<DocumentContextProps | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [token, setToken] = useState<string | null>(null);

    const fetchDocuments = useCallback(async () => {
        if (token) {
            const storedDocuments = localStorage.getItem('documents');
            if (storedDocuments) {
                setDocuments(JSON.parse(storedDocuments));
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/documents`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setDocuments(data.data);
                localStorage.setItem('documents', JSON.stringify(data.data));
            }
        }
    }, [token]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        fetchDocuments();
    }, [fetchDocuments]);

    const addDocument = (newDocument: Document) => {
        setDocuments(prevDocuments => {
            const updatedDocuments = [...prevDocuments, newDocument];
            localStorage.setItem('documents', JSON.stringify(updatedDocuments));
            return updatedDocuments;
        });
    };

    const updateDocument = (updatedDocument: Document) => {
        setDocuments(prevDocuments => {
            const updatedDocuments = prevDocuments.map(doc =>
                doc.ID_Documento === updatedDocument.ID_Documento ? updatedDocument : doc
            );
            localStorage.setItem('documents', JSON.stringify(updatedDocuments));
            return updatedDocuments;
        });
    };

    const deleteDocument = (documentId: number) => {
        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                setDocuments(prevDocuments => {
                    const updatedDocuments = prevDocuments.filter(doc => doc.ID_Documento !== documentId);
                    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
                    return updatedDocuments;
                });
            }).catch(err => console.error(err));
        }
    };

    return (
        <DocumentContext.Provider
            value={{
                documents,
                fetchDocuments,
                addDocument,
                updateDocument,
                deleteDocument,
            }}
        >
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocumentContext = () => {
    const context = useContext(DocumentContext);
    if (!context) {
        throw new Error('useDocumentContext debe ser usado dentro de un DocumentProvider');
    }
    return context;
};