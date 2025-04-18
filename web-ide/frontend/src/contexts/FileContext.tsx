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
      const updatedCells = prev.content.cells.map((cell) =>
        cell.metadata.id === id ? { ...cell, source: content } : cell,
      );
      return { ...prev, content: { ...prev.content, cells: updatedCells } };
    });
  };

  const addCell: FileContextType['addCell'] = (type) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const newCell = {
        cell_type: type,
        source: [''],
        metadata: { id: nanoid() },
        execution_count: null,
        outputs: [],
      };
      return {
        ...prev,
        content: { ...prev.content, cells: [...prev.content.cells, newCell] },
      };
    });
  };

  const handleMoveUp: FileContextType['handleMoveUp'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev || index === 0) return prev;
      const newCells = [...prev.content.cells];
      [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
      return { ...prev, content: { ...prev.content, cells: newCells } };
    });
  };

  const handleMoveDown: FileContextType['handleMoveDown'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev || index === prev.content.cells.length - 1) return prev;
      const newCells = [...prev.content.cells];
      [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
      return { ...prev, content: { ...prev.content, cells: newCells } };
    });
  };

  const handleDelete: FileContextType['handleDelete'] = (index) => {
    setSelectedFile((prev) => {
      if (!prev) return prev;
      const newCells = prev.content.cells.filter((_, i) => i !== index);
      return { ...prev, content: { ...prev.content, cells: newCells } };
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
