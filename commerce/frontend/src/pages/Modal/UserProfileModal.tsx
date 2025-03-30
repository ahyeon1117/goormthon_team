import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCurrentUserInfo, UserInfoResponse } from '../../api/userApi'; // 필요한 API import
import { logout } from '../../api/authApi'; // 로그아웃 API import
import { useNavigate } from 'react-router-dom'; // 회원정보 수정 페이지로 이동하기 위한 react-router-dom 사용

// 타입 정의
interface MemberInfoModalProps {
  showModal: boolean;
  onClose: () => void;
  isFixedHeader?: boolean; // FixedHeader에서 호출 시 true
}

const ModalBackground = styled.div<{ $show: boolean; $top: string }>`
  position: fixed;
  right: 150px;
  top: ${props => props.$top};
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 모달을 다른 모든 요소 위에 표시 */
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  //right: -20px; /* 오른쪽으로 더 밀어냄 */
  //transform: translateX(20px); /* 추가 이동 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background: #442D4A;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  float: right;

  &:hover {
    background: #2E1E33;
  }
  &:focus {
    outline: none;
  }

`;

const ActionButton = styled.button`
  background: #E896FF;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background: #D95CFBFF;
  }
  &:focus {
    outline: none;
  }

`;

const MemberInfoModal: React.FC<MemberInfoModalProps> = ({ showModal, onClose, isFixedHeader }) => {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // 회원정보 수정 페이지로 이동할 때 사용
  const topPosition = isFixedHeader ? '60px' : '160px';

  // 모달이 열릴 때 사용자 정보를 가져오는 함수
  useEffect(() => {
    if (showModal) {
      // 사용자 정보 조회
      const fetchUserInfo = async () => {
        const data = await getCurrentUserInfo(true); // store에 저장하도록 true 설정
        setUserInfo(data);
        setLoading(false);
      };

      fetchUserInfo();
    }
  }, [showModal]);

  // 로그아웃 함수
  const handleLogout = () => {
    logout(); // 로그아웃 API 호출
    onClose(); // 모달 닫기
  };

  // 회원정보 수정 페이지로 이동 함수
  const handleEditInfo = () => {
    navigate('/edit'); // '/edit-profile' 페이지로 이동 (라우팅 경로에 맞게 수정)
    onClose(); // 모달 닫기
  };

  return (
    <ModalBackground $show={Boolean(showModal)} $top={topPosition}>
      <ModalContainer>
        <CloseButton onClick={onClose}>X</CloseButton>
        <h2>회원 정보</h2>
        {loading ? (
          <p>회원 정보를 불러오는 중...</p>
        ) : (
          userInfo ? (
            <div>
              <p>닉네임: {userInfo.nickname}</p>
              <p>아이디: {userInfo.userId}</p>
              <p>등급: {userInfo.role}</p>
            </div>
          ) : (
            <p>회원 정보를 불러오지 못했습니다.</p>
          )
        )}

        <ActionButton onClick={handleEditInfo}>회원정보 수정</ActionButton>
        <ActionButton onClick={handleLogout} style={{ background: '#442D4A' }}>
          로그아웃
        </ActionButton>
      </ModalContainer>
    </ModalBackground>
  );
};

export default MemberInfoModal;
