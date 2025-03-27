import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 인증된 사용자만 접근할 수 있는 라우트 컴포넌트
 * 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Zustand 스토어에서 인증 상태를 가져옵니다
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // 로그인 페이지로 리다이렉트하면서 원래 가려던 경로를 state로 전달
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
