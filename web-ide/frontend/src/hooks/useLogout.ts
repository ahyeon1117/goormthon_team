import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

export function useLogout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/');
      alert('로그아웃 되었습니다.');
    } catch (err) {
      console.error(err);
    }
  };

  return { token, handleLogout };
}
