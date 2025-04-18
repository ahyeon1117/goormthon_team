import { FileNode } from '../types/file';
import mockContent from './mockContent';

export const mockFileTree: FileNode[] = [
  {
    id: 1,
    name: 'My Project',
    project_id: 1,
    type: 'folder',
    children: [
      {
        id: 10,
        name: 'src',
        type: 'folder',
        project_id: 1,
        children: [
          {
            id: 100,
            name: 'main.ipynb',
            type: 'file',
            project_id: 1,
            folder_id: 10,
            content: mockContent,
          }
        ]
      }
    ]
  }
];
