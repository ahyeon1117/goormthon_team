import { useState } from "react";
import { FiSearch, FiUsers, FiX, FiUser } from "react-icons/fi";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const users = ["이구름", "김구름", "최구름"];

const ChatModal = ({ isVisible, onClose }: Props) => {
  const [showUserList, setShowUserList] = useState(false);

  return (
    <div
      className={`fixed bottom-20 right-10 h-[600px] rounded-lg z-50 flex bg-dashboard-background border border-white/20
        transition-all duration-300 ease-out overflow-hidden
        ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0 w-[500px]"
            : "opacity-0 scale-90 translate-y-4 w-[400px]"
        }
      `}
    >
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-white/20 text-white text-sm">
          <div>
            <span>컨테이너명</span>
            <span className="text-white/60 ml-2">2</span>
          </div>
          <div className="flex items-center gap-2">
            <FiSearch className="cursor-pointer" />
            <FiUsers
              className={`cursor-pointer ${
                showUserList ? "text-btn-primary" : ""
              }`}
              onClick={() => setShowUserList(!showUserList)}
            />
            <FiX className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-4 text-white text-sm overflow-y-auto">
          <div className="text-xs text-dashboard-gray mb-2">
            2025년 4월 16일 수요일
          </div>
          <div className="mb-4">
            <p className="font-bold flex items-center gap-2">
              <FiUser /> 이구름
              <span className="text-xs text-dashboard-gray ml-1">오후 4:16</span>
            </p>
            <div className="bg-dashboard-gray/40 py-2 px-3 rounded-lg mt-3 inline-block">
              안녕
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-3">
          <input
            type="text"
            className="w-full bg-background text-white px-3 py-2 text-sm rounded-lg"
            placeholder="메시지를 입력해주세요."
          />
        </div>
      </div>

      {/* UserList Slide */}
      <div
        className={`absolute top-12 right-0 w-[200px] h-full bg-background text-white text-sm border-l border-white/20 px-4 py-2
          transition-transform duration-300 ease-in-out
          ${showUserList ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <p className="my-2 text-xs text-white/60">유저 목록</p>
        {users.map((user, i) => (
          <div key={i} className="py-1 flex items-center gap-3">
            <FiUser />
            {user}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatModal;
