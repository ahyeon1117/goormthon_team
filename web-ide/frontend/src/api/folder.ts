import { FolderNode } from '../types/file';

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

export const createFolder = async ({
  folderName,
  projectId,
  parentId,
}: {
  folderName: string;
  projectId: number;
  parentId?: number;
}) => {
  const res = await fetch(`${BASE_URL}/api/v1/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ folderName, projectId, parentId }),
  });
  if (!res.ok) throw new Error('폴더 생성 실패');
  return res.json();
};

export const updateFolderName = async ({
  folderId,
  projectId,
  newName,
}: {
  folderId: number;
  projectId: number;
  newName: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/v1/folders`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ folderId, projectId, newName }),
  });

  if (!res.ok) throw new Error('폴더 이름 변경 실패');
  return res.json();
};

export const deleteFolder = async ({
  folderId,
  folderName,
  parentId,
  projectId,
}: {
  folderId: number;
  folderName: string;
  parentId?: number;
  projectId: number;
}) => {
  const res = await fetch(`${BASE_URL}/api/v1/folders`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ folderId, folderName, parentId, projectId }),
  });
  if (!res.ok) throw new Error('폴더 삭제 실패');
};
