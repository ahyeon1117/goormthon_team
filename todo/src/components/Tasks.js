import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import "../assets/css/tasks.css";
import DateUtils from "../utils/DateUtils";

function Tasks({ selectedDate }) {
  const dateUtils = new DateUtils();
  const tasks = [
    { id: 1, text: "밥 먹기", completed: true },
    { id: 2, text: "밥 먹기", completed: true },
    { id: 3, text: "밥 먹기", completed: true },
    { id: 4, text: "밥 먹기", completed: true },
    { id: 5, text: "밥 먹기", completed: true },
    { id: 6, text: "밥 먹기", completed: true },
  ];
  const [isModalVisible, setModalVisible] = useState(false);
  const handleCloseModal = () => {setModalVisible(false);};

  return (
    <section className="tasks">
      <header>
      <h1>{dateUtils.formatDate(selectedDate, "day")}</h1>
        <div className="task-check-value">2/8</div>
      </header>
      <section className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <div className="task-status-bar"></div>
            <div className="task-content">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="task-checkbox"
              />
              <span className="task-text">{task.text}</span>
            </div>
          </div>
        ))}
        <section className="add-task-section">
          <button className="add-task-btn" onClick={() => setModalVisible(true)}>
            추가
          </button>
          <AddTaskModal isVisible={isModalVisible} onClose={handleCloseModal} />
        </section>
      </section>
    </section>
  );
}

export default Tasks;
