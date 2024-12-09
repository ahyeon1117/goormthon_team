import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./views/DashboardPage";
function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
