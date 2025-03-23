import styled from 'styled-components';
import { AiOutlineShopping } from 'react-icons/ai';

// 찜하기 아이콘
export const HeartIcon = styled.svg.attrs({
  width: "24",
  height: "24",
  viewBox: "0 0 29 27",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
})`
  path {
    stroke: #666666;
    stroke-width: 2;
  }
`;

// 장바구니 아이콘
export const CartIcon = styled(AiOutlineShopping)`
  width: 24px;
  height: 24px;
  color: #666666;
  stroke-width: 2;
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 10px auto 0px auto;
  padding: 20px;

  .search-content-wrapper {
    display: flex;
    width: 100%;
  }

  .search-results-main-content {
    flex: 1;
    margin-left: 25px;
    margin-top: 5px;
  }
`;

export const ResultHeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;

  .result-count {
    font-size: 20px;
    color: #666;

    strong.keyword {
      color: #e896ff;
      font-weight: bold;
    }

    strong {
      color: #333;
      font-weight: bold;
    }
  }
`;

export const SortingBarStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-right: 10px;
  width: 50%;

  button {
    padding: 8px 14px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-wishlist-button {
    background: white;
    border: 1px solid #ddd;
    color: #666;
    width: 40px;
    height: 40px;
    padding: 8px;

    &:hover {
      background: #f5f5f5;
    }
  }

  .product-cart-add-button {
    background: white;
    border: 1px solid #ddd;
    color: #333;
    gap: 6px;
    padding: 8px 12px;

    &:hover {
      background: #f5f5f5;
    }
  }

  select {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #333;
    font-size: 13px;
    height: 40px;
  }

  .sort-select, .items-per-page-select {
    min-width: 120px;
  }
`;

export const NoResultsStyled = styled.div`
  padding: 30px;
  text-align: center;
  font-size: 18px;
  color: #666;
`;
