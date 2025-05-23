import ReactDOM from 'react-dom';
import { useEffect } from 'react';

type Props = {
  x: number;
  y: number;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
};

const FileDropdownMenu = ({ x, y, onClose, onRename, onDelete }: Props) => {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [onClose]);

  return ReactDOM.createPortal(
    <ul
      className="absolute bg-dashboard-background border border-gray-600 rounded shadow text-sm text-white/60"
      style={{ top: y, left: x, zIndex: 9999 }}
    >
      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onRename}>
        이름 변경
      </li>
      <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={onDelete}>
        삭제
      </li>
    </ul>,
    document.body,
  );
};

export default FileDropdownMenu;
