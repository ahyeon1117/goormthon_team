import Article from "./components/Article.js";
import Contents from "./components/Contents.js";
import Sidebar from "./components/Sidebar.js";
import Story from "./components/Story.js";

function App() {
  return (
    <div className="body">
      <nav className="sidebar">
        <Sidebar />
      </nav>
      <div className="main">
        <main className="contents-area mgt16">
          <div className="story">
            <Story />
          </div>
          <div className="contents">
            <Contents />
          </div>
        </main>
        <article className="article">
          <Article />
        </article>
      </div>
    </div>
  );
}

export default App;
