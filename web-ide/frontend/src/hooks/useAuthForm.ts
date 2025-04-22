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
  errorMessage = '다시 확인해 주세요',
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
    } catch (err) {
      console.error(err);
      alert(errorMessage);
    }
  };

  return { form, handleChange, handleSubmit };
}
