import { useKernel } from '../../hooks/useKernel';

const KernelCreateButton = () => {
  const { handleCreateKernel } = useKernel();

  const handleClick = async () => {
    try {
      const kernel = await handleCreateKernel();
      alert('커널 생성 완료');
      console.log(kernel);
    } catch {
      alert('커널 생성 실패');
    }
  };

  return (
    <button onClick={handleClick} className="btn-primary">
      연결
    </button>
  );
};

export default KernelCreateButton;
