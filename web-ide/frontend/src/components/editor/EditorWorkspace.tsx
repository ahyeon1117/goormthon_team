import { EditorCell, CellOutputDisplay } from './EditorCell';
import { useFile } from '../../hooks/useFile';
import { useState } from 'react';

function EditorWorkspace() {
  const { selectedFile, handleChange, handleMoveUp, handleMoveDown, handleDelete, handleExecute, kernelId } = useFile();
  const [executingCells, setExecutingCells] = useState<{[key: string]: boolean}>({});

  if (!selectedFile) return null;

  const cells = selectedFile.content?.cells || [];
  
  // 디버깅용 로그 추가
  console.log("EditorWorkspace - kernelId:", kernelId);
  console.log("EditorWorkspace - selectedFile:", selectedFile);

  const handleCellExecute = (cellId: string) => {
    console.log("실행 버튼 클릭 - cellId:", cellId);
    console.log("실행 전 - kernelId:", kernelId);
    console.log("실행 전 - selectedFile:", selectedFile);
    
    if (!kernelId) {
      alert("커널이 연결되어 있지 않습니다. 먼저 커널을 연결해주세요.");
      return;
    }
    
    // 셀 실행 상태 업데이트
    setExecutingCells(prev => ({ ...prev, [cellId]: true }));
    
    // 실행 후 실행 상태 업데이트
    handleExecute(cellId).finally(() => {
      setExecutingCells(prev => ({ ...prev, [cellId]: false }));
    });
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="space-y-6 p-4">
        {cells.map((cell, index) => {
          const joined = cell.source.join('\n');
          const isExecuting = executingCells[cell.metadata.id] || false;

          const onChange = (value: string) => {
            handleChange(cell.metadata.id, value.split('\n'));
          };

          return (
            <div key={`${cell.metadata.id}-${index}`} className="border-l-2 border-gray-500 pl-2">
              <EditorCell
                cell={cell}
                onChange={handleChange}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                onDelete={() => handleDelete(index)}
                onExecute={cell.cell_type === 'code' ? handleCellExecute : undefined}
                isExecuting={isExecuting}
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
              
              {/* 셀 출력 결과 표시 */}
              {cell.outputs && cell.outputs.length > 0 && (
                <CellOutputDisplay outputs={cell.outputs} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EditorWorkspace;
