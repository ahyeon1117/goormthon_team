import Header from '../components/dashboard/Header';
import ControlBar from '../components/dashboard/ControlBar';
import FilterBar from '../components/dashboard/FilterBar';
import ContainerCard from '../components/dashboard/ContainerCard';
import { ProjectProvider } from '../contexts/ProjectContext';
import { ProjectContext } from '../contexts/ProjectContextType';
import { useContext } from 'react';

const DashboardPage = () => {
  return (
    <ProjectProvider>
      <DashboardContent />
    </ProjectProvider>
  );
};

const DashboardContent = () => {
  const context = useContext(ProjectContext);
  if (!context) return null;

  return (
    <div className="min-h-screen bg-background text-dashboard-textDefault">
      <Header />
      <div className="mt-6 px-6">
        <ControlBar />
        <FilterBar />
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {context.projects.map((project) => (
          <ContainerCard key={project.projectId} project={project} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
