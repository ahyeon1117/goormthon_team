import { apiRequest } from './client';
import { AxiosError } from 'axios';

// 인증 API 엔드포인트
const AUTH_API = {
  SIGNUP: '/api/v1/auth/join', // 회원가입 API 엔드포인트
};

// 회원가입 응답 타입
interface SignupResponse {
  success: boolean;
  message?: string;
}

/**
 * 회원가입 함수
 */
export const signup = async (userId: string, password: string, nickname: string): Promise<SignupResponse> => {
  try {
    // 회원가입 요청
    const response = await apiRequest.post<string>(AUTH_API.SIGNUP, {
      userId: userId,
      password,
      nickname: nickname, // 닉네임도 요청 본문에 포함
    });

    // 응답이 정상적으로 온 경우
    if (response.data.code === 200) {
      return {
        success: true,
        message: "회원가입이 완료되었습니다."
      };
    }

    // 응답 코드가 200이지만 오류가 있는 경우
    return {
      success: false,
      message: response.data.msg || "회원가입 중 오류가 발생했습니다."
    };

  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // 서버에서 응답이 온 경우
      const status = axiosError.response.status;

      if (status === 400) {
        return {
          success: false,
          message: "잘못된 요청입니다. 입력 데이터를 확인해주세요."
        };
      } else if (status === 409) {
        return {
          success: false,
          message: "이미 존재하는 아이디입니다."
        };
      }
    } else if (axiosError.request) {
      // 요청은 보냈으나 응답이 없는 경우
      return {
        success: false,
        message: "서버와 통신 중 오류가 발생했습니다."
      };
    }

    // 기타 오류
    return {
      success: false,
      message: "회원가입 요청 중 오류가 발생했습니다."
    };
  }
};
