import { KernelResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export const createKernel = async (): Promise<KernelResponse> => {
  const res = await fetch(`${BASE_URL}/api/v1/kernels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('커널 생성 실패');
  return res.json();
};
