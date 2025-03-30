import styled from "styled-components";
import { AiOutlineShopping } from 'react-icons/ai';

// 장바구니 아이콘
export const CartIcon = styled(AiOutlineShopping)`
  width: 24px;
  height: 24px;
  color: #666666;
  stroke-width: 2;
`;

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

export const MyBookContainer = styled.div`
  max-width: 1200px;
  margin: 20px auto 40px auto;
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 6px;
`;

export const BookCount = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 12px;
  gap: 0px;
  width: 100%;
  margin-top: 5px;
`;

export const SortingBarStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-right: 30px;
  margin-left: 4px;
  width: auto;

  button {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    height: 36px;
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
    padding: 5px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #333;
    font-size: 12px;
    height: 36px;
  }

  .sort-select, .items-per-page-select {
    min-width: 100px;
  }
`;

export const SearchBox = styled.form`
  display: flex;
  width: 190px;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
  height: 36px;

  .search-keyword-input {
    flex: 1;
    padding: 6px 10px;
    border: none;
    outline: none;
    font-size: 13px;
    box-sizing: border-box;
    min-width: 0;
    height: 100%;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #888;
      opacity: 1;
    }
  }

  .search-submit-button {
    padding: 6px;
    width: 36px;
    background: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    flex-shrink: 0;
    height: 100%;
  }
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
  cursor: pointer;
  outline: none;
`;

export const ItemsPerPageSelect = styled(SortSelect)`
  min-width: 120px;
`;

export const BookList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 25px;
  list-style: none;
  padding: 0;
  margin-left: 30px;
  margin-right: 30px;
`;

export const BookItem = styled.li`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
`;

export const BookCoverWrapper = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
`;

export const BookCover = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
`;

export const BookInfo = styled.div`
  padding: 10px 10px 5px 10px;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const BookTitle = styled.h3`
  font-size: 13px;
  margin: 4px 0 3px 0;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BookAuthor = styled.p`
  font-size: 11px;
  color: #666;
  margin: 0 0 3px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PurchaseDate = styled.p`
  font-size: 10px;
  color: #999;
  margin: 0 0 5px 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 16px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 0px;
`;
