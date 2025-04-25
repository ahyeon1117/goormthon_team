import { useState } from 'react';
import { FiFolder, FiFolderMinus, FiFile } from 'react-icons/fi';
import { useFile } from '../../hooks/useFile';
import { useDropdown } from '../../contexts/DropdownContext';
import { FolderNode } from '../../types/file';

export const FolderItem = ({
  folder,
  onRefresh,
}: {
  folder: FolderNode;
  onRefresh: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const { setSelectedFile } = useFile();
  const { openDropdown } = useDropdown();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openDropdown(e.clientX, e.clientY, folder.folderId, 'folder');
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
                onContextMenu={(e) => {
                  e.preventDefault();
                  openDropdown(e.clientX, e.clientY, file.id, 'file');
                }}
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
