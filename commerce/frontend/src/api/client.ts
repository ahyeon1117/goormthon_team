import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/apiTypes';
import { useAuthStore } from '../store/authStore';

// 백엔드 서버 기본 URL 설정
// const BASE_URL = 'http://localhost:8080';
// 프록시 설정을 사용하므로 상대 경로로 변경
const BASE_URL = '';

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업 (예: 토큰 추가)
    const authStore = useAuthStore.getState();
    const token = authStore.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error('API 에러:', error.response.data);
    } else if (error.request) {
      // 요청이 전송되었지만 응답이 없는 경우
      console.error('서버 응답 없음:', error.request);
    } else {
      // 요청 설정 중 에러가 발생한 경우
      console.error('요청 에러:', error.message);
    }
    return Promise.reject(error);
  }
);

// API 요청 함수
export const apiRequest = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.get<ApiResponse<T>>(url, config);
  },
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.post<ApiResponse<T>>(url, data, config);
  },
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.put<ApiResponse<T>>(url, data, config);
  },
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.delete<ApiResponse<T>>(url, config);
  },
};

export default apiClient;
