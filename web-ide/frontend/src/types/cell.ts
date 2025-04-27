export type CellOutput = {
  name: 'stdout' | 'stderr' | 'result';  // 출력 타입
  text: string[];
};

export type CellExecutionResult = {
  code: string;
  stdout: string;
  stderr: string;
  result: string | null;
  cell_id: string;
};



export type Cell = {
  cell_type: "code" | "markdown";
  execution_count: number | null;
  id: string;
  metadata: {
    id: string;
    last_run?: string;
  };
  outputs: CellOutput[];
  source: string[];
};

export interface Content {
  cells: Cell[];
}

// export interface IDEFile {
//   id: string;
//   name: string;
//   content: Content;
//   folder_id: number;
//   project_id: number;
//   created_at: string;
//   updated_at: string;
// }