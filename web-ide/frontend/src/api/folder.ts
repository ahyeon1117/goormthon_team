import { FolderNode } from '../types/file';
import { CreateFolderRequest, UpdateFolderNameRequest, DeleteFolderRequest } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export const fetchFolderTree = async (projectId: number): Promise<FolderNode> => {
  const res = await fetch(`${BASE_URL}/api/v1/folders/tree/${projectId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('폴더 목록 조회 실패');
  return res.json();
};

export const createFolder = async (body: CreateFolderRequest): Promise<FolderNode> => {
  const res = await fetch(`${BASE_URL}/api/v1/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('폴더 생성 실패');
  return res.json();
};

export const updateFolderName = async (body: UpdateFolderNameRequest): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/v1/folders`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('폴더 이름 변경 실패');
  return res.json();
};

export const deleteFolder = async (body: DeleteFolderRequest): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/v1/folders`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('폴더 삭제 실패');
};
