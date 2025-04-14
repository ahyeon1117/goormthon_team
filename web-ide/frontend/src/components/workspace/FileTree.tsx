import { useState } from 'react';
import { FileNode, FolderNode, FileLeaf } from '../../types/file';
import { FiFolder, FiFile, FiFolderMinus } from 'react-icons/fi';

type Props = {
  data: FileNode[];
  onSelectFile: (file: FileLeaf) => void
};

export const FileTree = ({ data, onSelectFile }: Props) => {
  return(
    <ul className='space-y-1'>
      {data.map((node) => (
        <FileTreeNode key= {node.id} node={node} onSelectFile={onSelectFile} />
      ))}
    </ul>
  )
}

const FileTreeNode = ({
  node,
  onSelectFile
}: {
  node: FileNode;
  onSelectFile: (file: FileLeaf) => void;
}) => {
  const [open, setOpen] = useState(true);

  if(node.type === 'folder') {
    return(
      <li>
        <button onClick={() => setOpen((prev) => !prev)} className='flex items-center gap-1 text-sm text-dashboard-gray hover:text-white'>
          {open ?<FiFolderMinus /> : <FiFolder />}
          {node.name}
        </button>
        {open && node.children && (
          <ul className='pl-4 mt-1'>
            {node.children.map((child)=>(
              <FileTreeNode key={child.id} node={child} onSelectFile={onSelectFile} />
            ))}
          </ul>
        )}
      </li>
    )
  }
  if(node.type === 'file') {
    return (
      <li>
        <button onClick={() => onSelectFile(node)} className='flex items-center gap-1 text-sm text-dashboard-gray hover:text-white pl-5'>
          <FiFile/>
          {node.name}
        </button>
      </li>
    )
  }

  return null;
}
