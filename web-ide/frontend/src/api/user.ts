import { UpdateUserRequest, UpdateUserResponse } from '../types/api';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export const updateUser = async (body: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const res = await fetchWithAuth(`/api/v1/users/me`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('회원 정보 수정 실패');
  return res.json();
};
