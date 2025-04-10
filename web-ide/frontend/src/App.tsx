import { Routes, Route } from 'react-router-dom';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import EditorWorkspace from './components/EditorWorkspace';

function App() {
  return (
    <div className="min-h-screen w-full bg-background text-white">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/workspace" element={<EditorWorkspace />} />
      </Routes>
    </div>
  );
}

export default App;
