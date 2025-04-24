import { useState } from 'react';
import { updateUser } from '../api/user';
import { UpdateUserRequest } from '../types/api';

export function useUser() {
  const [loading, setLoading] = useState(false);

  const handleUpdateUser = async (body: UpdateUserRequest) => {
    try {
      console.log('body', body);
      setLoading(true);
      const res = await updateUser(body);
      console.log('회원정보 수정 성공:', res);
      alert('회원정보가 수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('회원정보 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateUser, loading };
}
