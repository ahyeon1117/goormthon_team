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
  username: string;
}

export interface SingupResponse {
  id: number;
  username: string;
  email: string;
}

export interface ProjectCreateResponse {
  projectId: number; // camelCase가 왜 아닐까?
  name: string;
  ownerId: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
