import { useUserStore } from '../store/userStore';

/**
 * 사용자 정보 관련 기능과 상태를 제공하는 커스텀 훅
 */
export function useUser() {
  const {
    userId,
    nickname,
    role,
    createdAt,
    updatedAt,
    setUserInfo,
    updateNickname,
    clearUserInfo,
    isAdmin
  } = useUserStore();

  /**
   * 사용자 정보가 있는지 확인하는 함수
   */
  const hasUserInfo = (): boolean => {
    return !!userId && !!nickname;
  };

  return {
    // 상태
    userId,
    nickname,
    role,
    createdAt,
    updatedAt,

    // 액션
    setUserInfo,
    updateNickname,
    clearUserInfo,

    // 유틸리티
    hasUserInfo,
    isAdmin,
  };
}
