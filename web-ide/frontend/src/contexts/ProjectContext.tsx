import { useState, useEffect } from 'react';
import { Project, ProjectContext } from './ProjectContextType';
import {
  fetchProjects,
  createProject as createProjectAPI,
  deleteProject as deleteProjectAPI,
} from '../api/project';

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error('프로젝트 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (name: string) => {
    try {
      await createProjectAPI(name);
      await loadProjects();
    } catch (err) {
      console.error('프로젝트 생성 실패:', err);
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      await deleteProjectAPI(projectId);
      await loadProjects();
    } catch (err) {
      console.error('프로젝트 삭제 실패:', err);
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, createProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
