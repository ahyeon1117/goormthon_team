const ControlBar = () => (
  <div className="bg-dashboard-background rounded-lg p-6 mx-auto flex gap-3 flex-wrap">
    <button className="bg-btn-primary hover:bg-primary-hover px-4 py-2 mr-5 rounded-lg text-white border border-white/20">
      + New Project
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
);

export default ControlBar;
