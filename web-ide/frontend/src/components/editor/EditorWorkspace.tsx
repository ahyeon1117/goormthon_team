import { EditorCell } from './EditorCell';
import { Cell } from '../../types/cell';

type Props = {
  cells: Cell[];
  onChange: (id: string, content: string[]) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (index: number) => void;
};

function EditorWorkspace({ cells, onChange, onMoveUp, onMoveDown, onDelete }: Props) {
  return (
    <div className="space-y-6">
      {cells.length === 0 ? (
        <p className="text-dashboard-gray text-sm">
          Code와 Text를 추가해보세요!
        </p>
      ) : (
        cells.map((cell, index) => {
          const key = `${cell.metadata.id}-${index}`;
          console.log(key);
        
          
          return (
          <EditorCell
          key={`${cell.metadata.id}-${index}`}
            cell={cell}
            onChange={onChange}
            onMoveUp={() => onMoveUp(index)}
            onMoveDown={() => onMoveDown(index)}
            onDelete={() => onDelete(index)}
          />
        )})
      )}
    </div>
  );
}

export default EditorWorkspace;
