import { Navigate } from 'react-router-dom';

const RouterGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('로그인이 필요합니다');
    return <Navigate to="/login" />;
  }

  return children;
};

export default RouterGuard;
