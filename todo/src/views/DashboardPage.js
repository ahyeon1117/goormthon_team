import Calendar from "../components/Calendar";
import Tasks from "../components/Tasks";
function DashboardPage() {
  return (
    <div className="dashboard">
      <aside>
        <Calendar />
      </aside>
      <main>
        <Tasks />
      </main>
    </div>
  );
}

export default DashboardPage;
