import { useEffect, useRef, useState } from "react";
import { FiSearch, FiUsers, FiX, FiUser } from "react-icons/fi";
import { Client } from "@stomp/stompjs";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const users = ["이구름", "김구름", "최구름"];

interface ChatMessageDTO {
  senderId: number;  // 서버에서 받은 발신자 ID
  senderName: string; // 서버에서 받은 발신자 이름
  message: string;
  timestamp: string;
}

const ChatModal = ({ isVisible, onClose }: Props) => {
  const [showUserList, setShowUserList] = useState(false);

  // 사용자 정보
  const [roomId, setRoomId] = useState("1"); // ✅✅✅✅✅✅✅✅✅ 수정 필요
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]); // 채팅 메시지 목록
  const [inputMessage, setInputMessage] = useState("");        // 입력 메시지
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null); // STOMP 클라이언트 인스턴스를 전역 관리
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 중인지 여부 (한급 입력기 조합 중 이벤트 중복 방지)

  useEffect(() => {
    if (!isVisible) return;

    // 이미 연결되어 있다면 다시 연결하지 않음
    if (stompClientRef.current && stompClientRef.current.connected) {
      console.log("이미 웹소켓 연결되어 있음");
      return;
    }

    // 사용자 정보 저장
    // 유저 식별자
    const userId = localStorage.getItem("userId");
    if (userId) setCurrentUserId(Number(userId));
    // 유저 이름
    const userName = localStorage.getItem("username");
    if (userName) setCurrentUserName(userName);

    // 웹소켓 연결 및 구독 시작
    connectWebsocket();

    // 컴포넌트가 언마운트 될 때 웹소켓 연결 해제
    return () => {
      console.log("WebSocket 연결 해제");
      // 웹소켓 연결 해제
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
    };
  }, [isVisible]);

  // 1. WebSocket 연결 및 구독 함수
  const connectWebsocket = () => {
    console.log("WebSocket 연결 시도");

    const token = localStorage.getItem("token");
    console.log("🔑 WebSocket 연결에 사용할 토큰:", token); // 토큰 확인 로그 
    console.log("🔑 WebSocket 연결에 사용할 userId:", currentUserId); // 토큰 확인 로그 

    // 토큰이 없으면 연결 시도하지 않음
    if (!token) {
      console.error("토큰이 없어 WebSocket 연결을 시도하지 않습니다.");
      return;
    }
    // 유효한 JWT 토큰 형식인지 확인 (헤더.페이로드.서명 형식)
    if (!token.includes('.') || token.split('.').length !== 3) {
      console.error("유효하지 않은 JWT 토큰 형식입니다.");
      return;
    }

    const client = new Client({
      // brokerURL: "ws://localhost:8080/ws-chat", // WebSocket 주소
      brokerURL: import.meta.env.VITE_WEBSOCKET_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000, // 5초마다 재연결 시도

      debug: function (str) {
        console.log("STOMP 디버그:", str);
      },

      // 연결 성공 시 onConnect 콜백 함수 호출
      onConnect: () => {
        console.log("WebSocket 연결 성공");

        // 2. 연결 완료 후 구독 시작
        // - 구독(subscribe): 앞으로 발생할 메시지를 구독하는 것(서버한테 메시지를 나한테도 보내달라고 등록하는 것) -> 구독 주소: /topic/${roomId}
        // - 발행(publish): 메시지를 발행하는 것(서버에게 메시지를 보내는 것) -> 발행 주소: /app/chat/send
        // -> 실제로 메시지를 publish(발행)해야 구독 중인 클라이언트에게 메시지를 전달하게 됨
        client.subscribe(`/topic/${roomId}`, (message) => {
          console.log("메시지 수신: ", message);
          // [섹션 5-4: 4] 메시지를 JSON으로 파싱
          const parsedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, parsedMessage]); // 메시지 추가
          scrollToBottom();
        },
        {
          Authorization: `Bearer ${token}`, // 구독 요청 시 토큰 푸함
        });
      },
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame);
      },
      onWebSocketError: (event) => {
        console.error('웹소켓 에러:', event);
      }
    });

    client.activate(); // 연결 시작
    stompClientRef.current = client; // 클라이언트를 전역 변수에 저장
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    // 연결 상태 확인 부분 추가
    if (!stompClientRef.current?.connected) {
      console.log("📤 메시지 전송 시도 - 연결이 끊어졌습니다. 재연결 시도...");
      connectWebsocket();
      return;
    }

    // 메시지 전송 전에 값 저장 (중복 전송 방지)
    const messageToSend = inputMessage.trim();
    console.log(`📤 메시지 전송 시작: "${messageToSend}"`);
    setInputMessage(""); // 입력창 초기화

    const messageRequest = {
      senderId: currentUserId || 0,
      senderName: currentUserName || "익명",
      message: messageToSend,
      timestamp: new Date().toISOString(),
    };

    // 메시지 발행 요청
    stompClientRef.current?.publish({
      destination: `/publish/${roomId}`, // 메시지 발행 경로
      body: JSON.stringify(messageRequest), // 메시지 객체 직렬화
    });

    console.log(`📤 메시지 전송 완료: "${messageToSend}" to /publish/${roomId}`);
  };

  // 채팅창 자동 스크롤 함수 (채팅창 맨 아래로 스크롤)
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100); // DOM 렌더링 완료 후 수행
  };

  return (
    <div
      className={`fixed bottom-20 right-10 h-[600px] rounded-lg z-50 flex bg-dashboard-background border border-white/20
        transition-all duration-300 ease-out overflow-hidden
        ${isVisible
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
              className={`cursor-pointer ${showUserList ? "text-btn-primary" : ""}`}
              onClick={() => setShowUserList(!showUserList)}
            />
            <FiX className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* Chat Content */}
        <div
          className="flex-1 p-4 text-white text-sm overflow-y-auto"
          ref={chatBoxRef}
        >
          <div className="text-xs text-dashboard-gray mb-2">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>

          {/* 메시지 목록 */}
          {messages.map((msg, index) => {
            // 현재 로그인한 사용자와 메시지 발신자 비교
            const isMyMessage = msg.senderId === currentUserId;

            return (
              <div
                key={index}
                className={`mb-4 ${isMyMessage ? 'text-right' : ''}`}
              >
                {/* 상대방 이름 */}
                {!isMyMessage && (
                  <p className="font-bold flex items-center gap-2">
                    <FiUser /> {msg.senderName}
                  </p>
                )}
                {/* 메시지와 시간을 같은 라인에 배치하되 시간은 아래쪽에 정렬 */}
                <div className={`flex items-end gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className={`py-2 px-3 rounded-lg mt-3 inline-block ${isMyMessage ? 'text-white' : 'bg-dashboard-gray/40'
                      }`}
                    style={isMyMessage ? { backgroundColor: '#458CFD' } : {}}
                  >
                    {msg.message}
                  </div>
                  {/* 공통 시간 */}
                  <span className="text-xs text-dashboard-gray self-end">
                    {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          {/* <div className="mb-4">
            <p className="font-bold flex items-center gap-2">
              <FiUser /> 이구름
              <span className="text-xs text-dashboard-gray ml-1">오후 4:16</span>
            </p>
            <div className="bg-dashboard-gray/40 py-2 px-3 rounded-lg mt-3 inline-block">
              안녕
            </div>
          </div> */}
        </div>

        {/* Message Input */}
        <div className="p-3">
          <input
            type="text"
            className="w-full bg-background text-white px-3 py-2 text-sm rounded-lg"
            placeholder="메시지를 입력해주세요."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}   // 한글 조합 시작
            onCompositionEnd={() => setIsComposing(false)}    // 한글 조합 끝
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isComposing) {
                sendMessage(); // 조합 중 아닐 때만 메시지 전송
              }
            }}
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