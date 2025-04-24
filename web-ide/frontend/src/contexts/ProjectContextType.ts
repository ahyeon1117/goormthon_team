import { createContext } from 'react';

export type Project = {
  projectId: number;
  name: string;
  ownerId: number;
};

export type ProjectContextType = {
  projects: Project[];
  createProject: (name: string) => void;
  deleteProject: (projectId: number) => void;
  updateProjectName: (projectId: number, name: string) => void;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);
