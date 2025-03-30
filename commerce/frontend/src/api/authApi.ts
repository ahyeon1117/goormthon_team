import { apiRequest } from './client';
import { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { LoginResponse } from '../types/apiTypes';

// 인증 API 엔드포인트
const AUTH_API = {
  LOGIN: '/api/v1/auth/login',
  SIGNUP: '/api/v1/auth/join',
  LOGOUT: '/api/v1/auth/logout',
};

/**
 * 로그인 함수
 */
export const login = async (userId: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiRequest.post<string>(AUTH_API.LOGIN, {
      userId,
      password
    });

    // 백엔드 API 응답 구조 처리 (ApiResponse<String> 형식)
    if (response.data && response.data.data) {
      const token = response.data.data;

      // Zustand 스토어에 토큰과 사용자 ID 저장
      useAuthStore.getState().login(token, userId);

      return {
        token,
        success: true
      };
    }

    // 응답은 200이지만 내부 코드가 오류인 경우
    if (response.data.code && response.data.code !== 200) {
      if (response.data.code === 401) {
        return {
          token: '',
          success: false,
          message: "아이디 또는 비밀번호가 올바르지 않습니다"
        };
      }

      return {
        token: '',
        success: false,
        message: response.data.message || response.data.msg || "로그인 중 오류가 발생했습니다"
      };
    }

    // 기타 예상하지 못한 응답 형식
    return {
      token: '',
      success: false,
      message: "로그인 요청 중 오류가 발생했습니다"
    };

  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // 서버에서 응답이 온 경우
      const status = axiosError.response.status;

      if (status === 401) {
        return {
          token: '',
          success: false,
          message: "아이디 또는 비밀번호가 일치하지 않습니다"
        };
      } else if (status === 404) {
        return {
          token: '',
          success: false,
          message: "존재하지 않는 사용자입니다"
        };
      }
    } else if (axiosError.request) {
      // 요청은 보냈으나 응답이 없는 경우
      return {
        token: '',
        success: false,
        message: "서버와 통신 중 오류가 발생했습니다"
      };
    }

    // 기타 오류
    return {
      token: '',
      success: false,
      message: "로그인 요청 중 오류가 발생했습니다"
    };
  }
};

/**
 * 로그아웃 함수
 */
export const logout = (): void => {
  // Zustand 스토어에서 로그아웃 액션 호출
  useAuthStore.getState().logout();
};

/**
 * 현재 인증 상태 확인 함수
 */
export const checkAuthStatus = (): boolean => {
  const authState = useAuthStore.getState();
  return authState.isAuthenticated && !!authState.token;
};
