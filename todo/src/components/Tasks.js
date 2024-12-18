import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import "../assets/css/tasks.css";
import taskData from "../json/tasks/tasks.json";
import DateUtils from "../utils/DateUtils";

function Tasks({ selectedDate }) {
  const dateUtils = new DateUtils();
  const [tasks, setTasks] = useState(taskData.tasks);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleTaskCheck = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, checked: !task.checked } : task
      )
    );
  };

  const completedTasksCount = tasks.filter(task => task.checked).length;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.checked !== b.checked) {
      return a.checked ? 1 : -1;
    }
    return a.categoryId - b.categoryId;
  });

  return (
    <section className="tasks">
      <header>
        <h1>{dateUtils.formatDate(selectedDate, "day")}</h1>
        <div className="task-check-value">{completedTasksCount}/{tasks.length}</div>
      </header>
      <section className="task-list">
        <section className="task-items">
          {sortedTasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-status-bar"></div>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.checked}
                  onChange={() => handleTaskCheck(task.id)}
                  className="task-checkbox"
                />
                <span className="task-title">{task.title}</span>
              </div>
            </div>
          ))}
        </section>
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
