import { useRef, useEffect, useState } from 'react'

import { Cell } from '../../types/cell';
import MonacoEditor, {OnMount} from '@monaco-editor/react';

type Props = {
  cell: Cell;
  onChange: (id: string, content: string[]) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
};

export const EditorCell = ({cell, onChange, onMoveUp, onMoveDown, onDelete}: Props) => {
  const editorRef = useRef<any>(null);
  const [editorHeight, setEditorHeight] = useState(20);
  const MAX_HEIGHT = 400; // 최대 높이 제한

  const handleChange = (value: string) => {
    const lines = value.split('\n');
    onChange(cell.metadata.id, lines);
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // 내부 콘텐츠(코드 줄 수)에 따른 에디터 높이 조절
    const updateHeight = () => {
      const contentHeight = editor.getContentHeight();
      if (contentHeight > 20) {
        setEditorHeight(Math.min(contentHeight, MAX_HEIGHT));
        editor.layout(); // 강제 layout
      }
    };
    editor.onDidContentSizeChange(updateHeight);
  };


  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const joinedSource = cell.source.join('\n');

  useEffect(() => {
    if(textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [joinedSource]);

  return (
    <div className='relative group'>
    {cell.cell_type === 'code' ? (
    <MonacoEditor
      language="python"
      value={joinedSource}
      onChange={(value) => handleChange(value || '')}
      onMount={handleEditorMount}
      theme="vs-dark"
      height={editorHeight}
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        scrollbar: {
          vertical: 'auto', horizontal: 'auto',
        },
        lineNumbers: 'on'
      }}
    />
  ) : (
    <textarea
      ref={textareaRef}
      className="w-full bg-background text-dashboard-gray border border-dashboard-gray/30 rounded-lg p-2 font-mono"
      value={joinedSource}
      onChange={(e) => handleChange(e.target.value)}
    />
  )}
  <div className="absolute right-2 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition">
      <button onClick={onMoveUp}>↑</button>
      <button onClick={onMoveDown}>↓</button>
      <button onClick={onDelete}>✕</button>
    </div>
  </div>
);
}