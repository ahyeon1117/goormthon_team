import styled from 'styled-components';

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 10px;

  .pagination-button {
    min-width: 36px;
    height: 36px;
    border: 1px solid #e0e0e0;
    background-color: #fff;
    color: #555;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;

    &:hover {
      background-color: #f5f5f5;
      border-color: #ccc;
    }

    &.active {
      background-color: #e896ff;
      border-color: #e896ff;
      color: white;
      font-weight: bold;
    }

    &.prev, &.next {
      padding: 0 15px;
    }
  }

  .pagination-ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    color: #999;
  }
`;
