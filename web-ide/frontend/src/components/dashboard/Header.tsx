import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import rocketIcon from '../../assets/rocket-icon.svg';
import Modal from '../../pages/ProfileModal';
import UserEditForm from '../user/UserEditForm';

const Header = () => {
  const username = localStorage.getItem('username');
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center h-16 px-6">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-3xl text-dashboard-buttonPrimary">
            <img src={rocketIcon} alt="rocket icon" className="h-16 w-16" />
          </span>
          <span className="text-white">{username}님의 Dashboard입니다</span>
        </div>
        <button onClick={() => setShowModal(true)} className="text-xl p-3 cursor-pointer">
          <FiUser />
        </button>
      </header>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <UserEditForm />
      </Modal>
    </>
  );
};

export default Header;
