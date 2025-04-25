const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

interface FetchOptions extends RequestInit {
  auth?: boolean; // 추가: auth를 붙일지 말지 선택할 수 있게
}

export const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  const { auth = true, headers, ...restOptions } = options;

  const finalHeaders = auth ? { ...headers, ...getAuthHeaders() } : headers;

  const res = await fetch(`${BASE_URL}${url}`, {
    ...restOptions,
    headers: finalHeaders,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return res;
};
