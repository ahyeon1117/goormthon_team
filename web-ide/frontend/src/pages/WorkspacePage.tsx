import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Cell } from '../types/cell';

import Header from '../components/workspace/Header';
import Sidebar from '../components/workspace/Sidebar';
import FileTree from '../components/workspace/FileTree';
import EditorWorkspace from '../components/editor/EditorWorkspace';
import ChatButton from '../components/workspace/ChatButton';



const WorkspacePage = () => {
  const [cells, setCells] = useState<Cell[]>([]);

  const handleChange = (id: string, content: string) => {
    setCells(prev =>
      prev.map(cell => (cell.id === id ? { ...cell, content } : cell))
    );
  };

  const addCell = (type: 'code' | 'markdown') => {
    const newCell: Cell = {
      id: nanoid(),
      type,
      content: '',
    };
    setCells(prev => [...prev, newCell]);
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* 헤더 */}
      <Header onAddCell={addCell} />

      {/* 본문 */}
      <div className="flex flex-1">
        <Sidebar />
        <FileTree />
        <main className="flex-1 p-6 overflow-y-auto">
          <EditorWorkspace cells={cells} onChange={handleChange} />
        </main>
      </div>

      {/* 우측 하단 채팅 버튼 */}
      <ChatButton />
    </div>
  );
};

export default WorkspacePage;
