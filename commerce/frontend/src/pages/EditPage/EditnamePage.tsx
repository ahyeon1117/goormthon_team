import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateNickname, getCurrentUserInfo, UserInfoResponse } from '../../api/userApi';
import * as S from './EditPage.styled';

const EditnamePage = () => {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      const data = await getCurrentUserInfo();
      if (data) {
        setUserInfo(data);
        setNickname(data.nickname); // 기존 닉네임을 기본값으로 설정
      }
    };
    fetchUserInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedUser = await updateNickname(nickname);
      if (updatedUser) {
        alert('닉네임이 성공적으로 변경되었습니다.');
        await getCurrentUserInfo(true); // 사용자 정보 갱신
        navigate('/');
      }
    } catch (error) {
      console.error('닉네임 변경 중 오류 발생:', error);
      alert('닉네임 변경에 실패했습니다.');
    }
  };

  return (
    <S.EditContainer>
      <S.EditForm onSubmit={handleSubmit}>
        <S.Title>회원정보 수정</S.Title>
        <S.FormGroup>
          {userInfo && <p>아이디: {userInfo.userId}</p>}
          <S.Label htmlFor="nickname">새 닉네임</S.Label>
          <S.Input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={handleChange}
            required
          />
        </S.FormGroup>
        <S.Button type="submit">변경하기</S.Button>
      </S.EditForm>
    </S.EditContainer>
  );
};

export default EditnamePage;
