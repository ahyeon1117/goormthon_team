import styled from 'styled-components';
import { AiOutlineSearch, AiOutlineUser, AiOutlineShopping ,AiOutlineMenu} from 'react-icons/ai';
import logo from '../../assets/images/logo.png';

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
  margin-right: 160px;
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
  height: 39px;
  margin-top: 40px;
`;

export const CartIcon = styled(AiOutlineShopping)`
  width: 40px;
  height: 39px;
  margin-top: 40px;
  margin-right: 55px;
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
  margin-left: 20px;
  margin-right: 45px;
  color: #442D4A;
`;

// 베스트 컴포넌트
export const STBestSellers = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  align-items: center;
  text-align: center;
  color: #442D4A;
`;


export const MenuIcon = styled(AiOutlineMenu)`
  color: #442D4A;  /* 아이콘 색상 */
  font-size: 24px;  /* 아이콘 크기 */
  margin-right: 12px;
`;
