import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './layout/Header/Header'

function App() {
  return (
    <div className="App">
      {/* 여기에 공통 레이아웃 요소를 추가할 수 있습니다 (헤더, 푸터 등) */}
      <Header />
      <Outlet />
    </div>
  )
}

export default App
