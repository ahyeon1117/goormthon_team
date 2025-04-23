import { useState, useEffect } from 'react';
import { Project, ProjectContext } from './ProjectContextType';
import { fetchProjects, createProject as createProjectAPI } from '../api/project';

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      console.error('프로젝트 불러오기 실패:', e);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (name: string) => {
    try {
      await createProjectAPI(name);
      await loadProjects();
    } catch (e) {
      console.error('프로젝트 생성 실패:', e);
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, createProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
