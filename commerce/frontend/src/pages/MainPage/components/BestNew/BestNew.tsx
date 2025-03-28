import { useEffect, useState } from "react";
import BNProductList from "./ProductList/BNProductList"
import Banner from "./Banner/Banner"
import { getNewProducts } from "../../../../api/productApi";
import { BestNewBook } from "../../../../types";
import styled from "styled-components";

const LoadingStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 30px;
  font-weight: 700;
`;

const BestNew: React.FC<{ type: "best" | "new" }> = ({ type }) => {
  const [newBooks, setNewBooks] = useState<BestNewBook[]>([]);
  const [bestBooks, setBestBooks] = useState<BestNewBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 신상품 불러오기, 베스트는 임시로 신상품 데이터를 사용
    const fetchNewProducts = async () => {
      try {
        // 신상품 데이터
        const newProducts = await getNewProducts();
        setNewBooks(newProducts);
        
        // 임시 베스트 데이터
        const bestProducts = [...newProducts].reverse().slice(0, 10);
        setBestBooks(bestProducts);

      } catch (error) {
        console.error("도서 데이터 로딩 중 오류:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    }

    fetchNewProducts();
  }, []);

  return (
    <>
      {isLoading && <LoadingStyle>로딩 중...</LoadingStyle>}
      <BNProductList
        type={type}
        books={type === "best" ? bestBooks : newBooks}
      />
      <Banner type={type} />
    </>
  )
}

export default BestNew;