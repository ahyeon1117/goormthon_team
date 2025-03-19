import { createGlobalStyle } from "styled-components";
//페이지 비율 고정
export const GlobalPageSize = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
      min-width: 1512px; /* 최소 크기 */  
    min-height: 100%;
    box-sizing: border-box;
    overflow-x: auto; /* 가로 스크롤 방지 */
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }
`;