import Calendar from "../components/Calendar";
import Tasks from "../components/Tasks";
import { useState } from "react";

function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="dashboard">
      <aside>
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </aside>
      <main>
        <Tasks selectedDate={selectedDate} />
      </main>
    </div>
  );
}

export default DashboardPage;
