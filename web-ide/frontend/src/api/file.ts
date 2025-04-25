import { CreateFileRequest, FileResponse, UpdateFileNameRequest } from '../types/api';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export const createFile = async (body: CreateFileRequest): Promise<FileResponse> => {
  const res = await fetchWithAuth(`/api/v1/files`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('파일 생성 실패');
  return res.json();
};

export const updateFileName = async (body: UpdateFileNameRequest): Promise<void> => {
  const res = await fetchWithAuth(`/api/v1/files/rename`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('파일 이름 변경 실패');
};

export const deleteFile = async (fileId: number): Promise<void> => {
  const res = await fetchWithAuth(`/api/v1/files/${fileId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('파일 삭제 실패');
};
