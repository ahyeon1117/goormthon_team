/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#080A10',                 // 전체 배경 (MainPage, Dashboard, Signup, Login)
        'btn-primary': '#1D6CE0',              // 메인 버튼 색상 (Blue계열)
        'primary-hover' : '#155CCB',           // 메인 버튼 호버 색상 (Blue계열)
        // 'primary-hover': '#366BD6',
        'card-left': '#10151B',                // 카드 왼쪽 섹션 (Signup, Login)
        'card-right': '#1A2229',               // 카드 오른쪽 섹션 (Signup, Login)

        dashboard : {
          background: "#1A2229",               // 대시보드 요소 배경
          'gray' : "#7A8290",   // 
          'btn-control-primary': "#334250",    // 컨트롤 바 버튼(ex.Language)
          'btn-hover': "#2B3B4A",              // 컨트롤 바 버튼 Hover(ex.Language)
          'btn-run-border' : "#1959B8"         //실행 버튼 테두리리
        },
      },
      fontFamily: {
        sans: ['Roboto Mono', 'sans-serif'],    //메인 폰트
        noto: ['Noto Sans KR', 'sans-serif'],   //Description 폰트
      }
    },
  },
  plugins: [],
}