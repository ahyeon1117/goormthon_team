import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import "../assets/css/tasks.css";
import DateUtils from "../utils/DateUtils";

function Tasks({ selectedDate }) {
  const dateUtils = new DateUtils();
  const [tasks, setTasks] = useState([
    { id: 1, title: "밥 먹기", date: "2024-12-17", contents: "aaa", categoryId: 1, checked: true },
    { id: 2, title: "잠 자기", date: "2024-12-17", contents: "bbb", categoryId: 1, checked: true },
    { id: 3, title: "축구하기", date: "2024-12-17", contents: "ccc", categoryId: 2, checked: true },
    { id: 4, title: "야구하기", date: "2024-12-17", contents: "ddd", categoryId: 2, checked: false },
    { id: 5, title: "코딩하기", date: "2024-12-17", contents: "eee", categoryId: 3, checked: false },
    { id: 6, title: "독서하기", date: "2024-12-17", contents: "fff", categoryId: 3, checked: false },
  ]);
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

  return (
    <section className="tasks">
      <header>
        <h1>{dateUtils.formatDate(selectedDate, "day")}</h1>
        <div className="task-check-value">{completedTasksCount}/{tasks.length}</div>
      </header>
      <section className="task-list">
        <section className="task-items">
          {tasks.map((task) => (
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
