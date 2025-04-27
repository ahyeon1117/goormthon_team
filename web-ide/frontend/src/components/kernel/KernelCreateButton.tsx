import { useState } from 'react';
import { useKernel } from '../../hooks/useKernel';


const KernelCreateButton = () => {
  const { handleCreateKernel } = useKernel();
  const [isConnected, setIsConnected] = useState(false);

  const handleClick = async () => {
    try {
      const kernel = await handleCreateKernel();
      setIsConnected(true); 
      alert('커널 생성 완료');
      console.log(kernel);
    } catch {
      alert('커널 생성 실패');
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={`hover:text-white ${isConnected ? 'text-blue-500' : 'text-dashboard-gray'}`}
    >
      연결
    </button>
  );
};

export default KernelCreateButton;
