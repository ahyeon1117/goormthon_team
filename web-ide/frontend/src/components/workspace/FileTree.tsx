import { FolderNode } from '../../types/file';
import { FolderItem } from './FolderItem';
import { useSearchParams } from 'react-router-dom';
import { useDropdown } from '../../contexts/DropdownContext';
import { useFileActions } from '../../hooks/useFileActions';
import { useFolderActions } from '../../hooks/useFolderActions';
import DropdownMenu from '../common/DropdownMenu';
import FileDropdownMenu from '../common/FileDropdownMenu';

export const FileTree = ({ data, onRefresh }: { data: FolderNode[]; onRefresh: () => void }) => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const { dropdown, closeDropdown } = useDropdown();

  const folderActions = useFolderActions(data, projectId, onRefresh, closeDropdown);
  const fileActions = useFileActions(projectId, onRefresh, closeDropdown);

  return (
    <>
      <ul className="space-y-1">
        {data.map((folder) => (
          <FolderItem key={folder.folderId} folder={folder} onRefresh={onRefresh} />
        ))}
      </ul>

      {dropdown.visible && dropdown.type === 'folder' && dropdown.id !== null && (
        <DropdownMenu
          x={dropdown.x}
          y={dropdown.y}
          onClose={closeDropdown}
          onCreate={() => folderActions.handleCreateSubFolder(dropdown.id!)}
          onCreateFile={() => fileActions.handleCreateFile(dropdown.id!)}
          onRename={() => folderActions.handleRename(dropdown.id!)}
          onDelete={() => folderActions.handleDelete(dropdown.id!)}
        />
      )}
      {dropdown.visible && dropdown.type === 'file' && dropdown.id !== null && (
        <FileDropdownMenu
          x={dropdown.x}
          y={dropdown.y}
          onClose={closeDropdown}
          onRename={() => fileActions.handleRenameFile(dropdown.id!)}
          onDelete={() => fileActions.handleDeleteFile(dropdown.id!)}
        />
      )}
    </>
  );
};
