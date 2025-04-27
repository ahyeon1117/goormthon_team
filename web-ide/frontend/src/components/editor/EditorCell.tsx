import {
  useRef,
  useEffect,
  useState,
  ReactNode,
  MouseEventHandler,
} from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import type { Cell, CellOutput } from '../../types/cell';
import { FiPlay, FiLoader } from 'react-icons/fi';

type Props = {
  children: ReactNode;
  cell: Cell;
  onChange: (id: string, content: string[]) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onExecute?: (cellId: string) => void;
  isExecuting?: boolean;
};

// 출력 결과를 보여주는 컴포넌트
export const CellOutputDisplay = ({ outputs }: { outputs: CellOutput[] }) => {
  if (!outputs || outputs.length === 0) return null;

  return (
    <div className="mt-2 p-4 bg-gray-800 rounded-lg">
      {outputs.map((output, index) => (
        <div key={index} className="font-mono text-sm">
          {output.name === 'stderr' && output.text.join('').trim() && (
            <div className="text-red-500 mb-2">
              <div className="font-bold mb-1">오류:</div>
              <div>{output.text.join('')}</div>
            </div>
          )}
          {output.name === 'stdout' && output.text.join('').trim() && (
            <div className="text-green-300 mb-2">
              <div className="font-bold mb-1">출력:</div>
              <div>{output.text.join('')}</div>
            </div>
          )}
          {output.name === 'result' && output.text.join('').trim() && (
            <div className="text-blue-300 mb-2">
              <div className="font-bold mb-1">결과:</div>
              <div>{output.text.join('')}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export function EditorCell({ children, onExecute, isExecuting, cell }: Props) {
  return (
    <div className="relative">
      {onExecute && (
        <button
          className="absolute left-0 top-0 p-1 rounded-lg bg-blue-500 hover:bg-blue-700 transition-colors duration-200 z-10"
          onClick={() => onExecute(cell.id)}
          disabled={isExecuting}
        >
          {isExecuting ? (
            <FiLoader className="w-5 h-5 text-green-500 animate-spin" />
          ) : (
            <FiPlay className="w-5 h-5 text-white" />
          )}
        </button>
      )}
      <div className="relative group">{children}</div>
    </div>
  );
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
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorMount}
      theme="vs-dark"
      height={editorHeight}
      options={{
        wordWrap: "on",
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
        },
        lineNumbers: "on",
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
  MoveUp: ({ onClick }: { onClick: MouseEventHandler }) => (
    <button onClick={onClick}>↑</button>
  ),
  MoveDown: ({ onClick }: { onClick: MouseEventHandler }) => (
    <button onClick={onClick}>↓</button>
  ),
  Delete: ({ onClick }: { onClick: MouseEventHandler }) => (
    <button onClick={onClick}>✕</button>
  ),
};
