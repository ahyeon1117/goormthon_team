import styled from 'styled-components';

export const SearchOptionsContainer = styled.div`
  margin-bottom: 20px;
  padding-top: 10px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
  border-radius: 6px;
`;

export const SearchTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 7px 14px;
  color: #333;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #cccccc;

  &:first-child {
    color: #e896ff;
    background-color: #fcfcff;
    .tag-remove {
      display: none;
    }
  }

  .tag-remove {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #cccccc;
    font-weight: 100;
    font-size: 28px;
    padding: 0;
  }
`;
