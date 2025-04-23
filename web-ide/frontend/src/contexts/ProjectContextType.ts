import { createContext } from 'react';

export type Project = {
  id: number;
  name: string;
  isGroup: boolean;
  updatedAt: string;
};

export type ProjectContextType = {
  projects: Project[];
  createProject: (name: string) => void;
};

export const ProjectContext = createContext<ProjectContextType | null>(null);
