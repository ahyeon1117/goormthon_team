import { Content } from '../types/file';

const mockContent: Content = {
  cells: [
    {
      cell_type: 'code',
      source: ['a = 10'],
      metadata: {
        id: '1'
      },
      execution_count: null,
      outputs: []
    },
    {
      cell_type: 'markdown',
      source: ['변수 선언'],
      metadata: {
        id: '2'
      },
      execution_count: null,
      outputs: []
    }
  ]
};

export default mockContent;
