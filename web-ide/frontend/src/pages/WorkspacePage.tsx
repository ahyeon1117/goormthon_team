import { mockFileTree } from '../mock/mockFileTree';

import Header from '../components/workspace/Header';
import Sidebar from '../components/workspace/Sidebar';
import { FileTree } from '../components/workspace/FileTree';
import EditorWorkspace from '../components/editor/EditorWorkspace';
import ChatButton from '../components/workspace/ChatButton';
import { FileProvider } from '../contexts/FileContext';

/**
 * React Context API
 *
 * Page - selectedFile state
 * ㄴ FileTree, EditorWorkspace
 */

const WorkspacePage = () => {
  return (
    <FileProvider>
      <div className="min-h-screen bg-background text-white flex flex-col">
        {/* 헤더 */}
        <Header />

        {/* 본문 */}
        <div className="flex flex-1">
          <Sidebar />
          <aside className="w-60 bg-dashboard-highlight border-r border-dashboard-gray/30 p-4 text-sm">
            <p className="text-xs text-dashboard-gray mb-2">Files</p>
            <FileTree data={mockFileTree} />
          </aside>

          <main className="flex-1 p-6 overflow-y-auto">
            <EditorWorkspace />
          </main>
        </div>
        {/* 우측 하단 채팅 버튼 */}
        <ChatButton />
      </div>
    </FileProvider>
  );
};

export default WorkspacePage;

// const App = () => {
//   return (
//     <Parent>
//       <Children />
//     </Parent>
//   )
// }

// const Counter = ({ children }) => {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       {count}
//       <button onClick={() => {
//         setCount((prev) => prev + 1)
//       }}>
//         button
//       </button>
//       {children}
//     </>
//   )
// }

// const Children = () => {
//   return (
//     <div>fdasfds</div>
//   )
// }

// setSelectedFile((prev) => {
//   // 사이드 이펙트를 만들면 안됨.
//   // 다른 state를 업데이트 한다던가
//   // 렌더에 뭔가 영향을 주는 동작을 하려고 한다던가
//   // 아무튼 다음 selectedFile을 계산하는 로직이랑 관련 없는 동작을 여기 넣으면 안됩니다.

//   // 리액트 고장남.

//   // 순수 함수

//   return
// })
