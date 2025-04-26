// Auth
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SingupResponse {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  username: string;
  userId: number;
}

// User
export interface UpdateUserRequest {
  username?: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserResponse {
  id: number;
  username: string;
  email: string;
}

// Project , ./context/ProjectContextType에 Project있습니다
export interface CreateProjectRequest {
  name: string;
}

export interface ProjectCreateResponse {
  projectId: number;
  name: string;
  ownerId: number;
}

// Folder
export interface CreateFolderRequest {
  folderName: string;
  projectId: number;
  parentId?: number;
}

export interface UpdateFolderNameRequest {
  folderId: number;
  projectId: number;
  newName: string;
}

export interface DeleteFolderRequest {
  folderId: number;
  folderName: string;
  parentId?: number;
  projectId: number;
}

// File
export interface CreateFileRequest {
  fileName: string;
  projectId: number;
  folderId: number;
}

export interface FileResponse {
  fileId: number;
  fileName: string;
  folderId: number;
  projectId: number;
}

export interface UpdateFileNameRequest {
  fileId: number;
  newName: string;
}

// Kernel
export interface KernelResponse {
  id: string;
  name: string;
  connections: number;
  last_activity: string;
  execution_state: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// Chat
export interface ChatRoomResponse {
  id: number;
  name: string;
  projectId: number;
}

export interface ChatMessageDTO {
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
}