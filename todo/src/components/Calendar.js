import "../assets/css/calendar.css";
import taskData from "../json/tasks/tasks.json";
import ReactCalendar from "react-calendar";
import DateUtils from "../utils/DateUtils";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Calendar({ selectedDate, setSelectedDate,tasks }) {
  const dateUtils = new DateUtils();
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  //const tasks = taskData.tasks;

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (selectedDate) {
        const parsedSelectedDate =
          typeof selectedDate === "string"
            ? new Date(selectedDate)
            : selectedDate;
        const isSameDay =
          date.getFullYear() === parsedSelectedDate.getFullYear() &&
          date.getMonth() === parsedSelectedDate.getMonth() &&
          date.getDate() === parsedSelectedDate.getDate();
        if (isSameDay) return "tileHighlight";
      }

      const hasTask = tasks.some(task => {
        const taskDate = new Date(task.date);
        return (
          date.getFullYear() === taskDate.getFullYear() &&
          date.getMonth() === taskDate.getMonth() &&
          date.getDate() === taskDate.getDate()
        );
      });

      if (hasTask) return "hasTasks";
    }
    return null;
  }

  const getMonthlyTaskStats = () => {
    const currentMonth = activeStartDate.getMonth();
    const currentYear = activeStartDate.getFullYear();

    const monthTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
    });

    const completedTasks = monthTasks.filter(task => task.checked).length;
    const totalTasks = monthTasks.length;

    return `${completedTasks}/${totalTasks}`;
  };

  const handleActiveStartDateChange = ({ action, activeStartDate }) => {
    if (action === 'prev' || action === 'next') {
      setActiveStartDate(activeStartDate);
    }
  };

  const goToPreviousMonth = () => {
    const previousMonth = new Date(activeStartDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setActiveStartDate(previousMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(activeStartDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setActiveStartDate(nextMonth);
  };

  return (
    <section className="calendar">
      <header className="calendar-header">
        <div className="calendar-header-box">
          <button
            className="nav-button prev-month"
            onClick={goToPreviousMonth}
          >
            <FaChevronLeft />
          </button>
          <h1>{dateUtils.formatDate(activeStartDate, "month") || ""}</h1>
          <button
            className="nav-button next-month"
            onClick={goToNextMonth}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="todo-check-value-big-box">
          <div className="todo-check-value-small-box">
            <div className="todo-check-value">{getMonthlyTaskStats()}</div>
          </div>
        </div>
      </header>
      <ReactCalendar
        locale="en-US"
        formatShortWeekday={(locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
        }
        onChange={setSelectedDate}
        value={selectedDate}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={handleActiveStartDateChange}
        view="month"
        showWeekNumbers={false}
        showNavigation={false}
        formatDay={(locale, date) =>
          date.toLocaleDateString("en", { day: "2-digit" })
        }
        showNeighboringMonth={false}
        tileClassName={tileClassName}
      ></ReactCalendar>
    </section>
  );
}
export default Calendar;
