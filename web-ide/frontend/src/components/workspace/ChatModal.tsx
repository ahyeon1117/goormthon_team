import { useEffect, useRef, useState } from "react";
import { FiSearch, FiUsers, FiX, FiUser } from "react-icons/fi";
import { Client } from "@stomp/stompjs";
import { fetchChatRoom, fetchChatHistory } from '../../api/chat';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  projectId: string | null;
};

const users = ["이구름", "김구름", "최구름"]; // ✅✅✅✅✅✅

// 서버에서 받은 메시지 타입
interface ChatMessageDTO {
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
}

// 날짜별로 그룹화된 메시지 타입
interface MessagesByDate {
  date: string;
  messages: ChatMessageDTO[];
}

const ChatModal = ({ isVisible, onClose, projectId }: Props) => {
  const [showUserList, setShowUserList] = useState(false);

  // 사용자 정보
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  // 채팅방 정보
  const [roomId, setRoomId] = useState<number | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  // 채팅 기능 관련 정보
  const stompClientRef = useRef<Client | null>(null);             // STOMP 클라이언트 인스턴스를 전역 관리
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]); // 채팅 메시지 목록
  const [inputMessage, setInputMessage] = useState("");           // 입력 메시지
  const chatBoxRef = useRef<HTMLDivElement>(null);                // 채팅창 참조
  const isComposingRef = useRef<boolean>(false);                  // 한글 입력 중인지 여부 (한글 입력기 조합 중 이벤트 중복 방지)

  useEffect(() => {
    if (!isVisible) return;
    
    const init = async () => {
      // 이미 연결되어 있다면 다시 연결하지 않음
      if (stompClientRef.current && stompClientRef.current.connected) {
        console.log("[UseEffect] [WebSocket] [연결] 이미 연결되어 있음");
        return;
      }
      
      // 1. 토큰, 유저 정보 가져오기
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      
      if (userId) setCurrentUserId(Number(userId));
      if (username) setCurrentUserName(username);
      
      if (!token || !userId) {
        console.log("[UseEffect] [토큰, 유저 정보] 토큰이 없거나 유저 정보가 없습니다");
        return;
      }
      
      // 2. 채팅방 정보 조회 (await로 완료될 때까지 기다림)
      // 3. getChatRoom 함수 호출 후 - 웹소켓 연결 및 구독 시작 (roomId가 설정된 후에 실행)
      await getChatRoom();
    };
    
    init();
    
    // 4. 컴포넌트가 언마운트 될 때 웹소켓 연결 해제
    return () => {
      console.log("[UseEffect] [WebSocket] 연결 해제");
      if (stompClientRef.current?.active) {
        stompClientRef.current.deactivate();
      }
    };
  }, [isVisible]);

  // [채팅방 조회 함수]
  const getChatRoom = async () => {
    try {
      if (!projectId) {
        console.error("[채팅방] [조회] 프로젝트 ID 없음");
        return;
      }

      // 채팅방 정보 조회 API 호출
      const result = await fetchChatRoom(Number(projectId));
      console.log("[채팅방] [조회] 성공:", result);
      
      // 채팅방 정보 설정
      setRoomId(result.id);
      setRoomName(result.name);
      
      // 채팅 내역 조회
      await getChatHistory(result.id);

      // 웹소켓 연결
      connectWebsocket(result.id);

    } catch (error) {
      console.error("[채팅방] [조회] 실패:", error);
      onClose();
    }
  };

  // [채팅 내역 조회 함수]
  const getChatHistory = async (chatRoomId: number) => {
    try {
      // 채팅 내역 조회 API 호출
      const messages = await fetchChatHistory(chatRoomId);
      console.log("[채팅] [내역] 조회 성공:", messages);
      
      // 메시지 목록 상태 업데이트
      setMessages(messages);
      
      // 채팅창 맨 아래로 스크롤
      scrollToBottom();
    } catch (error) {
      console.error("[채팅] [내역] 조회 실패:", error);
    }
  };

  // [WebSocket 연결 및 구독 함수]
  const connectWebsocket = (roomId: number) => {
    console.log("WebSocket] [연결] 시도 중");

    const token = localStorage.getItem("token");
    console.log("[WebSocket] [토큰] 웹소켓 연결에 사용할 토큰 조회 :", token);

    // 토큰이 없으면 연결 시도하지 않음
    if (!token) {
      console.error("[WebSocket] [연결] 토큰이 없어 연결할 수 없음");
      return;
    }
    // 유효한 JWT 토큰 형식인지 확인 (헤더.페이로드.서명 형식)
    if (!token.includes('.') || token.split('.').length !== 3) {
      console.error("[WebSocket] [토큰] 유효하지 않은 JWT 형식");
      return;
    }

    // 1. 웹소켓 요청 객체 생성
    const client = new Client({
      // brokerURL: "ws://localhost:8080/ws-chat", // WebSocket 주소
      brokerURL: import.meta.env.VITE_WEBSOCKET_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000, // 5초마다 재연결 시도

      debug: function (str) {
        console.log("[STOMP] [디버그]:", str);
      },

      // 2. 연결 성공 시 콜백 함수 호출
      // 연결 성공 시 onConnect 콜백 함수 호출
      // - 구독(subscribe): 앞으로 발생할 메시지를 구독하는 것(서버한테 메시지를 나한테도 보내달라고 등록하는 것) -> 구독 주소: /topic/${roomId}
      // - 발행(publish): 메시지를 발행하는 것(서버에게 메시지를 보내는 것) -> 발행 주소: /app/chat/send
      // -> 실제로 메시지를 publish(발행)해야 구독 중인 클라이언트에게 메시지를 전달하게 됨
      onConnect: () => {
        console.log("[WebSocket] [연결] 성공");

        // 3. 구독 시작
        client.subscribe(`/topic/${roomId}`, (message) => {
          console.log("[메시지] [수신]:", message);
          
          const parsedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, parsedMessage]); // 메시지 추가
          scrollToBottom();
        },
        {
          Authorization: `Bearer ${token}`, // 구독 요청 시 토큰 포함
        });
      },
      onStompError: (frame) => {
        console.error('[STOMP] [에러]:', frame);
      },
      onWebSocketError: (event) => {
        console.error('[STOMP] [웹소켓 에러] 에러:', event);
      }
    });

    // 3. 연결 시작
    client.activate();
    stompClientRef.current = client; // 클라이언트를 전역 변수에 저장
  };

  // [메시지 전송 함수]
  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    // 1. 연결 상태 확인
    if (!stompClientRef.current?.connected) {
      console.log("[메시지] 연결이 끊어져 메시지를 보낼 수 없습니다");
      alert("연결이 끊어졌습니다. 페이지를 새로고침해 주세요.");
      return;
    }

    // 2. 메시지 전송 전에 입력 값 저장 (중복 전송 방지)
    const messageToSend = inputMessage.trim();
    console.log("[메시지] [전송] 메시지 전송 시작, 보낼 메시지: ", messageToSend);
    setInputMessage(""); // 입력창 초기화

    // 3. 메시지 요청 객체 생성
    const messageRequest = {
      senderId: currentUserId || 0,
      senderName: currentUserName || "익명",
      message: messageToSend,
      timestamp: new Date().toISOString(),
    };
    console.log("[메시지] [객체] 메시지 요청 객체 생성: ", messageRequest);

    // 4. 메시지 발행 요청
    stompClientRef.current?.publish({
      destination: `/publish/${roomId}`, // 메시지 발행 경로
      body: JSON.stringify(messageRequest), // 메시지 객체 직렬화
    });

    console.log("[메시지] [전송] 완료:", messageToSend, "경로:", `/publish/${roomId}`);
  };

  // [채팅창 자동 스크롤 함수] (채팅창 맨 아래로 스크롤)
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100); // DOM 렌더링 완료 후 수행
  };

  // [메시지를 날짜별로 그룹화하는 함수]
  const groupMessagesByDate = (): MessagesByDate[] => {
    // 메시지 날짜별로 그룹화
    const groupedMessages: { [date: string]: ChatMessageDTO[] } = {};
    
    messages.forEach(msg => {
      // 메시지 타임스탬프에서 날짜 추출 (현지 시간 기준)
      const timestamp = msg.timestamp.includes('Z') ? msg.timestamp : msg.timestamp + 'Z';
      const date = new Date(timestamp);
      
      // 현지 시간 기준으로 YYYY-MM-DD 형식 생성
      const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // 해당 날짜 그룹이 없으면 생성
      if (!groupedMessages[localDate]) {
        groupedMessages[localDate] = [];
      }
      
      // 그룹에 메시지 추가
      groupedMessages[localDate].push(msg);
    });
    
    // 날짜별로 정렬된 배열로 변환
    return Object.keys(groupedMessages)
      .sort() // 날짜 오름차순 정렬
      .map(date => ({
        date,
        messages: groupedMessages[date]
      }));
  };

  // [날짜를 한국어 형식으로 포맷팅하는 함수]
  const formatDateInKorean = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // [날짜별로 그룹화된 메시지 가져오기]
  const messagesByDate = groupMessagesByDate();

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
            <span>{roomName}</span>
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
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#4B5563 transparent',
          }}
        >
          {/* 날짜별로 그룹화된 메시지 표시 */}
          {messagesByDate.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {/* 날짜 표시 (가운데 정렬) */}
              <div className="text-xs text-dashboard-gray mb-4 flex justify-center items-center">
                <div className="px-4 py-1 rounded-full bg-dashboard-gray/20">
                  {formatDateInKorean(group.date)}
                </div>
              </div>

              {/* 해당 날짜의 메시지 목록 */}
              {group.messages.map((msg, msgIndex) => {
                // 현재 로그인한 사용자와 메시지 발신자 비교
                const isMyMessage = msg.senderId === currentUserId;

                return (
                  <div
                    key={msgIndex}
                    className={`mb-4 ${isMyMessage ? 'text-right' : ''}`}
                  >
                    {/* 상대방 이름 */}
                    {!isMyMessage && (
                      <p className="font-bold flex items-center gap-2">
                        <FiUser /> {msg.senderName}
                      </p>
                    )}
                    {/* 메시지 및 시간 */}
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
                        {new Date(
                          msg.timestamp.includes('Z') ? msg.timestamp : msg.timestamp + 'Z'
                        ).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-3">
          <input
            type="text"
            className="w-full bg-background text-white px-3 py-2 text-sm rounded-lg"
            placeholder="메시지를 입력해주세요."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onCompositionStart={() => isComposingRef.current = true}   // 한글 조합 시작
            onCompositionEnd={() => isComposingRef.current = false}    // 한글 조합 끝
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isComposingRef.current) {
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