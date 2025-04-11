import { FiMessageCircle } from 'react-icons/fi';

const ChatButton = () => (
  <button
    className="fixed bottom-10 right-10 text-dashboard-gray hover:text-white text-4xl"
    aria-label="Chat"
  >
    <FiMessageCircle />
  </button>
);

export default ChatButton;
