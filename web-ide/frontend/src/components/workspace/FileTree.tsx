import { FiFolder, FiFile } from 'react-icons/fi';

const FileTree = () => (
  <aside className="w-60 bg-dashboard-highlight border-r border-dashboard-gray/30 p-4 text-sm">
    <p className="text-xs text-dashboard-gray mb-2">Files</p>
    <ul className="space-y-2">
      <li className="flex items-center gap-2"><FiFolder /> <span>project/</span></li>
      <li className="ml-4 flex items-center gap-2"><FiFile /> <span>main.py</span></li>
      <li className="ml-4 flex items-center gap-2"><FiFile /> <span>utils.py</span></li>
      <li className="flex items-center gap-2"><FiFolder /> <span>example/</span></li>
      <li className="ml-4 flex items-center gap-2"><FiFile /> <span>demo.ipynb</span></li>
    </ul>
  </aside>
);

export default FileTree;
