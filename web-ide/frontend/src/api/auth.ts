import { LoginRequest, ApiResponse, LoginResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (body: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if(!res.ok) throw new Error('로그인 실패');

  return res.json();
}