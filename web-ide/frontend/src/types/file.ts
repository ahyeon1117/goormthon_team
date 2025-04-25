import { Cell } from './cell';

export interface FileLeaf {
  id: number;
  name: string;
  type: 'file';
  project_id: number;
  folder_id: number;
  content: Content;
}

export interface FolderNode {
  folderId: number;
  folderName: string;
  parentId: number | null;
  projectId: number;
  files?: FileLeaf[];
  children?: FolderNode[];
}

export interface Content {
  cells: Cell[];
}

// export interface File {
//   id: number;
//   name: string;
//   content: string[];
// }

// export interface Folder {
//   folderId: number;
//   folderName: string;
//   files: File[];
//   folders: Folder[];
// }
