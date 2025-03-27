import { useAuthStore } from '../store/authStore';

/**
 * 인증 관련 기능과 상태를 제공하는 커스텀 훅
 */
export function useAuth() {
  const {
    token,
    isAuthenticated,
    userId,
    login,
    logout,
    setToken,
    setUser
  } = useAuthStore();

  /**
   * 사용자가 인증되었는지 확인하는 함수
   */
  const checkAuth = (): boolean => {
    return isAuthenticated && !!token;
  };

  return {
    // 상태
    token,
    isAuthenticated,
    userId,

    // 액션
    login,
    logout,
    setToken,
    setUser,

    // 유틸리티
    checkAuth,
  };
}
