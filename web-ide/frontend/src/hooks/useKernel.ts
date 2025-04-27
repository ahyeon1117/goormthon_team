import { useState } from 'react';
import { createKernel } from '../api/kernel';
import { useFile } from '../contexts/FileContext'; // FileContext에서 useFile 가져오기

export function useKernel() {
  const [loading, setLoading] = useState(false);
  const { setKernelId } = useFile();  // FileContext에서 setKernelId를 가져온다

  const handleCreateKernel = async () => {
    try {
      setLoading(true);
      const kernel = await createKernel();
      setKernelId(kernel.id);  // 커널 ID를 FileContext에 설정
      console.log('커널 생성 완료:', kernel);
      return kernel;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateKernel, loading };
}
