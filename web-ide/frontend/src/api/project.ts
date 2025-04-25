import { Project } from '../contexts/ProjectContextType';
import { ProjectCreateResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${BASE_URL}/api/v1/projects`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('프로젝트 목록 조회 실패');
  return res.json();
};

export const createProject = async (name: string): Promise<ProjectCreateResponse> => {
  const res = await fetch(`${BASE_URL}/api/v1/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error('프로젝트 생성 실패');

  const response: ProjectCreateResponse = await res.json();

  return response;
};

export const deleteProject = async (projectId: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/v1/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('프로젝트 삭제 실패');
};

export const updateProjectName = async (projectId: number, newName: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/v1/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: newName }),
  });

  if (!res.ok) throw new Error('프로젝트 이름 변경 실패');
};
