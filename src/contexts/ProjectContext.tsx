"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '@/types/Project';

interface ProjectContextProps {
    projects: Project[] | null;
    setProjects: React.Dispatch<React.SetStateAction<Project[] | null>>;
    project: Project | null;
    fetchProjects: () => Promise<void>;
    fetchProject: (projectId: number) => Promise<void>;
    createProject: (projectData: FormData) => Promise<void>;
    updateProject: (projectId: number, projectData: FormData) => Promise<void>;
    deleteProject: (projectId: number) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    return token;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [projectsCache, setProjectsCache] = useState<Map<number, Project>>(new Map()); // Caché para proyectos individuales

    const fetchProjects = async () => {
        if (projects && projects.length > 0) {
            console.log('Using cached projects');
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/projects`, {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los proyectos');
            }
            const data = await response.json();
            setProjects(data.data);
            // Actualizar la caché con los proyectos obtenidos
            const newCache = new Map<number, Project>();
            data.data.forEach((project: Project) => newCache.set(project.ID_Proyecto, project));
            setProjectsCache(newCache);
        } catch (error) {
            console.error('Error al obtener los proyectos:', error);
        }
    };

    const fetchProject = async (projectId: number) => {
        if (projectsCache.has(projectId)) {
            console.log('Using cached project:', projectId);
            setProject(projectsCache.get(projectId) || null);
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/projects/${projectId}`, {
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los datos del proyecto');
            }
            const data = await response.json();
            setProject(data.data);
            // Actualizar la caché con el proyecto obtenido
            setProjectsCache(prevCache => new Map(prevCache).set(projectId, data.data));
        } catch (error) {
            console.error('Error al obtener los datos del proyecto:', error);
        }
    };

    const createProject = async (projectData: FormData) => {
        for (let [key, value] of projectData.entries()) { console.log(key, value); }
    
        try {
            const response = await fetch(`${backendUrl}/projects`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`
                },
                body: projectData,
            });
            if (!response.ok) {
                throw new Error('Error al crear el proyecto');
            }
            const data = await response.json();
            setProject(data.data);
            setProjects((prevProjects) => prevProjects ? [...prevProjects, data.data] : [data.data]); // Agregar el nuevo proyecto a la lista existente
            console.log("SAVE", data.data);
            fetchProjects(); // Actualizar la lista de proyectos
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
        }
    };    

    const updateProject = async (projectId: number, projectData: FormData) => {
        try {
            const response = await fetch(`${backendUrl}/projects/${projectId}`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`,
                    "X-HTTP-Method-Override": "PUT"
                },
                body: projectData,
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el proyecto');
            }
            const data = await response.json();
            setProject(data.data);
            setProjects((prevProjects) => prevProjects ? prevProjects.map(project => project.ID_Proyecto === projectId ? data.data : project) : [data.data]); // Actualizar el proyecto en la lista existente
            fetchProjects(); // Actualizar la lista de proyectos
            // Actualizar la caché con el proyecto actualizado
            setProjectsCache(prevCache => new Map(prevCache).set(projectId, data.data));
        } catch (error) {
            console.error('Error al actualizar el proyecto:', error);
        }
    };    

    const deleteProject = async (projectId: number) => {
        try {
            const response = await fetch(`${backendUrl}/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${getAuthToken()}`
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el proyecto');
            }
            setProjects(projects => projects ? projects.filter(project => project.ID_Proyecto !== projectId) : null);
            setProject(null);
            // Actualizar la caché eliminando el proyecto
            setProjectsCache(prevCache => {
                const newCache = new Map(prevCache);
                newCache.delete(projectId);
                return newCache;
            });
        } catch (error) {
            console.error('Error al eliminar el proyecto:', error);
        }
    };

    return (
        <ProjectContext.Provider value={{ projects, setProjects, project, fetchProjects, fetchProject, createProject, updateProject, deleteProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};