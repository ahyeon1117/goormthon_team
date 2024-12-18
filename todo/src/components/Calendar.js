import "../assets/css/calendar.css";
import taskData from "../json/calendar/calendar.json";
import ReactCalendar from "react-calendar";
import DateUtils from "../utils/DateUtils";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Calendar({ selectedDate, setSelectedDate }) {
  const dateUtils = new DateUtils();
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const tasks = taskData.calendar;

  const tileClassName = ({ date, view }) => {
    if (selectedDate && view === "month") {
      const parsedSelectedDate =
        typeof selectedDate === "string"
          ? new Date(selectedDate)
          : selectedDate;
      const isSameDay =
        date.getFullYear() === parsedSelectedDate.getFullYear() &&
        date.getMonth() === parsedSelectedDate.getMonth() &&
        date.getDate() === parsedSelectedDate.getDate();
      return isSameDay ? "tileHighlight" : null;
    }
    return null;
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
        <div className="todo-check-value-box">
          <div className="todo-check-value">12/2</div>
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
