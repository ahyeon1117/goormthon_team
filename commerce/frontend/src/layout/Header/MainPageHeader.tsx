import {
  STTopBar,
  STMallInner,
  STMainHeader,
  Logo,
  STSearchBox,
  SearchIcon,
  LoginIcon,
  CartIcon,
  STList,
  STNewArrivals,
  STBestSellers,
  MenuIcon,
  STMain,
  STTopBarBox,
  SearchForm,
  SearchInput,
  SearchButton,
  // STUserSection,
  // CartLink,
  // CartCnt
} from './MainPageHeader.styled';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { useNavigate, useLocation, Link } from 'react-router-dom';

const MainPageHeader = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 컴포넌트 마운트 및 경로 변경 시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchKeyword.trim()) {
      // 검색 페이지로 이동하면서 검색어 전달
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
      // 검색 후 입력창 초기화
      setSearchKeyword('');
    } else {
      alert("검색어를 입력하세요.");
    }
  };

  const handleLogoClick = () => {
    // 불필요한 렌더링 방지를 위해 현재 경로가 메인페이지가 아닐 때만 이동
    if(location.pathname !== "/") {
      navigate("/");
    }
  };

  
  // 메인페이지 -> 메인페이지로 이동 시 리렌더링이 발생하지 않아 직접 스크롤 처리
  // const handleLogoClick = () => {
  //   if (location.pathname === "/") {
  //     window.scrollTo(0, 0);
  //   }
  // };

  return (
    <>
      <STMain>
        {/* TopBar 컴포넌트 */}
        <STTopBar>
          <STTopBarBox>
            {isLoggedIn ? (
              <STMallInner onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</STMallInner>
            ) : (
              <STMallInner onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>로그인</STMallInner>
            )}
            <STMallInner>회원가입</STMallInner>
            <STMallInner>장바구니</STMallInner>
            <STMallInner>주문배송</STMallInner>
            <STMallInner>고객센터</STMallInner>
          </STTopBarBox>
        </STTopBar>

        {/* MainHeader 컴포넌트 */}
        <STMainHeader>
          <Logo onClick={handleLogoClick} style={{ cursor: 'pointer' }} />
          {/* <Link to="/" onClick={handleLogoClick}>
            <Logo style={{ cursor: 'pointer' }} />
          </Link> */}
          <STSearchBox>
            <SearchForm onSubmit={handleSearch}>
              <SearchInput
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
              />
              <SearchButton type="submit">
                <SearchIcon />
              </SearchButton>
            </SearchForm>
          </STSearchBox>
          <div>
            <CartIcon />
            <LoginIcon/>
          </div>
          {/* <STUserSection>
            <CartLink to="/cart">
              <CartIcon />
              <CartCnt>3</CartCnt>
            </CartLink>
            <LoginIcon />
          </STUserSection> */}
        </STMainHeader>

        {/* List 컴포넌트 */}
        <STList>
          <MenuIcon />
          <STNewArrivals>신상품</STNewArrivals>
          <STBestSellers>베스트</STBestSellers>
        </STList>


      </STMain>
    </>
  );
};

export default MainPageHeader;
