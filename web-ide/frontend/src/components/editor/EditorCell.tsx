import { Cell } from '../../types/cell';
import MonacoEditor from '@monaco-editor/react';

type Props = {
  cell: Cell;
  onChange: (id: string, content: string) => void;
};

export const EditorCell = ({cell, onChange}: Props) => {
  const handleChange = (value: string) => {
    onChange(cell.metadata.id, value);
  };

  return cell.cell_type === 'code' ? (
    <MonacoEditor
      language="python"
      value={cell.source[0] || ''}
      onChange={(value) => handleChange(value || '')}
      theme="vs-dark"
      height="100px"
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
      value={cell.source[0] || ''}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}