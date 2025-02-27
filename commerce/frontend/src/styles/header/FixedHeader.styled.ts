import styled from "styled-components";

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
  padding: 0 20px;
  box-sizing: border-box;
`;

/* 헤더 섹션 - 공통 스타일 */
const Section = styled.section`
    display: flex;
    align-items: center;
`;

/* 헤더 섹션 - 개별 스타일 */
export const MenuSection = styled(Section)``;

export const LogoSection = styled(Section)`
  padding-left: 30px;
  padding-right: 50px;
`;
export const SearchSection = styled(Section)`
  flex-grow: 2;
  position: relative;
`;
export const UserSection = styled(Section)`
  flex-grow: 2;
  justify-content: flex-end;
  gap: 5px;
`;

/* 로고 이미지 */
export const LogoImage = styled.img`
  height: 60px;
  cursor: pointer;
`;

/* 검색창 */
export const SearchInput = styled.input`
  min-width: 100px;
  width: 100%;
  height: 35px;
  padding: 0 2.5rem 0rem 1.5rem;
  border: 1px solid #D9D9D9;
  border-radius: 30px;

  &:focus {
    outline: none;
  }
`;

/* 버튼 공통 스타일 */
const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;

  &:focus {
    outline: none;
  }
`;

/* 메뉴 버튼 */
export const MenuButton = styled(Button)``;

/* 검색 버튼 */
export const SearchButton = styled(Button)`
  display: flex;
  position: absolute;
  right: 6px;
  padding: 8px;
`;

/* 장바구니 버튼 */
export const CartButton = styled(Button)`
    margin-right: 1rem;
`;

/* 유저 버튼 */
export const UserButton = styled(Button)``;