import styled from 'styled-components';
import { AiOutlineSearch, AiOutlineUser, AiOutlineShopping, AiOutlineBook } from 'react-icons/ai';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

export const STMain = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const STTopBar = styled.div`
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: center;
  background: #FCF2FF;
`;
export const STTopBarBox = styled.div`
  position: relative;
  display:flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 30px;
  width: 80%;
  height: 46px;
  left: 0;
  top: 0;
  background: #FCF2FF;
`;


export const STMallInner = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  align-items: center;
  text-align: center;
  color: #756E77;
`;

export const STMainHeader = styled.div`
  position: relative;
  width: 80%;
  min-height: 140px;
  margin: 0 auto; /* 화면 중앙 정렬 */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const STLogoSearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 900px;
`;

export const Logo = styled.div`
  width: 226px !important;
  height: 122px !important;
  background: url(${logo});
  background-size: cover;
  margin-top: 20px;
  background-repeat: no-repeat;
`;

export const STSearchBox = styled.div`
  position: relative;
  width: 623px;
  height: 57px;
  background: #FFFFFF;
  border: 2px solid #D9D9D9;
  border-radius: 30px;
  margin-top: 40px;
  margin-left: 20px;
`;

export const SearchForm = styled.form`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 30px;
  padding: 0 50px 0 20px;
  font-size: 16px;
  outline: none;
`;

export const SearchButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const SearchIcon = styled(AiOutlineSearch)`
  position: absolute;
  right: 25px; /* 오른쪽 끝에서 15px 떨어진 위치 */
  top: 50%;
  transform: translateY(-50%); /* 세로 중앙 정렬 */
  width: 35px;
  height: 35px;
  color: #442D4A;
`;

export const LoginIcon = styled(AiOutlineUser)`
  width: 40px;
  height: 40px;
  display: flex;
`;

export const CartIcon = styled(AiOutlineShopping)`
  width: 40px;
  height: 40px;
  display: flex;
`;

export const BookIcon = styled(AiOutlineBook)`
  width: 40px;
  height: 38px;
  color: #333;
  display: flex;
`;

export const UserLink = styled(Link)`
  position: relative;
  color: black;
  display: flex;
  align-items: center;

  &:hover {
    color: black;
  }
`;

// 장바구니 개수
export const CartCnt = styled.span`
  position: absolute;
  top: 2px;
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

// 장바구니, 로그인 버튼 (flex 처리를 위해 묶음)
export const STUserSection = styled.section`
  display: flex;
  margin-top: 40px;
  gap: 30px;
`;
