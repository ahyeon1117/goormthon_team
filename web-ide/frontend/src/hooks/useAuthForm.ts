import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UseAuthFormProps<T> = {
  initialState: T;
  submitFn: (body: T) => Promise<any>;
  errorMessage?: string;
};

export function useAuthForm<T>({
  initialState,
  submitFn,
  errorMessage = '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
}: UseAuthFormProps<T>) {
  const [form, setForm] = useState<T>(initialState);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await submitFn(form);
      localStorage.setItem('token', res.data.accessToken);
      navigate('/');
    } catch (err: any) {
      if (err.status === 409) {
        alert('이미 존재하는 아이디입니다.');
      } else if (err.status === 500) {
        alert('서버 오류입니다.');
      } else {
        alert(errorMessage);
      }
    }
  };

  return { form, handleChange, handleSubmit };
}
