import { Project } from '../contexts/ProjectContextType';
import { ProjectCreateResponse, CreateProjectRequest } from '../types/api';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { ApiResponse } from '../types/api';

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetchWithAuth(`/api/v1/projects`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('프로젝트 목록 조회 실패');
  return res.json();
};

export const createProject = async (body: CreateProjectRequest): Promise<ProjectCreateResponse> => {
  const res = await fetchWithAuth(`/api/v1/projects`, {
    method: 'POST',

    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('프로젝트 생성 실패');

  const response: ProjectCreateResponse = await res.json();

  return response;
};

export const deleteProject = async (projectId: number): Promise<void> => {
  const res = await fetchWithAuth(`/api/v1/projects/${projectId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('프로젝트 삭제 실패');
};

export const updateProjectName = async (projectId: number, newName: string): Promise<void> => {
  const res = await fetchWithAuth(`/api/v1/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: newName }),
  });

  if (!res.ok) throw new Error('프로젝트 이름 변경 실패');
};

// 프로젝트 멤버 추가
export const addProjectMember = async (projectId: number, newUserEmail: string): Promise<ApiResponse<void>> => {
  const res = await fetchWithAuth(`/api/v1/projects/${projectId}/members`, {
    method: 'POST',
    body: JSON.stringify({ email: newUserEmail }),
  });
  
  // 응답 상태 확인 및 에러 처리
  if (!res.ok) {
    const errorData = await res.json();
    throw {
      status: res.status,
      message: errorData.message,
      code: errorData.code
    };
  }
  
  return res.json();
};

// 특정 프로젝트 조회
export const fetchProject = async (projectId: number): Promise<ApiResponse<Project>> => {
  const res = await fetchWithAuth(`/api/v1/projects/${projectId}`, {
    method: 'GET',
  });
  
  if (!res.ok) throw new Error('프로젝트 조회 실패');
  return res.json();
};