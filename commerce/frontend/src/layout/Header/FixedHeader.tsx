import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png"; // 로고 이미지
import { AiOutlineSearch, AiOutlineUser, AiOutlineShopping } from "react-icons/ai"; // 아이콘
import * as S from "./FixedHeader.styled";

const FixedHeader: React.FC = () => {
  const [isFixed, setIsFixed] = useState(false); // 고정 헤더 표시 상태
  const location = useLocation();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    // 마운트 시 스크롤 이벤트 핸들러 정의
    const handleScroll = () => {
      setIsFixed(window.scrollY > 170); // 스크롤 위치가 메인헤더 크기보다 크면 고정 헤더 표시
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  // 현재 페이지로 이동 시 스크롤 처리 (메인->메인, 카트->카트 페이지로 이동 시 스크롤 처리)
  const handleSamePageScroll = (destinationPath: string) => {
    // 현재 경로와 이동하려는 경로가 같을 때만 직접 스크롤
    // 이유: 현재 페이지로 다시 이동하는 경우에는, 현재 페이지의 useEffect가 실행되지 않아 스크롤이 처리되지 않기 때문
    if (location.pathname === destinationPath) {
      console.log("현재 페이지로 이동 시 스크롤 처리");
      window.scrollTo(0, 0);
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

  return (
    <S.FixedHeaderWrapper $isFixed={isFixed}>
      <S.FixedHeaderContainer>

        {/* 섹션: 메뉴 버튼 */}
        {/* <S.MenuSection className="menu-section">
          <S.MenuButton>
            <AiOutlineMenu size={25} />
          </S.MenuButton>
        </S.MenuSection> */}

        {/* 섹션: 로고 */}
        <S.LogoSection>
          <Link to="/" onClick={() => handleSamePageScroll("/")}>
            <S.LogoImage src={logo} alt="로고 이미지" />
          </Link>
        </S.LogoSection>

        {/* 섹션: 검색 입력 및 버튼 */}
        <S.SearchSection>
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

        {/* 섹션: 사용자 메뉴 (장바구니, 유저 버튼) */}
        <S.UserSection>
          <S.CartLink to="/cart" onClick={() => handleSamePageScroll("/cart")}>
            <AiOutlineShopping size={38} />
            <S.CartCnt>6</S.CartCnt>
          </S.CartLink>
          <S.UserButton>
            <AiOutlineUser size={38} />
          </S.UserButton>
        </S.UserSection>

      </S.FixedHeaderContainer>
    </S.FixedHeaderWrapper>
  )
}

export default FixedHeader;
