import React, { useState } from "react";
import "../assets/css/tasks.css";
import DateUtils from "../utils/DateUtils";


function Tasks({ selectedDate, categories, tasks, setTasks,setAddTaskModal,setModifyTaskModal,setSelectedTask}) {
  const dateUtils = new DateUtils();
  
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

  const handleModify = (task) => {
    setSelectedTask(task);
    setModifyTaskModal(true);
  };

  return (
    <section className="tasks">
      <header>
        <h1>{dateUtils.formatDate(selectedDate, "day")}</h1>
        <div className="task-check-value">{getDailyTaskStats()}</div>
      </header>
      <section className="task-list">
        <section className="task-items">
          {sortedTasks.map((task) => (
            <div className="task-item" key={task.id}>

              {/* Status Bar Container */}
              <div className="status-bar-container">
                <div className="task-status-bar"></div>
              </div>

              {/* Checkbox Container */}
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={task.checked}
                  onChange={() => handleTaskCheck(task.id)}
                  className="task-checkbox"
                />
              </div>

              {/* Task Content as Button */}
              <button
                className="task-content"
                onClick={() => handleModify(task)}
              >
                <span className="task-title">{task.title}</span>
              </button>
            </div>
          ))}
        </section>
      </section>

      <section className="add-task-section">
        <button className="add-task-btn" onClick={() => setAddTaskModal(true)}>
          추가
        </button>
      </section>
    </section>
  );
}

export default Tasks;
