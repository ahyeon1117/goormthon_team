import { FolderNode } from '../types/file';
import { CreateFolderRequest, UpdateFolderNameRequest, DeleteFolderRequest } from '../types/api';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export const fetchFolderTree = async (projectId: number): Promise<FolderNode> => {
  const res = await fetchWithAuth(`/api/v1/folders/tree/${projectId}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('폴더 목록 조회 실패');
  return res.json();
};

export const createFolder = async (body: CreateFolderRequest): Promise<FolderNode> => {
  const res = await fetchWithAuth(`/api/v1/folders`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('폴더 생성 실패');
  return res.json();
};

export const updateFolderName = async (body: UpdateFolderNameRequest): Promise<void> => {
  const res = await fetchWithAuth(`/api/v1/folders`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('폴더 이름 변경 실패');
  return res.json();
};

export const deleteFolder = async (body: DeleteFolderRequest): Promise<void> => {
  const res = await fetchWithAuth(`/api/v1/folders`, {
    method: 'DELETE',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('폴더 삭제 실패');
};
