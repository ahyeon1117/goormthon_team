import "../assets/css/calendar.css";
import ReactCalendar from "react-calendar";
import DateUtils from "../utils/DateUtils";

function Calendar({ selectedDate, setSelectedDate }) {
  const dateUtils = new DateUtils();
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
  return (
    <section className="calendar">
      <header>
        <h1>{dateUtils.formatDate(selectedDate) || ""}</h1>
        <div className="todo-check-value">12/2</div>
      </header>
      <ReactCalendar
        locale="en-US"
        formatShortWeekday={(locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
        }
        onChange={setSelectedDate}
        value={selectedDate}
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
