import { useState } from 'react';
import { createKernel } from '../api/kernel';

export function useKernel() {
  const [loading, setLoading] = useState(false);

  const handleCreateKernel = async () => {
    try {
      setLoading(true);
      const kernel = await createKernel();
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
