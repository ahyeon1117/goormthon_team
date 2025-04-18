import { EditorCell } from './EditorCell';
import { useFile } from '../../contexts/useFile';

function EditorWorkspace() {
  const {
    selectedFile,
    handleChange,
    handleMoveUp,
    handleMoveDown,
    handleDelete,
  } = useFile();

  if (!selectedFile) return null;

  const cells = selectedFile.content.cells;

  return (
    <div className="space-y-6">
      {cells.map((cell, index) => {
        const joined = cell.source.join('\n');

        const onChange = (value: string) => {
          handleChange(cell.metadata.id, value.split('\n'));
        };

        return (
          <EditorCell
            key={`${cell.metadata.id}-${index}`}
            cell={cell}
            onChange={handleChange}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            onDelete={() => handleDelete(index)}
          >
            {cell.cell_type === 'code' ? (
              <EditorCell.Code value={joined} onChange={onChange} />
            ) : (
              <EditorCell.Text value={joined} onChange={onChange} />
            )}

            <div className="absolute right-2 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <EditorCell.Action.MoveUp onClick={() => handleMoveUp(index)} />
              <EditorCell.Action.MoveDown onClick={() => handleMoveDown(index)} />
              <EditorCell.Action.Delete onClick={() => handleDelete(index)} />
            </div>
          </EditorCell>
        );
      })}
    </div>
  );
}

export default EditorWorkspace;
