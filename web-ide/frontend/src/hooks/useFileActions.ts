import { createFile, updateFileName, deleteFile } from '../api/file';

export const useFileActions = (
  projectId: string | null,
  onRefresh: () => void,
  closeDropdown: () => void,
) => {
  const handleCreateFile = async (folderId: number) => {
    const fileName = prompt('새 파일 이름을 입력해주세요');
    if (!fileName || !projectId) return;

    try {
      await createFile({ fileName, projectId: Number(projectId), folderId });
      onRefresh();
    } catch {
      alert('파일 생성 실패');
    } finally {
      closeDropdown();
    }
  };

  const handleRenameFile = async (fileId: number) => {
    const newName = prompt('새 파일 이름을 입력해주세요');
    if (!newName || !projectId) return;

    try {
      await updateFileName({ fileId, newName });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('파일 이름 변경 실패');
    } finally {
      closeDropdown();
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('정말로 이 파일을 삭제하시겠습니까?')) return;
    try {
      await deleteFile(fileId);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('파일 삭제 실패');
    } finally {
      closeDropdown();
    }
  };

  return { handleCreateFile, handleRenameFile, handleDeleteFile };
};
