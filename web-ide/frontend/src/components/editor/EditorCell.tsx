import { useRef, useEffect, useState, ReactNode, MouseEventHandler } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { Cell } from '../../types/cell';

type Props = {
  children: ReactNode;
  cell: Cell;
  onChange: (id: string, content: string) => void;
};

export function EditorCell({ children }: Props) {
  return <div className="relative group">{children}</div>;
}

EditorCell.Code = function CodeCell({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<any>(null);
  const [editorHeight, setEditorHeight] = useState(20);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // 내부 콘텐츠(코드 줄 수)에 따른 에디터 높이 조절
    const updateHeight = () => {
      const contentHeight = editor.getContentHeight();
      if (contentHeight > 20) {
        setEditorHeight(contentHeight);
        editor.layout(); // 강제 layout
      }
    };
    editor.onDidContentSizeChange(updateHeight);
  };
  return (
    <MonacoEditor
      language="python"
      value={value}
      onChange={(value) => onChange(value || '')}
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
          vertical: 'auto',
          horizontal: 'auto',
        },
        lineNumbers: 'on',
        padding: {
          top: 5,
          bottom: 5,
        },
      }}
    />
  );
};

EditorCell.Text = function TextCell({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const textarearef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textarearef.current) {
      textarearef.current.style.height = 'auto';
      textarearef.current.style.height = `${textarearef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textarearef}
      className="w-full bg-background text-dashboard-gray border border-dashboard-gray/30 rounded-lg p-2 font-mono"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

EditorCell.Action = {
  MoveUp: ({ onClick }: { onClick: MouseEventHandler }) => <button onClick={onClick}>↑</button>,
  MoveDown: ({ onClick }: { onClick: MouseEventHandler }) => <button onClick={onClick}>↓</button>,
  Delete: ({ onClick }: { onClick: MouseEventHandler }) => <button onClick={onClick}>✕</button>,
};
