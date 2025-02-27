import React from 'react';
import {
  HeaderContainer,
  TopHeader,
  MainHeader
} from './Header.styled';

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <TopHeader>
        <div className="container">
        </div>
      </TopHeader>

      <MainHeader>
        <div className="container">
          {/* 로고 X */}
        </div>
      </MainHeader>
    </HeaderContainer>
  );
};

export default Header;
