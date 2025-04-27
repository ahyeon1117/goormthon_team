const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export interface CreateCellRequest {
  cell_type: 'code' | 'text';
  source: string;
}

export interface CreateCellResponse {
  cell_id: string;
}

export interface CellExecutionResponse {
    cell_id: string;
    code: string;
    stdout: string | null;     // print 출력 (있으면 채워지고, 없으면 null)
    stderr: string | null;     // 에러 메시지 (있으면 채워지고, 없으면 null)
    result: any | null; 
}

export const createCell = async (
  fileId: number,
  cellData: CreateCellRequest
): Promise<CreateCellResponse> => {
  const response = await fetch(`${BASE_URL}/api/v1/codecell/add?fileId=${fileId}`, 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cellData),
  });

  if (!response.ok) {
    throw new Error('Failed to create cell');
  }

  return response.json();
};


 
export const executeCell = async (
    kernelId: string,
    code: string,
    cellId: string,
    fileId: number | undefined, // fileId가 undefined일 수 있기 때문에 | undefined 추가
  ): Promise<CellExecutionResponse> => {
    // fileId가 유효한지 먼저 확인
    if (fileId === undefined) {
      throw new Error('fileId가 유효하지 않습니다');
    }

    console.log("Sending request to:", `${BASE_URL}/api/v1/execute?fileId=${fileId}`);
    console.log("Kernel ID:", kernelId);
    console.log("Code:", code);
    console.log("Cell ID:", cellId);
    console.log("File ID:", fileId);

    const response = await fetch(`${BASE_URL}/api/v1/execute?fileId=${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kernel_id: kernelId,
        code: code,
        cell_id: cellId
      }),
    });
    
    if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error Response:', errorResponse);  // 에러 응답 로그
        throw new Error('Failed to execute cell');
      }
      
      return response.json();
  };

