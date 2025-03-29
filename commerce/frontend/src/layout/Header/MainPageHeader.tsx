import {
  STTopBar,
  STMallInner,
  STMainHeader,
  Logo,
  STSearchBox,
  SearchIcon,
  LoginIcon,
  CartIcon,
  BookIcon,
  STMain,
  STTopBarBox,
  SearchForm,
  SearchInput,
  SearchButton,
  STUserSection,
  UserLink,
  CartCnt,
  STLogoSearchContainer
} from './MainPageHeader.styled';

import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logout as logoutApi } from '../../api/authApi';
import { useCart } from '../../hooks';
import UserProfileModal from '../../pages/Modal/UserProfileModal.tsx'; // 모달 컴포넌트 임포트

const MainPageHeader = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useCart();

  // Zustand 스토어에서 인증 상태를 가져옵니다
  const { isAuthenticated } = useAuthStore();

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // authApi의 logout 함수 호출
    logoutApi();
    navigate('/');
  };

  // 로그인 되어 있으면 모달 띄우기
  const handleLoginClick = () => {
    if (isAuthenticated) {
      setShowModal(true); // 로그인 되어 있으면 모달 띄우기
    } else {
      navigate('/login'); // 로그인 안되어 있으면 로그인 페이지로 이동
    }
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
            {isAuthenticated ? (
              <STMallInner onClick={handleLogout} style={{ cursor: 'pointer' }}>로그아웃</STMallInner>
            ) : (
              <STMallInner onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>로그인</STMallInner>
            )}
            <STMallInner onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>회원가입</STMallInner>
            <STMallInner onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>장바구니</STMallInner>
            {isAuthenticated && (
              <STMallInner onClick={() => navigate('/mybook')} style={{ cursor: 'pointer' }}>내 서재</STMallInner>
            )}
            <STMallInner>주문조회</STMallInner>
            <STMallInner>고객센터</STMallInner>
          </STTopBarBox>
        </STTopBar>

        {/* MainHeader 컴포넌트 */}
        <STMainHeader>
          <STLogoSearchContainer>
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
          </STLogoSearchContainer>

          <STUserSection>
            {isAuthenticated && (
              <UserLink to="/mybook" onClick={() => handleSamePageScroll("/mybook")}>
                <BookIcon />
              </UserLink>
            )}
            <UserLink to="/cart" onClick={() => handleSamePageScroll("/cart")}>
              <CartIcon />
              {isAuthenticated && <CartCnt>{totalCount}</CartCnt>}
            </UserLink>
            <div onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
              <LoginIcon />
            </div>
            {showModal && isAuthenticated && (
              <UserProfileModal showModal={showModal} onClose={() => setShowModal(false)} />
            )}
          </STUserSection>
        </STMainHeader>

      </STMain>
    </>
  );
};

export default MainPageHeader;
