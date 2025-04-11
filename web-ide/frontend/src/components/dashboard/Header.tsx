import { FiUser } from 'react-icons/fi';
import rocketIcon from '../../assets/rocket-icon.svg';

const Header = () => (
  <header className="flex justify-between items-center h-16 px-6">
    <div className="flex items-center gap-3 text-lg font-semibold">
      <span className="text-3xl text-dashboard-buttonPrimary">
        <img src={rocketIcon} alt="rocket icon" className="h-16 w-16" />
      </span>
      <span className="text-white">User Name / Project Type</span>
    </div>
    <div className="text-xl p-3">
      <FiUser />
    </div>
  </header>
);

export default Header;
