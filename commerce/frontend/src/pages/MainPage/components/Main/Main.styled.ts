import styled from 'styled-components';
import { AiOutlineMenu } from 'react-icons/ai';

// Main 컴포넌트 내 모든 컴포넌트를 감싸는 컨테이너
export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// List 컴포넌트
export const STList = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 80%;
  height: 100px;
`;

// 신상품 컴포넌트
export const STNewArrivals = styled.div`
  width: 58px;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: #442D4A;
  cursor: pointer;
`;

// 베스트 컴포넌트
export const STBestSellers = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  margin-left: 20px;
  margin-right: 45px;
  align-items: center;
  text-align: center;
  color: #442D4A;
  cursor: pointer;
`;


export const MenuIcon = styled(AiOutlineMenu)`
  color: #442D4A;  /* 아이콘 색상 */
  font-size: 24px;  /* 아이콘 크기 */
  margin-right: 12px;
  cursor: pointer;
`;

export const STMainBannerBox = styled.div`
  position: relative;
  width: 80%;
  height: 380px;
  margin: 0 auto; /* 화면 중앙 정렬 */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const STMainBannerA = styled.div`
  position: relative;
  width: calc(100% - 350px); /* STMainBannerB의 너비와 마진을 제외한 남은 공간 */
  height: 380px;
  margin: 0 auto; /* 화면 중앙 정렬 */
  display: flex;
  justify-content: space-between;
  border-radius: 20px;
  overflow: hidden;  /* 부모 요소에서 넘치는 부분을 숨기도록 설정 */
  align-items: center;
`;

export const ImageMove = styled.img<{ $isActive: boolean; index: number }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
    transition: transform 1s ease-in-out, opacity 1s ease-in-out;
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    transform: ${({ index, $isActive }) =>
    $isActive ? `translateX(0)` : `translateX(${index > 0 ? '100%' : '-100%'})`};
    display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};  // active 이미지만 보이게 함
`;

export const ButtonContainer = styled.div`
    position: absolute;
    bottom: 30px; /* 화면 아래에서 20px 떨어짐 */
    right: 30px; /* 부모 요소의 왼쪽에서 50px만큼 떨어짐 */
    width: 180px; /* 원하는 너비 */
    height: 30px; /* 원하는 높이 */
    display: flex;
    gap: 20px;
    align-items: center;
`;

export const Button = styled.button`
    padding: 2px 3px;
    font-size: 16px;
    border: none;
    background-color: rgba(122, 122, 122, 0.7);
    color: white;
    cursor: pointer;
    border-radius: 30px;
    display: flex;            // 아이콘과 텍스트를 flex로 배치
    align-items: center;      // 수직 중앙 정렬
    justify-content: center;  // 수평 중앙 정렬

    &:hover {
        background-color: rgb(68, 45, 74);
    }
`;

export const InfoText = styled.div`
  font-size: 16px;
    background-color: rgba(122, 122, 122, 0.7);
  color: white;
`;

export const Image = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover; // 이미지 비율 유지하면서 꽉 채우기
`;

export const STMainBannerB = styled.div`
    position: relative;
    width: 320px; /* 퍼센트 대신 고정 픽셀 너비 */
    height: 380px;
    margin: 0 0 0 20px; /* 왼쪽 여백 고정 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    overflow: hidden; /* 부모 요소에서 넘치는 부분을 숨기도록 설정 */
    border: 1px solid #bcbcbc; /* 주황색 테두리 */
`;

export const ButtonContainerB = styled.div`
    position: absolute;
    bottom: 30px; /* 화면 아래에서 20px 떨어짐 */
    right: 20px;
    width: 180px; /* 원하는 너비 */
    height: 30px; /* 원하는 높이 */
    display: flex;
    gap: 20px;
    align-items: center;
`;

export const ButtonB = styled.button`
    padding: 2px 3px;
    font-size: 10px;
    border: none;
    color: #000000;
    cursor: pointer;
    border-radius: 30px;
    display: flex; // 아이콘과 텍스트를 flex로 배치
    align-items: center; // 수직 중앙 정렬
    justify-content: center; // 수평 중앙 정렬
`;

export const InfoTextB = styled.div`
   font-size: 10px;
    color: #070707;
`;

export const STSubBannerBox = styled.div`
  position: relative;
  width: 80%;
  height: 110px;
  margin: 20px auto; /* 화면 중앙 정렬 */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const STSubBannerA = styled.div`
    position: relative;
    width: 50%;
    height: 100%;
    margin: 0 1% 0 0; /* 위 0, 오른쪽 10%, 아래 0, 왼쪽 0 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    overflow: hidden;  /* 부모 요소에서 넘치는 부분을 숨기도록 설정 */
    background-color: #ffb6b6; /* 임시 배경색 */
`;

export const STSubBannerB = styled.div`
    position: relative;
    width: 50%;
    height: 100%;
    margin: 0 0 0 1%;
    display: flex;
    justify-content: space-between;
    border-radius: 20px;
    overflow: hidden;  /* 부모 요소에서 넘치는 부분을 숨기도록 설정 */
    align-items: center;
    background-color: #ffb6b6; /* 임시 배경색 */
`;
