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
    justify-content: space-between;
    padding: 0 16px;
  }
`;
