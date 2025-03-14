import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png"; // 로고 이미지
import { AiOutlineMenu, AiOutlineSearch, AiOutlineUser } from "react-icons/ai"; // 아이콘
import { RiShoppingBagLine } from "react-icons/ri"; // 장바구니 아이콘
import * as S from "./FixedHeader.styled";

const FixedHeader: React.FC = () => {
  const [isFixed, setIsFixed] = useState(false); // 고정 헤더 표시 상태
  const nav = useNavigate();
  const location = useLocation();

  // 스크롤 시 고정 헤더 보이기 **메인 페이지 헤더에 맞게 스크롤 위치 조정해야 함**
  useEffect(() => {
    // 마운트 시 스크롤 이벤트 핸들러 정의
    const handleScroll = () => {
      // 삼항 연산자는 값을 반환해야 하는데 이 경우에는 반환값을 사용하지 않으므로 ESLint 경고 발생
      setIsFixed(window.scrollY > 120); // 스크롤 위치가 120px보다 크면 고정 헤더 표시
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoClick = () => {
    // 불필요한 렌더링 방지를 위해 현재 경로가 메인페이지가 아닐 때만 이동
    if(location.pathname !== "/") {
      nav("/");
    }
  }

  return (
    <S.FixedHeaderWrapper $isFixed={isFixed}>
      <S.FixedHeaderContainer>
        <S.MenuSection className="menu-section"> {/* 섹션: 메뉴 버튼 */}
          <S.MenuButton>
            <AiOutlineMenu size={25} />
          </S.MenuButton>
        </S.MenuSection>
        <S.LogoSection> {/* 섹션: 로고 */}
          <S.LogoImage src={logo} alt="logo" onClick={handleLogoClick} />
        </S.LogoSection>
        <S.SearchSection> {/* 섹션: 검색 입력 및 버튼 */}
          <S.SearchContainer>
            <S.SearchInput type="text" />
            <S.SearchButton>
              <AiOutlineSearch size={20} />
            </S.SearchButton>
          </S.SearchContainer>
        </S.SearchSection>
        <S.UserSection> {/* 섹션: 사용자 메뉴 (장바구니, 유저 버튼) */}
          <S.CartButton>
            <RiShoppingBagLine size={30} />
          </S.CartButton>
          <S.UserButton>
            <AiOutlineUser size={30} />
          </S.UserButton>
        </S.UserSection>
      </S.FixedHeaderContainer>
    </S.FixedHeaderWrapper>
  )
}

export default FixedHeader;