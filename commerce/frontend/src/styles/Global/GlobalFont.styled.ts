// src/styles/globalStyles.ts
import { createGlobalStyle } from 'styled-components';
//폰트 사용
// 폰트 파일 경로 상단에서 정의
const LIGHT_FONT_PATH = '../../assets/fonts/GmarketSansTTFLight.ttf';
const REGULAR_FONT_PATH = '../../assets/fonts/GmarketSansTTFMedium.ttf';
const BOLD_FONT_PATH = '../../assets/fonts/GmarketSansTTFBold.ttf';

const GlobalFontStyle = createGlobalStyle`
  @font-face {
    font-family: "GmarketSans";
    font-weight: 300;
    src: url(${LIGHT_FONT_PATH}) format("truetype");
  }

  @font-face {
    font-family: "GmarketSans";
    font-weight: 400;
    src: url(${REGULAR_FONT_PATH}) format("truetype");
  }

  @font-face {
    font-family: "GmarketSans";
    font-weight: 700;
    src: url(${BOLD_FONT_PATH}) format("truetype");
  }

  * {
      font-family: "GmarketSans", sans-serif;
      font-weight: 400; /* 기본 굵기: Regular */
  }
  
`;

export default GlobalFontStyle;