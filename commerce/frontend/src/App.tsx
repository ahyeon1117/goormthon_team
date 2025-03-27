import './App.css'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import GlobalFontStyle from './styles/Global/GlobalFont.styled';
import {GlobalPageSize} from './styles/Global/GlobalPage.styled';
import MainPageHeader from './layout/Header/MainPageHeader.tsx';  // MainPageHeader 컴포넌트 import
import FixedHeader from './layout/Header/FixedHeader.tsx'; // FixedHeader (고정 헤더)
import { useAuthStore } from './store/authStore.ts';

function App() {
  // Zustand 스토어의 상태와 액션을 가져옵니다
  const { token } = useAuthStore();

  useEffect(() => {
    // 앱 초기화 시 필요한 작업이 있다면 여기에 구현
    // persist 미들웨어가 자동으로 상태를 복원합니다
  }, [token]);

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
