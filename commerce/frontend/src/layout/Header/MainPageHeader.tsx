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
        SearchButton
} from './MainPageHeader.styled';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPageHeader = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchKeyword.trim()) {
      // 검색 페이지로 이동하면서 검색어 전달
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
      // 검색 후 입력창 초기화
      setSearchKeyword('');
    }
  };

  return (
    <>
      <STMain>

        {/* TopBar 컴포넌트 */}
        <STTopBar>
          <STTopBarBox>
            <STMallInner>회원가입</STMallInner>
            <STMallInner>장바구니</STMallInner>
            <STMallInner>주문배송</STMallInner>
            <STMallInner>고객센터</STMallInner>
          </STTopBarBox>
        </STTopBar>

        {/* MainHeader 컴포넌트 */}
        <STMainHeader>
          <Logo />
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
