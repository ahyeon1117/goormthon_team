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
  const [searchKeyword, setSearchKeyword] = useState('');

  // 스크롤 시 고정 헤더 보이기
  useEffect(() => {
    // 마운트 시 스크롤 이벤트 핸들러 정의
    const handleScroll = () => {
      setIsFixed(window.scrollY > 190); // 스크롤 위치가 메인헤더 크기보다 크면 고정 헤더 표시
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchKeyword.trim()) {
      // 검색 페이지로 이동하면서 검색어 전달
      nav(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
      // 검색 후 입력창 초기화
      setSearchKeyword('');
    } else {
      alert("검색어를 입력하세요.");
    }
  };

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
            <S.SearchForm onSubmit={handleSearch}>
              <S.SearchInput
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
              />
              <S.SearchButton type="submit">
                <AiOutlineSearch size={20} />
              </S.SearchButton>
            </S.SearchForm>
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
