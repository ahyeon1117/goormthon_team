import { SignupRequest, LoginRequest, ApiResponse, LoginResponse, User } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (body: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('로그인 실패');

  return res.json();
};

export const signup = async (body: SignupRequest): Promise<ApiResponse<User>> => {
  const res = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('회원가입 실패');

  return res.json();
};

export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) return;

  await fetch(`${BASE_URL}/api/v1/auth/logout`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  });
  localStorage.removeItem('token');
};
