import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
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

export const CategoryTabsStyled = styled.div`
  display: flex;
  margin-bottom: 20px;

  .category-tab {
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 14px;
      width: 1px;
      background-color: #ddd;
    }

    &.active {
      color: #333;
      font-weight: bold;
    }

    .label {
      margin-right: 5px;
    }

    .count {
      color: #666;
      font-size: 14px;
    }
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

    strong:first-child {
      color: #e896ff;
      font-weight: bold;
    }

    strong:last-child {
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
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
  }

  .product-wishlist-button {
    background: white;
    border: 1px solid #ddd;
    color: #666;

    &:hover {
      background: #f5f5f5;
    }
  }

  .product-cart-add-button {
    background: white;
    border: 1px solid #ddd;
    color: #666;

    &:hover {
      background: #f5f5f5;
    }
  }

  select {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
  }

  .sort-select, .items-per-page-select {
    min-width: 120px;
  }
`;
