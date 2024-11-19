import Article from "./components/Article.js";
import Contents from "./components/Contents.js";
import Sidebar from "./components/Sidebar.js";
import Story from "./components/Story.js";

function App() {
  return (
    <div className="body">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main">
        <div className="contents-area mgt16">
          <div className="story">
            <Story />
          </div>
          <div className="contents">
            <Contents />
          </div>
        </div>
        <div className="article">
          <Article />
        </div>
      </div>
    </div>
  );
}

export default App;
