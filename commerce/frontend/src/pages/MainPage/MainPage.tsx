import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BestNew from "./components/BestNew/BestNew";
import Main from "./components/Main/Main";

const MainPage: React.FC = () => {
  const location = useLocation();

  // 다른 페이지 -> 메인페이지로 이동 시 스크롤 처리
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 베스트/신상품 내비게이션 바 클릭 시 해당 섹션으로 스크롤
  const handleBestClick = () => {
    document.getElementById('best-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleNewClick = () => {
    document.getElementById('new-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <Main onBestClick={handleBestClick} onNewClick={handleNewClick} />
      <div id="best-section">
        <BestNew type="best" />
      </div>
      <div id="new-section">
        <BestNew type="new" />
      </div>
    </>
  )
}

export default MainPage;
