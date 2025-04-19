import { useState } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import ChatModal from './ChatModal';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false); // 렌더링 여부
  const [isChatVisible, setIsChatVisible] = useState(false); // 애니메이션 표시 여부

  const openChat = () => {
    setIsOpen(true);
    setTimeout(() => setIsChatVisible(true), 10);
  };

  const closeChat = () => {
    setIsChatVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <>
      <button
        onClick={isOpen ? closeChat : openChat}
        className="fixed bottom-10 right-10 text-dashboard-gray hover:text-white text-4xl"
        aria-label="Chat"
      >
        {isOpen ? <FiX /> : <FiMessageCircle />}
      </button>

      {isOpen && <ChatModal isVisible={isChatVisible} onClose={closeChat} />}
    </>
  );
};

export default ChatButton;
