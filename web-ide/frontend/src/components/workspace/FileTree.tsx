import { useState } from 'react';
import { FileNode, FileLeaf } from '../../types/file';
import { FiFolder, FiFile, FiFolderMinus } from 'react-icons/fi';
import { useFile } from '../../hooks/useFile';

export const FileTree = ({ data }: { data: FileNode[] }) => {
  return (
    <ul className="space-y-1">
      {data.map((node) => (
        <FileTreeNode key={node.id} node={node} />
      ))}
    </ul>
  );
};

const FileTreeNode = ({ node }: { node: FileNode }) => {
  const [open, setOpen] = useState(true);
  const { setSelectedFile } = useFile();

  if (node.type === 'folder') {
    return (
      <li>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-1 text-sm text-dashboard-gray hover:text-white"
        >
          {open ? <FiFolderMinus /> : <FiFolder />}
          {node.name}
        </button>
        {open && node.children && (
          <ul className="pl-4 mt-1">
            {node.children.map((child) => (
              <FileTreeNode key={child.id} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  if (node.type === 'file') {
    return (
      <li>
        <button
          onClick={() => setSelectedFile(node as FileLeaf)}
          className="flex items-center gap-1 text-sm text-dashboard-gray hover:text-white pl-5"
        >
          <FiFile />
          {node.name}
        </button>
      </li>
    );
  }

  return null;
};
