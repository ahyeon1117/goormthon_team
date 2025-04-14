export type Cell = {
  cell_type: "code" | "markdown";
  source: string[];
  metadata: {
    id: string;
  };
  execution_count: number | null; // 수정 필 return type
  outputs: any[];
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