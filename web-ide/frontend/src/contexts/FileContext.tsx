// src/contexts/FileContext.tsx
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { FileContext, FileContextType } from './FileContextType';
import { FileLeaf } from '../types/file';
import { getNotebookContent } from '../api/notebook';
import { executeCell } from '../api/cell';
import { useContext } from 'react';


export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};


export const FileProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFile, setSelectedFile] = useState<FileLeaf | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kernelId, setKernelId] = useState<string | null>(null);  // 커널 ID 상태 추가

  useEffect(() => {
    const loadNotebookContent = async (fileId: string) => {
      if (selectedFile) {
        try {
          setError(null);
          const content = await getNotebookContent(selectedFile.id);
          setSelectedFile(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              content: {
                cells: content.cells.map(cell => ({
                  ...cell,
                  execution_count: cell.execution_count ?? null,
                  outputs: cell.outputs?.map(output => ({
                    name: (output.name === 'stdout' || output.name === 'stderr' || output.name === 'result') 
                      ? output.name 
                      : 'stdout', // 기본값으로 'stdout' 사용
                    text: output.text || []
                  })) || []
                }))
              }
            } as FileLeaf;
          });
        } catch (error) {
          console.error('노트북 내용 로드 실패:', error);
          setError(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.');
        }
      }
    };

    loadNotebookContent();
  }, [selectedFile?.id]);

  const handleChange: FileContextType['handleChange'] = (id, content) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      const updatedCells = cells.map((cell) =>
        cell.metadata.id === id ? { ...cell, source: content } : cell,
      );
      return { ...prev, content: { ...prev.content, cells: updatedCells } } as FileLeaf;
    });
  };

const handleExecute: FileContextType['handleExecute'] = async (cellId) => {
  if (!selectedFile || !kernelId) {
    console.error("실행 불가: selectedFile 또는 kernelId가 없습니다.", { selectedFile, kernelId });
    return Promise.reject(new Error("selectedFile 또는 kernelId가 없습니다."));
  }

  try {
    setError(null);
    const cell = selectedFile.content?.cells.find(c => c.metadata.id === cellId);
    if (!cell) {
      console.error("실행 불가: cellId에 해당하는 cell을 찾을 수 없습니다.", cellId);
      return Promise.reject(new Error("cellId에 해당하는 cell을 찾을 수 없습니다."));
    }

    const code = cell.source.join('\n');
    
    // 요청 파라미터를 API 호출 전에 로그로 출력합니다.
    console.log("Kernel ID:", kernelId);
    console.log("Code:", code);
    console.log("Cell ID:", cellId);
    console.log("File ID:", selectedFile.id);
    
    const result = await executeCell(kernelId, code, cellId, selectedFile.id);
    
    setSelectedFile(prev => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      const updatedCells = cells.map(c => {
        if (c.metadata.id === cellId) {
          return {
            ...c,
            execution_count: (c.execution_count ?? 0) + 1,
            outputs: [
              {
                name: 'stdout' as const,
                text: [result.stdout || '']
              },
              {
                name: 'stderr' as const,
                text: [result.stderr || '']
              },
              {
                name: 'result' as const,
                text: [result.result ? JSON.stringify(result.result) : '']
              }
            ]
          };
        }
        return c;
      });
      return { ...prev, content: { ...prev.content, cells: updatedCells } } as FileLeaf;
    });

    return Promise.resolve(result);
  } catch (error) {
    console.error('셀 실행 실패:', error);
    setError(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.');
    return Promise.reject(error);
  }
};

  const addCell: FileContextType['addCell'] = (type) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      const newCell = {
        cell_type: type,
        execution_count: null,
        id: nanoid(),
        metadata: {
          id: nanoid(),
          last_run: undefined
        },
        outputs: [],
        source: ['']
      };
      return {
        ...prev,
        content: { ...prev.content, cells: [...cells, newCell] },
      } as FileLeaf;
    });
  };

  const handleMoveUp: FileContextType['handleMoveUp'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev || index === 0) return prev;
      const cells = prev.content?.cells ?? [];
      if (index === 0) return prev;
      const newCells = [...cells];
      [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
      return { ...prev, content: { cells: newCells } } as FileLeaf;
    });
  };

  const handleMoveDown: FileContextType['handleMoveDown'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      if (index === cells.length - 1) return prev;
      const newCells = [...cells];
      [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
      return { ...prev, content: { cells: newCells } } as FileLeaf;
    });
  };

  const handleDelete: FileContextType['handleDelete'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      const newCells = cells.filter((_, i) => i !== index);
      return { ...prev, content: { cells: newCells } } as FileLeaf;
    });
  };

  return (
    <FileContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
        handleChange,
        addCell,
        handleMoveUp,
        handleMoveDown,
        handleDelete,
        handleExecute,
        error,
        kernelId,     // 커널 ID 추가
        setKernelId   // 커널 ID 설정 함수 추가
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
