export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
