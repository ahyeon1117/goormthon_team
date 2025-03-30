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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 신상품 불러오기, 베스트는 임시로 신상품 데이터를 사용
    const fetchNewProducts = async () => {
      // 신상품 데이터
      const newProducts = await getNewProducts();

      if (newProducts.length > 0) { // 신상품 데이터가 있으면
        console.log("신상품 불러오기 성공");
      } else {
        console.warn("신상품.");
      }
      setNewBooks(newProducts);

      // 베스트 데이터
      const bestProducts = [...newProducts].reverse().slice(0, 10);
      setBestBooks(bestProducts);

      setIsLoading(false);
    }

    fetchNewProducts();
  }, []);

  if (isLoading) return <LoadingStyle>로딩 중...</LoadingStyle>;

  return (
    <>
      <BNProductList
        type={type}
        books={type === "best" ? bestBooks : newBooks}
      />
      <Banner type={type} />
    </>
  )
}

export default BestNew;