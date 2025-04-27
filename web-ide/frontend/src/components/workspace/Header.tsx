import { useState, useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import rocketIcon from '../../assets/rocket-icon.svg';
import { useFile } from '../../hooks/useFile';
import KernelCreateButton from '../kernel/KernelCreateButton';
import { createCell } from '../../api/cell';

const Header = () => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const { addCell, selectedFile } = useFile();

  const handleAddCode = async () => {
    if (!selectedFile) return;
    try {
      const newCell = await createCell(selectedFile.id, {
        cell_type: 'code',
        source: ''
      });
      console.log('New cell created:', newCell);
      addCell('code');
    } catch (error) {
      console.error('Failed to create cell:', error);
    }
  };

  const handleAddMarkdown = () => addCell('markdown');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
        setIsFileMenuOpen(false);
      }
    };
    if (isFileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFileMenuOpen]);

  return (
    <header className="w-full h-14 pr-6 pl-2 border-b border-dashboard-gray/30 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <img src={rocketIcon} alt="Rocket Logo" className="w-12 h-12" />
          <span className="text-base font-semibold text-white">
            로켓방정식 프로젝트
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-dashboard-gray">
        <button className="hover:text-white">멤버 추가</button>
        <KernelCreateButton />
        <button onClick={handleAddCode} className="hover:text-white">
          + Code
        </button>
        <button onClick={handleAddMarkdown} className="hover:text-white">
          + Text
        </button>
        <FiUser className="text-xl hover:text-white cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
