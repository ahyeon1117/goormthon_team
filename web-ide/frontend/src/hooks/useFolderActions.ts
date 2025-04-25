import { createFolder, updateFolderName, deleteFolder } from '../api/folder';
import { FolderNode } from '../types/file';

export const useFolderActions = (
  data: FolderNode[],
  projectId: string | null,
  onRefresh: () => void,
  closeDropdown: () => void,
) => {
  const findFolderById = (node: FolderNode, id: number): FolderNode | null => {
    if (node.folderId === id) return node;
    if (!node.children) return null;
    for (const child of node.children) {
      const found = findFolderById(child, id);
      if (found) return found;
    }
    return null;
  };

  const handleCreateSubFolder = async (folderId: number) => {
    const name = prompt('새 폴더 이름을 입력해주세요');
    if (!name || !projectId) return;
    try {
      await createFolder({ folderName: name, projectId: Number(projectId), parentId: folderId });
      onRefresh();
    } catch (err) {
      console.log(err);
      alert('폴더 생성 실패');
    } finally {
      closeDropdown();
    }
  };

  const handleRename = async (folderId: number) => {
    const folder = findFolderById(data[0], folderId);
    if (!folder || !projectId) return;
    const name = prompt('새 이름을 입력해주세요', folder.folderName);
    if (!name || name === folder.folderName) return;

    try {
      await updateFolderName({ folderId, projectId: Number(projectId), newName: name });
      onRefresh();
    } catch (err) {
      console.log(err);
      alert('이름 변경 실패');
    } finally {
      closeDropdown();
    }
  };

  const handleDelete = async (folderId: number) => {
    const folder = findFolderById(data[0], folderId);
    if (!folder || !projectId || folder.parentId == null) return;
    if (!confirm(`'${folder.folderName}' 폴더를 삭제하시겠습니까?`)) return;

    try {
      await deleteFolder({
        folderId,
        folderName: folder.folderName,
        parentId: folder.parentId,
        projectId: Number(projectId),
      });
      onRefresh();
    } catch (err) {
      console.log(err);
      alert('삭제 실패');
    } finally {
      closeDropdown();
    }
  };

  return { handleCreateSubFolder, handleRename, handleDelete };
};
