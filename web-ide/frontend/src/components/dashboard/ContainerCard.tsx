import { FiEdit, FiX, FiUser, FiUsers, FiPlay } from 'react-icons/fi';

type Props = {
  isGroup?: boolean;
};

const ContainerCard = ({ isGroup = false }: Props) => (
  <div className="bg-dashboard-background p-4 border border-dashboard-gray rounded-lg flex flex-col h-72">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-white">Project Title</h3>
      <div className="flex gap-3 text-lg text-white">
        <button><FiEdit /></button>
        <button><FiX /></button>
      </div>
    </div>

    <div className="flex flex-col justify-between flex-grow">
      <p className="text-sm text-dashboard-gray mt-2">
        Language / {isGroup ? "그룹" : "개인"}
      </p>
      <div className="flex justify-between items-center text-sm text-dashboard-gray">
        <span>Updated X ago</span>
        <span className="text-lg text-white">
          {isGroup ? <FiUsers /> : <FiUser />}
        </span>
      </div>
    </div>

    <div className="mt-4">
      <button className="w-full bg-btn-primary hover:bg-primary-hover text-white py-2 rounded-lg flex justify-center items-center text-sm gap-3 border border-white/20">
        <FiPlay />
        실행
      </button>
    </div>
  </div>
);

export default ContainerCard;
