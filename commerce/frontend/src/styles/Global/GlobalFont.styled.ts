// src/styles/globalStyles.ts
import { createGlobalStyle } from 'styled-components';
// 폰트 직접 import
import LightFont from '../../assets/fonts/GmarketSansTTFLight.ttf';
import RegularFont from '../../assets/fonts/GmarketSansTTFMedium.ttf';
import BoldFont from '../../assets/fonts/GmarketSansTTFBold.ttf';

const GlobalFontStyle = createGlobalStyle`
  @font-face {
    font-family: "GmarketSans";
    font-weight: 300;
    src: url(${LightFont}) format("truetype");
    font-display: swap;
  }

  @font-face {
    font-family: "GmarketSans";
    font-weight: 400;
    src: url(${RegularFont}) format("truetype");
    font-display: swap;
  }

  @font-face {
    font-family: "GmarketSans";
    font-weight: 700;
    src: url(${BoldFont}) format("truetype");
    font-display: swap;
  }

  * {
      font-family: "GmarketSans", sans-serif;
      font-weight: 400; /* 기본 굵기: Regular */
  }

`;

export default GlobalFontStyle;
