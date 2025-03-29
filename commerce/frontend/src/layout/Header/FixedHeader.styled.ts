import styled from "styled-components";
import { Link } from "react-router-dom";

export const FixedHeaderWrapper = styled.header<{ $isFixed: boolean }>`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 75px;
  box-sizing: border-box;
  background-color: white;
  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.05);
  visibility: ${props => props.$isFixed ? "visible" : "hidden"};
`;

export const FixedHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`;

/* 헤더 섹션 - 공통 스타일 */
const SectionStyle = styled.section`
  display: flex;
  align-items: center;
`;

/* 헤더 섹션 - 개별 스타일 */
export const MenuSection = styled.section``;

export const LogoSection = styled(SectionStyle)`
  padding-left: 20px;
  padding-right: 30px;
`;

export const SearchSection = styled(SectionStyle)`
  flex: 1;
  width: 100%;
`;

export const UserSection = styled(SectionStyle)`
  justify-content: flex-end;
  gap: 20px;
`;

/* 로고 이미지 */
export const LogoImage = styled.img`
  height: 60px;
  cursor: pointer;
`;

/* 검색 컨테이너 */
export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 500px;
`;

/* 검색 폼 */
export const SearchForm = styled.form`
  display: flex;
  width: 100%;
`;

/* 검색 input */
export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 2.5rem 0rem 1.5rem;
  border: 1px solid #D9D9D9;
  border-radius: 30px;

  &:focus {
    outline: none;
  }
`;

/* 버튼 공통 스타일 */
const ButtonStyle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px; // 호버 범위 조정

  &:focus {
    outline: none;
  }
`;

/* 메뉴 버튼 */
export const MenuButton = styled(ButtonStyle)``;

/* 검색 버튼 */
export const SearchButton = styled(ButtonStyle)`
  display: flex;
  position: absolute;
  right: 6px;
`;

export const UserLink = styled(Link)`
  position: relative;
  color: black;

  &:hover {
    color: black;
  }
`;

// 장바구니 개수
export const CartCnt = styled.span`
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: #E896FF;
  border-radius: 50%;
  font-size: 12px;
  color: white;
  font-weight: bold;
`;
