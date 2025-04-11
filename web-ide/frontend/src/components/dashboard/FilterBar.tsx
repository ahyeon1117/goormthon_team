import { FiSearch, FiFilter, FiList } from 'react-icons/fi';

const FilterBar = () => (
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
);

export default FilterBar;
