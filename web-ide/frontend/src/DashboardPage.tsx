import {FiSearch, FiFilter, FiList, FiEdit, FiX, FiUser, FiUsers, FiPlay } from 'react-icons/fi';
import rocketIcon from './assets/rocket-icon.svg'

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background text-dashboard-textDefault">
      {/* Header */}
      <header className="flex justify-between items-center h-16 px-6">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <span className="text-3xl text-dashboard-buttonPrimary">
            <img
              src={rocketIcon}
              alt="rocket icon"
              className="h-16 w-16"
            />
          </span>
          <span className="text-white">User Name / Project Type</span>
        </div>
        <div className="text-xl p-3">
          <FiUser />
        </div>
      </header>

      {/* 컨트롤 바 */}
      <div className="mt-6 px-6">
        {/* 상단 */}
        <div className="bg-dashboard-background rounded-lg p-6 mx-auto flex gap-3 flex-wrap">
          <button className="bg-btn-primary hover:bg-primary-hover px-4 py-2 mr-5 rounded-lg text-white border border-white/20">
            + New Container
          </button>
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              className="bg-dashboard-btn-control-primary px-4 py-2 rounded-lg text-sm text-white hover:bg-dashboard-btn-hover "
            >
              + Language
            </button>
          ))}
        </div>

        {/* 하단 */}
        <div className="mx-auto flex justify-between items-center mb-6 mt-10">
          <div className="flex items-center w-full max-w-md bg-dashboard-background border border-dashboard-gray px-3 py-2 rounded-lg">
            <FiSearch className="text-dashboard-gray mr-2" />
            <input
              type="text"
              placeholder="Project Name"
              className="bg-transparent outline-none text-sm placeholder-dashboard-gray w-full"
            />
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-3 bg-dashboard-btn-control-primary border border-dashboard-gray px-5 py-2 rounded-lg hover:bg-dashboard-btn-hover text-sm">
              <FiFilter />
              전체
            </button>
            <button className="flex items-center gap-3 bg-dashboard-btn-control-primary border border-dashboard-gray px-5 py-2 rounded-lg hover:bg-dashboard-btn-hover text-sm">
              <FiList />
              Sort
            </button>
          </div>
        </div>
      </div>

      {/* 컨테이너 카드 그리드 */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-dashboard-background p-4 border border-dashboard-gray rounded-lg flex flex-col h-72"
          >
            {/* 상단(Project Title, E/D) */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Project Title
              </h3>
              <div className="flex gap-3 text-lg text-white">
                <button>
                  <FiEdit />
                </button>
                <button>
                  <FiX />
                </button>
              </div>
            </div>

            {/* 중단(Info) */}
            <div className="flex flex-col justify-between flex-grow">
              <p className="text-sm text-dashboard-gray mt-2">
                Language / {i % 2 === 0 ? "개인" : "그룹"}
              </p>
              <div className="flex justify-between items-center text-sm text-dashboard-gray">
                <span>Updated X ago</span>
                <span className="text-lg text-white">
                  {i % 2 === 0 ? <FiUser /> : <FiUsers />}
                </span>
              </div>
            </div>

            {/* 하단(Run) */}
            <div className="mt-4">
              <button className="w-full bg-btn-primary hover:bg-primary-hover text-white py-2 rounded-lg flex justify-center items-center text-sm gap-3 border border-white/20">
                <FiPlay />
                실행
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
