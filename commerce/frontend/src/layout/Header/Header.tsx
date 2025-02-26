import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeaderContainer,
  TopHeader,
  MainHeader,
  SearchContainer
} from './Header.styled';

const Header: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <HeaderContainer>
      <TopHeader>
        <div className="container">
        </div>
      </TopHeader>

      <MainHeader>
        <div className="container">
          {/* 검색창 */}
          <SearchContainer>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
              />
              <button type="submit">검색</button>
            </form>
          </SearchContainer>
        </div>
      </MainHeader>
    </HeaderContainer>
  );
};

export default Header;
