import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BestNew from "./components/BestNew/BestNew";
import Main from "./components/Main/Main";
// import { getNewProducts } from "../../api/productApi";

const MainPage: React.FC = () => {
  const location = useLocation();


  // const [newProducts, setNewProducts] = useState<BookItem[]>([]);
  // useEffect(() => {
  //   const fetchNewProducts = async () => {
      
  //     try {
  //       const products = await getNewProducts();
  //       setNewProducts(products);
  //       console.log('신상품 목록 조회 성공:', newProducts);
  //     } catch (error) {
  //       console.error('신상품 목록을 가져오는 중에 오류가 발생했습니다:', error);
        
  //     }
  //   };

  //   fetchNewProducts();
  // }, []);

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
