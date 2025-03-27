import {
  STTopBar,
  STMallInner,
  STMainHeader,
  Logo,
  STSearchBox,
  SearchIcon,
  LoginIcon,
  CartIcon,
  STMain,
  STTopBarBox,
  SearchForm,
  SearchInput,
  SearchButton,
  STUserSection,
  CartLink,
  CartCnt
} from './MainPageHeader.styled';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

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

  // 현재 페이지로 이동 시 스크롤 처리 (메인->메인, 카트->카트 페이지로 이동 시 스크롤 처리)
  const handleSamePageScroll = (destinationPath: string) => {
    // 현재 경로와 이동하려는 경로가 같을 때만 직접 스크롤
    // 이유: 현재 페이지로 다시 이동하는 경우에는, 현재 페이지의 useEffect가 실행되지 않아 스크롤이 처리되지 않기 때문
    if (location.pathname === destinationPath) {
      console.log("현재 페이지로 이동 시 스크롤 처리");
      window.scrollTo(0, 0);
    }
  };

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
            <STMallInner onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>회원가입</STMallInner>
            <STMallInner onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>장바구니</STMallInner>
            <STMallInner>주문조회</STMallInner>
            <STMallInner>고객센터</STMallInner>
          </STTopBarBox>
        </STTopBar>

        {/* MainHeader 컴포넌트 */}
        <STMainHeader>
          <Link to="/" onClick={() => handleSamePageScroll("/")}>
            <Logo style={{ cursor: 'pointer' }} />
          </Link>
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
          <STUserSection>
            <CartLink to="/cart" onClick={() => handleSamePageScroll("/cart")}>
              <CartIcon />
              <CartCnt>6</CartCnt>
            </CartLink>
            <LoginIcon onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}></LoginIcon>
          </STUserSection>
        </STMainHeader>

      </STMain>
    </>
  );
};

export default MainPageHeader;
