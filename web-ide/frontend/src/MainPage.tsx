import rocketIcon from './assets/rocket-icon.svg';
import { FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom'

const MainPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-white overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-20 py-4 text-lg">
        <span className="font-mono">Rocket IDE</span>
        <div className="space-x-4">
          <Link to="/login" className="inline-block hover:underline font-semibold">Login</Link>
          <Link to="/signup" className="inline-block hover:underline font-semibold">SignUp</Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-1 w-full items-center justify-center px-6 py-20">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-16">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-8 text-center md:text-left">
          <h1 className="text-7xl font-semibold font-mono">ROCKET IDE</h1>
          <p className="text-sm font-noto text-gray-300 max-w-xl leading-relaxed">
          “우리는 지금 당장 실현 가능한 기술로 의미 있는 변화를 만들어냅니다.”<br /> “그리고 이 작은 시작은 앞으로의 더 큰 확장 가능성을 품고 있습니다.”
          </p>
          <Link to='/workspace' className="bg-btn-primary hover:bg-primary-hover text-white px-6 py-3 rounded flex items-center gap-2 w-fit mx-auto md:mx-0">
            <FaCode />
            지금 시작하기
          </Link>
        </div>

        {/* Right Icon */}
        <div className="relative md:w-1/2 flex flex-col items-center">
          <img src={rocketIcon} alt="rocket icon" className="w-[40rem] h-[40rem] max-w-full" />
          <p className="absolute bottom-[18%] font-mono text-xl mt-4">Rocket IDE!</p>
        </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
