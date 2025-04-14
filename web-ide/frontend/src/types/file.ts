import { Cell } from './cell';

export type FileNode = FolderNode | FileLeaf;

export interface FolderNode {
  id: number;
  name: string;
  type: 'folder';
  project_id: number;
  children: FileNode[]; // 폴더인경우
}

export interface FileLeaf {
  id: number;
  name:string;
  type: 'file';
  project_id: number;
  folder_id: number;
  content: Content // 파일인경우
}

export interface Content {
  cells: Cell[];
}

