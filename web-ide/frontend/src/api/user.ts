import { UpdateUserRequest, UpdateUserResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export const updateUser = async (body: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('회원 정보 수정 실패');
  return res.json();
};
