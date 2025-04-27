// src/api/notebook.ts
import { NotebookResponse, NotebookContent } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export const getNotebookContent = async (fileId: number): Promise<NotebookContent> => {
  const res = await fetch(`${BASE_URL}/api/v1/files/${fileId}`, {
    method: 'GET',
    headers: {
    //   'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('노트북 내용 로드 실패');
  
  const data: NotebookResponse = await res.json();
  
  // 이중 파싱 처리
  try {
    const firstParse = JSON.parse(data.notebookJson);
    if (typeof firstParse === 'string') {
      return JSON.parse(firstParse);
    }
    return firstParse;
  } catch (error) {
    console.error('Notebook JSON 파싱 실패:', error);
    throw error;
  }
};
  
  