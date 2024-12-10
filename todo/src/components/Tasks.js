import "../assets/css/tasks.css";
import DateUtils from "../utils/DateUtils";

function Tasks({ selectedDate }) {
  const dateUtils = new DateUtils();
  return (
    <section class="tasks">
      <h2>{dateUtils.formatDate(selectedDate, "day")}</h2>
      <ul>
        <li>밥 먹기</li>
        <li>밥 먹기</li>
        <li>밥 먹기</li>
        <li>밥 먹기</li>
      </ul>
      <button>추가</button>
    </section>
  );
}
export default Tasks;
