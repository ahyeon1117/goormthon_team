import {
  SignupRequest,
  LoginRequest,
  ApiResponse,
  LoginResponse,
  SingupResponse,
} from '../types/api';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export const login = async (body: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const res = await fetchWithAuth(`/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    auth: false,
  });

  return res.json();
};

export const signup = async (body: SignupRequest): Promise<ApiResponse<SingupResponse>> => {
  const res = await fetchWithAuth(`/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    auth: false,
  });

  return res.json();
};

export const logout = async (): Promise<void> => {
  await fetchWithAuth(`/api/v1/auth/logout`, {
    method: 'DELETE',
  });
  localStorage.removeItem('token');
};
