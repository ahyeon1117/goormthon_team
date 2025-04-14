import { useState } from 'react';
import { nanoid } from 'nanoid';
import { FileLeaf } from '../types/file';
import { mockFileTree } from '../mock/mockFileTree';

import Header from '../components/workspace/Header';
import Sidebar from '../components/workspace/Sidebar';
import { FileTree } from '../components/workspace/FileTree';
import EditorWorkspace from '../components/editor/EditorWorkspace';
import ChatButton from '../components/workspace/ChatButton';


const WorkspacePage = () => {
  const [selectedFile, setSelectedFile] = useState<FileLeaf | null>(null);

  const handleChange = (id: string, content: string) => {
    if (!selectedFile) return;

    const updatedCells = selectedFile.content.cells.map((cell) =>
      cell.metadata.id === id ? { ...cell, source: [content] } : cell
    );

    setSelectedFile({
      ...selectedFile,
      content: { ...selectedFile.content, cells: updatedCells }
    });
  };

  const addCell = (type: 'code' | 'markdown') => {
    if (!selectedFile) return;

    const newCell = {
      cell_type: type,
      source: [''],
      metadata: { id: nanoid() },
      execution_count: null,
      outputs: []
    };

    setSelectedFile({
      ...selectedFile,
      content: {
        ...selectedFile.content,
        cells: [...selectedFile.content.cells, newCell]
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      
      {/* 헤더 */}
      <Header onAddCell={addCell} />

      {/* 본문 */}
      <div className="flex flex-1">
        <Sidebar />
        <aside className="w-60 bg-dashboard-highlight border-r border-dashboard-gray/30 p-4 text-sm">
          <p className="text-xs text-dashboard-gray mb-2">Files</p>
          <FileTree data={mockFileTree} onSelectFile={setSelectedFile} />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {selectedFile && selectedFile.type === 'file' ? (
            <EditorWorkspace
              cells={selectedFile.content.cells}
              onChange={handleChange}
            />
          ) : (
            <p className="text-dashboard-gray text-sm">파일을 선택하세요.</p>
          )}
        </main>
      </div>

      {/* 우측 하단 채팅 버튼 */}
      <ChatButton />
    </div>
  );
};

export default WorkspacePage;
