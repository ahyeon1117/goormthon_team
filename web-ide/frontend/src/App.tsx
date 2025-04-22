import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import DashboardPage from './pages/DashboardPage';
import Workspace from './pages/WorkspacePage';
import RouterGuard from './components/auth/RouterGurad';

function App() {
  return (
    <div className="min-h-screen w-full bg-background text-white">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <RouterGuard>
              <DashboardPage />
            </RouterGuard>
          }
        />
        <Route
          path="/workspace"
          element={
            <RouterGuard>
              <Workspace />
            </RouterGuard>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
