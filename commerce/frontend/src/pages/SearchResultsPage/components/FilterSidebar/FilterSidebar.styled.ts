import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 200px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px 15px;
  background-color: #fff;
  box-sizing: border-box;
`;

export const SearchBox = styled.form`
  display: flex;
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;

  .search-keyword-input {
    flex: 1;
    padding: 5px;
    border: none;
    outline: none;
    font-size: 12px;
    box-sizing: border-box;
    min-width: 0;

    &:focus {
      outline: none;
    }
  }

  .search-submit-button {
    padding: 5px;
    width: 28px;
    background: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    flex-shrink: 0;
  }
`;

export const FilterSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const FilterTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-top: 3px;
  margin-bottom: 5px;
  padding-bottom: 3px;
`;

export const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FilterItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  label {
    margin-left: 8px;
    cursor: pointer;
    font-size: 14px;
  }
`;

export const Checkbox = styled.input`
  cursor: pointer;
`;
