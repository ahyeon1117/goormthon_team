import { FiEdit, FiX, FiPlay } from 'react-icons/fi';
import { Project } from '../../contexts/ProjectContextType';
import { useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContextType';
import { useNavigate } from 'react-router-dom';

const ContainerCard = ({ project }: { project: Project }) => {
  const navigate = useNavigate();

  const handleRunClick = () => {
    navigate('/workspace');
  };

  const context = useContext(ProjectContext);
  if (!context) return null;

  const handleDelete = () => {
    if (confirm(`${project.name} 프로젝트를 삭제하시겠습니까?`)) {
      context.deleteProject(project.projectId);
    }
  };

  const handleRename = () => {
    const newName = prompt('새로운 프로젝트 이름을 입력하세요:', project.name);
    if (newName && newName.trim() !== '') {
      context.updateProjectName(project.projectId, newName);
    }
  };

  return (
    <div className="bg-dashboard-background p-4 border border-dashboard-gray rounded-lg flex flex-col h-72">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        <div className="flex gap-3 text-lg text-white">
          <button onClick={handleRename}>
            <FiEdit />
          </button>
          <button onClick={handleDelete}>
            <FiX />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-grow">
        <p className="text-sm text-dashboard-gray mt-2">
          {/* Ownerusername / {project.isGroup ? '그룹' : '개인'} */}
          {project.name}
        </p>
        <div className="flex justify-between items-center text-sm text-dashboard-gray">
          {/* <span>{project.updatedAt}</span> */}
          {/* <span className="text-lg text-white">{project.isGroup ? <FiUsers /> : <FiUser />}</span> */}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleRunClick}
          className="w-full bg-btn-primary hover:bg-primary-hover text-white py-2 rounded-lg flex justify-center items-center text-sm gap-3 border border-white/20"
        >
          <FiPlay />
          실행
        </button>
      </div>
    </div>
  );
};

export default ContainerCard;
