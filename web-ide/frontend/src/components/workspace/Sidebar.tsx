import {
  FiFileText, FiEdit, FiEye, FiPlay, FiHelpCircle, FiSettings,
} from 'react-icons/fi';

const Sidebar = () => (
  <div className="w-14 bg-dashboard-highlight border-r border-dashboard-gray/30 flex flex-col items-center py-4 gap-6 text-xl">
    <FiFileText />
    <FiEdit />
    <FiEye />
    <FiPlay />
    <FiHelpCircle />
    <FiSettings />
  </div>
);

export default Sidebar;
