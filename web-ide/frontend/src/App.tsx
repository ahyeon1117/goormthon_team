import { Routes, Route } from 'react-router-dom';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import DashboardPage from './DashboardPage';
import EditorWorkspace from './components/EditorWorkspace';

function App() {
  return (
    <div className="min-h-screen w-full bg-background text-white">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/workspace" element={<EditorWorkspace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
