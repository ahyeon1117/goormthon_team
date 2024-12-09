import "../assets/css/calendar.css";
import ReactCalendar from "react-calendar";
import { useState } from "react";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState([new Date(), new Date()]);
  const formatDate = (date) => {
    if (Array.isArray(date)) {
      const [startDate] = date;
      return `${startDate.getFullYear()}.${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}`;
    }
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };
  return (
    <section className="calendar">
      <h1>{formatDate(selectedDate) || ""}</h1>
      <ReactCalendar
        onChange={setSelectedDate}
        value={selectedDate}
        view="month"
        showWeekNumbers={false}
        showNavigation={false}
        prev2Label={null}
        next2Label={null}
        formatDay={(locale, date) =>
          date.toLocaleDateString("en", { day: "2-digit" })
        }
        showNeighboringMonth={false}
      ></ReactCalendar>
    </section>
  );
}
export default Calendar;
