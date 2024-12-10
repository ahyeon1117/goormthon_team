import "../assets/css/tasks.css";
function Tasks({ selectedDate }) {
  const formatDate = (date) => {
    if (Array.isArray(date)) {
      const [startDate] = date;
      return `${startDate.getFullYear()}.${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}.${startDate.getDate()}`;
    }
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${date.getDate()}`;
  };
  return (
    <section>
      <section class="tasks">
        <h2>{formatDate(selectedDate)}</h2>
        <ul>
          <li>밥 먹기</li>
          <li>밥 먹기</li>
          <li>밥 먹기</li>
          <li>밥 먹기</li>
        </ul>
        <button>추가</button>
      </section>
    </section>
  );
}

export default Tasks;
