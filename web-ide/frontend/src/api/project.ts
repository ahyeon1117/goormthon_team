const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');
console.log(token);

export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('프로젝트 목록 조회 실패');
  return res.json();
};

export const createProject = async (name: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/projects?name=${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('프로젝트 생성 실패');
};
