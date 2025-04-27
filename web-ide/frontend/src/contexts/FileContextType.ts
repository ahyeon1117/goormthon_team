import { createContext } from 'react';
import { FileLeaf } from '../types/file';
import { CellExecutionResponse } from '../api/cell';

export type FileContextType = {
  selectedFile: FileLeaf | null;
  setSelectedFile: (file: FileLeaf | null) => void;
  handleChange: (id: string, content: string[]) => void;
  addCell: (type: 'code' | 'markdown') => void;
  handleMoveUp: (index: number) => void;
  handleMoveDown: (index: number) => void;
  handleDelete: (index: number) => void;
  handleExecute: (cellId: string) => Promise<CellExecutionResponse | void>;
  error: string | null;
  kernelId: string | null;
  setKernelId: (id: string) => void;
};

export const FileContext = createContext<FileContextType | null>(null);
