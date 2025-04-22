export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  // createdAt: string;
  // updatedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
