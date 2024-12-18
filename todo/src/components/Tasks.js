import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import "../assets/css/tasks.css";
import taskData from "../json/tasks/tasks.json";
import DateUtils from "../utils/DateUtils";

function Tasks({ selectedDate }) {
  const dateUtils = new DateUtils();
  const [tasks, setTasks] = useState(taskData.tasks);
  const [isModalVisible, setModalVisible] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return (
      taskDate.getFullYear() === selectedDate.getFullYear() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getDate() === selectedDate.getDate()
    );
  });

  const getDailyTaskStats = () => {
    const completedTasks = filteredTasks.filter(task => task.checked).length;
    const totalTasks = filteredTasks.length;
    return `${completedTasks}/${totalTasks}`;
  };

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

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.checked !== b.checked) {
      return a.checked ? 1 : -1;
    }
    return a.categoryId - b.categoryId;
  });

  return (
    <section className="tasks">
      <header>
        <h1>{dateUtils.formatDate(selectedDate, "day")}</h1>
        <div className="task-check-value">{getDailyTaskStats()}</div>
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
