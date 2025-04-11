import { Cell } from '../../types/cell';
import MonacoEditor from '@monaco-editor/react';

type Props = {
  cell: Cell;
  onChange: (id: string, content: string) => void;
};

export const EditorCell = ({cell, onChange}: Props) => {
  return cell.type === 'code' ? (
    <MonacoEditor 
      language='python'
      value={cell.content}
      onChange={(value) => onChange(cell.id, value || '')}
      theme='vs-dark'
      height='100px'
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
      }}
    />
  ) : (
    <textarea 
      className="w-full bg-background text-dashboard-gray border border-dashboard-gray/30 rounded-lg p-2 font-mono"
      value={cell.content}
      onChange={(e) => onChange(cell.id, e.target.value)}
    />
  );
}