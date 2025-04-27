import { useState, useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import rocketIcon from '../../assets/rocket-icon.svg';
import { useFile } from '../../hooks/useFile';
import KernelCreateButton from '../kernel/KernelCreateButton';
import { createCell } from '../../api/cell';
import { useSearchParams } from 'react-router-dom';
import { addProjectMember, fetchProject } from '../../api/project';

const Header = () => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const { addCell, selectedFile } = useFile();
  // const { addCell } = useFile();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [projectName, setProjectName] = useState('');
  const [isOwner, setIsOwner] = useState(false);

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
    fetchProjectData();

    const handleClickOutside = (event: MouseEvent) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
        setIsFileMenuOpen(false);
      }
    };
    if (isFileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFileMenuOpen]);

  const fetchProjectData = async () => {
    try {
      const project = await fetchProject(Number(projectId));
      console.log('프로젝트 조회 성공: ', project.data.name);

      setProjectName(project.data.name);
      setIsOwner(project.data.ownerId === Number(localStorage.getItem('userId')));

    } catch (error) {
      console.error('프로젝트 조회 실패: ', error);
    }
  };

  const handleAddMember = async () => {


    const email = prompt('프로젝트에 추가할 멤버의 이메일을 입력해주세요.');
    if (!email) return;

    // 이메일 형식 검증
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      handleAddMember();
    }

    // 프로젝트 멤버 추가 API 호출
    try {
      await addProjectMember(Number(projectId), email);
      alert("멤버가 추가되었습니다.");
    } catch (err: any) {
      console.error('멤버 추가 오류:', err);

      const errorData = err instanceof Error && err.message
        ? JSON.parse(err.message) // 서버 에러를 Error 객체에 감췄으면 message 파싱
        : err; // 아니면 그냥 쓰기

      if (errorData.status === 409 && errorData.code === 'DUPLICATE_PROJECT_MEMBER') {
        alert('이미 추가된 멤버입니다.');
      } else if (errorData.status === 404 && errorData.code === 'USER_NOT_FOUND') {
        alert('사용자를 찾을 수 없습니다.');
      } else if (errorData.status === 403) {
        alert('프로젝트 멤버 추가 권한이 없습니다.');
      } else {
        alert('멤버 추가에 실패했습니다.');
      }
    }
  };

  return (
    <header className="w-full h-14 pr-6 pl-2 border-b border-dashboard-gray/30 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <img src={rocketIcon} alt="Rocket Logo" className="w-12 h-12" />
          <span className="text-base font-semibold text-white">
            {projectName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-dashboard-gray">
        {isOwner && (
          <button
            className="hover:text-white"
            onClick={handleAddMember}
          >
            멤버 추가
          </button>
        )}
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
