import styled from 'styled-components';

export const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const TopHeader = styled.div`
  background-color: #FCF2FF;
  color: white;
  height: 20px;
  padding: 8px 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    padding: 0 16px;
  }
`;

export const MainHeader = styled.div`
  background-color: white;
  height: 40px;
  padding: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
  }
`;

export const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;

  form {
    display: flex;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-right: none;
    border-radius: 4px 0 0 4px;
    font-size: 16px;
    outline: none;

    &:focus {
      border-color: #888;
    }
  }

  button {
    padding: 10px 20px;
    background-color: #888;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #666;
    }
  }
`;
