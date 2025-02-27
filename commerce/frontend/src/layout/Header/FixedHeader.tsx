import { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png"; // 로고 이미지
import { AiOutlineMenu, AiOutlineSearch, AiOutlineUser } from "react-icons/ai"; // 아이콘
import { RiShoppingBagLine } from "react-icons/ri"; // 장바구니 아이콘
import {
  FixedHeaderWrapper,
  FixedHeaderContainer,
  MenuSection,
  LogoSection,
  SearchSection,
  UserSection,
  LogoImage,
  SearchInput,
  MenuButton,
  SearchButton,
  CartButton,
  UserButton
} from "../../styles/header/FixedHeader.styled";

function FixedHeader() {

  const [isFixed, setIsFixed] = useState(false); // 고정 헤더 표시 상태

  // 스크롤 시 고정 헤더 보이기 **메인 페이지 헤더에 맞게 스크롤 위치 조정해야 함**
  useEffect(() => {
    // 마운트 시 스크롤 이벤트 핸들러 정의
    const handleScroll = () => {
      if (window.scrollY > 150) { // 스크롤 위치가 150px보다 크면 고정 헤더 표시 **조정 필요
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    // 마운트 시 스크롤 이벤트 리스너 등록 (스크롤 이벤트가 발생 시 handleScroll 실행)
    window.addEventListener("scroll", handleScroll);
    // 언마운트 시 스크롤 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <FixedHeaderWrapper $isFixed={isFixed}>
      <FixedHeaderContainer>
        <MenuSection> {/* 섹션: 메뉴 버튼 */}
          <MenuButton>
            <AiOutlineMenu size={25} />
          </MenuButton>
        </MenuSection>
        <LogoSection> {/* 섹션: 로고 */}
          <LogoImage src={logo} alt="logo" />
        </LogoSection>
        <SearchSection> {/* 섹션: 검색 입력 및 버튼 */}
          <SearchInput type="text" />
          <SearchButton>
            <AiOutlineSearch size={20} />
          </SearchButton>
        </SearchSection>
        <UserSection> {/* 섹션: 사용자 메뉴 (장바구니, 유저 버튼) */}
          <CartButton>
            <RiShoppingBagLine size={30} />
          </CartButton>
          <UserButton>
            <AiOutlineUser size={30} />
          </UserButton>
        </UserSection>
      </FixedHeaderContainer>
    </FixedHeaderWrapper>
  )
}

export default FixedHeader;