import './App.css'
import { Outlet } from 'react-router-dom'
import GlobalFontStyle from './styles/Global/GlobalFont.styled';
import {GlobalPageSize} from './styles/Global/GlobalPage.styled';
import MainPageHeader from './layout/Header/MainPageHeader.tsx';  // MainPageHeader 컴포넌트 import
import FixedHeader from './layout/Header/FixedHeader.tsx'; // FixedHeader (고정 헤더)

function App() {

  return (
    <div className="App">
      {/* 여기에 공통 레이아웃 요소를 추가할 수 있습니다 (헤더, 푸터 등) */}
      <GlobalFontStyle />
      <GlobalPageSize />

      <MainPageHeader />
      <FixedHeader />
      <Outlet />
    </div>
  )
}

export default App
