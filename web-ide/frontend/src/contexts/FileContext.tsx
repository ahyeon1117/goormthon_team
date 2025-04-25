// src/contexts/FileContext.tsx
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { FileContext, FileContextType } from './FileContextType';
import { FileLeaf } from '../types/file';

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFile, setSelectedFile] = useState<FileLeaf | null>(null);

  const handleChange: FileContextType['handleChange'] = (id, content) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      const updatedCells = cells.map((cell) =>
        cell.metadata.id === id ? { ...cell, source: content } : cell,
      );
      return { ...prev, content: { ...prev.content, cells: updatedCells } };
    });
  };

  const addCell: FileContextType['addCell'] = (type) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      const newCell = {
        cell_type: type,
        source: [''],
        metadata: { id: nanoid() },
        execution_count: null,
        outputs: [],
      };
      return {
        ...prev,
        content: { ...prev.content, cells: [...cells, newCell] },
      };
    });
  };

  const handleMoveUp: FileContextType['handleMoveUp'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev || index === 0) return prev;
      const cells = prev.content?.cells ?? [];
      if (index === 0) return prev;
      const newCells = [...cells];
      [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
      return { ...prev, content: { cells: newCells } };
    });
  };

  const handleMoveDown: FileContextType['handleMoveDown'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      if (index === cells.length - 1) return prev;
      const newCells = [...cells];
      [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
      return { ...prev, content: { cells: newCells } };
    });
  };

  const handleDelete: FileContextType['handleDelete'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const cells = prev.content?.cells ?? [];
      const newCells = cells.filter((_, i) => i !== index);
      return { ...prev, content: { cells: newCells } };
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
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
