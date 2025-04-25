import { useState } from 'react';
import { FolderNode } from '../../types/file';
import { FiFolder, FiFile, FiFolderMinus } from 'react-icons/fi';
import { useFile } from '../../hooks/useFile';
import { useSearchParams } from 'react-router-dom';
import { createFolder, updateFolderName, deleteFolder } from '../../api/folder';
import { useDropdown } from '../../contexts/DropdownContext';
import DropdownMenu from '../common/DropdownMenu';

export const FileTree = ({ data, onRefresh }: { data: FolderNode[]; onRefresh: () => void }) => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const { dropdown, closeDropdown } = useDropdown();

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
      await createFolder({
        folderName: name,
        projectId: Number(projectId),
        parentId: folderId,
      });
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
      await updateFolderName({
        folderId,
        projectId: Number(projectId),
        newName: name,
      });
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

  return (
    <>
      <ul className="space-y-1">
        {data.map((folder) => (
          <FolderItem key={folder.folderId} folder={folder} onRefresh={onRefresh} />
        ))}
      </ul>

      {dropdown.visible && dropdown.folderId !== null && (
        <DropdownMenu
          x={dropdown.x}
          y={dropdown.y}
          onClose={closeDropdown}
          onCreate={() => handleCreateSubFolder(dropdown.folderId!)}
          onRename={() => handleRename(dropdown.folderId!)}
          onDelete={() => handleDelete(dropdown.folderId!)}
        />
      )}
    </>
  );
};

const FolderItem = ({ folder, onRefresh }: { folder: FolderNode; onRefresh: () => void }) => {
  const [open, setOpen] = useState(true);
  const { setSelectedFile } = useFile();
  const { openDropdown } = useDropdown();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openDropdown(e.clientX, e.clientY, folder.folderId);
  };

  return (
    <li>
      <div
        onContextMenu={handleContextMenu}
        className="flex items-center gap-2 text-sm text-dashboard-gray hover:text-white cursor-pointer"
      >
        <button onClick={() => setOpen((prev) => !prev)} className="flex gap-1 items-center">
          {open ? <FiFolderMinus /> : <FiFolder />} {folder.folderName}
        </button>
      </div>

      {open && (
        <ul className="pl-4 mt-1">
          {folder.files?.map((file) => (
            <li key={file.id}>
              <button
                onClick={() => setSelectedFile(file)}
                className="flex items-center gap-1 text-sm text-dashboard-gray hover:text-white pl-5"
              >
                <FiFile /> {file.name}
              </button>
            </li>
          ))}
          {folder.children?.map((subFolder) => (
            <FolderItem key={subFolder.folderId} folder={subFolder} onRefresh={onRefresh} />
          ))}
        </ul>
      )}
    </li>
  );
};
