import SuggestSidebar from "./components/SuggestSidebar.js";
import Contents from "./components/Contents.js";
import NavSidebar from "./components/NavSidebar.js";
import Story from "./components/Story.js";

function App() {
  return (
    <div className="body">
      <aside className="sidebar">
        <NavSidebar />
      </aside>
      <main className="main">
        <article className="contents-area mgt16">
          <div className="story">
            <Story />
          </div>
          <div className="contents">
            <Contents />
          </div>
        </article>
        <aside className="article">
          <SuggestSidebar />
        </aside>
      </main>
    </div>
  );
}

export default App;
