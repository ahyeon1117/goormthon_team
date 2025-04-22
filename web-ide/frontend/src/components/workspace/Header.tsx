import { useState, useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import rocketIcon from '../../assets/rocket-icon.svg';
import { useFile } from '../../contexts/useFile';

const Header = () => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const { addCell } = useFile();

  const handleAddCode = () => addCell('code');
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
          <span className="text-base font-semibold text-white">File Name</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-dashboard-gray relative">
          <div className="relative" ref={fileMenuRef}>
            <button className="hover:text-white" onClick={() => setIsFileMenuOpen((prev) => !prev)}>
              File
              {isFileMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-dashboard-background border border-dashboard-gray/30 rounded-lg z-50">
                  <ul className="flex flex-col text-sm text-dashboard-gray">
                    <li className="hover:bg-dashboard-btn-hover px-4 py-2 cursor-pointer">
                      새 파일
                    </li>
                    <li className="hover:bg-dashboard-btn-hover px-4 py-2 cursor-pointer">
                      폴더 열기
                    </li>
                    <li className="hover:bg-dashboard-btn-hover px-4 py-2 cursor-pointer">
                      파일 열기
                    </li>
                  </ul>
                </div>
              )}
            </button>
          </div>
          <button className="hover:text-white">Edit</button>
          <button className="hover:text-white">View</button>
          <button className="hover:text-white">Run</button>
          <button className="hover:text-white">Help</button>
        </nav>
      </div>

      <div className="flex items-center gap-6 text-sm text-dashboard-gray">
        <button className="hover:text-white">연결</button>
        <button onClick={handleAddCode} className="hover:text-white">
          + Code
        </button>
        <button onClick={handleAddMarkdown} className="hover:text-white">
          + Text
        </button>
        <FiUser className="text-xl hover:text-white" />
      </div>
    </header>
  );
};

export default Header;
