/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#080A10',       // 전체 배경 (MainPage, Dashboard, Signup, Login)
        'btn-primary': '#1D6CE0',    // 메인 버튼 색상
        'primary-hover': '#366BD6',  // 버튼 호버 색상
        'card-left': '#10151B',      // 카드 왼쪽 섹션 (Signup, Login)
        'card-right': '#1A2229',     // 카드 오른쪽 섹션 (Signup, Login)
      },
      fontFamily: {
        sans: ['Roboto Mono', 'sans-serif'],    //메인 폰트
        noto: ['Noto Sans KR', 'sans-serif'],   //Description 폰트
      }
    },
  },
  plugins: [],
}

