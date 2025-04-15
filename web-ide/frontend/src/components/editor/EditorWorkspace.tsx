import { EditorCell } from './EditorCell';
import { Cell } from '../../types/cell';

type Props = {
  cells: Cell[];
  onChange: (id: string, content: string[]) => void;
};

function EditorWorkspace({ cells, onChange }: Props) {
  return (
    <div className="space-y-6">
      {cells.length === 0 ? (
        <p className="text-dashboard-gray text-sm">Code와 Text를 추가해보세요!</p>
      ) : (
        cells.map((cell) => (
          <div key={cell.metadata.id}>
            <EditorCell cell={cell} onChange={onChange} />
          </div>
        ))
      )}
    </div>
  );
}

export default EditorWorkspace;
