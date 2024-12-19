import React, { useState, useEffect } from "react";
import "../assets/css/add-tasks-modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

const AddTaskModal = ({
  isVisible,
  onClose,
  categories,
  prevSelectedDate,
  openCategoryModal,
  tasks,
  setTasks,
}) => {
  const [taskData, setTaskData] = useState({
    title: "",
    content: "",
    selectedDate: new Date(),
    selectedCategory: categories[0],
    checked: false,
  });

  // Handle any field change
  const handleTaskDataChange = (key, value) => {
    setTaskData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Initialize date when modal becomes visible
  useEffect(() => {
    if (isVisible && prevSelectedDate) {
      handleTaskDataChange("selectedDate", prevSelectedDate);
    }
  }, [isVisible, prevSelectedDate]);

  // Add task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      alert("할 일을 입력해주세요.");
      return;
    }

    const newTask = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0,
      title: taskData.title,
      date: format(taskData.selectedDate, "yyyy-MM-dd"),
      contents: taskData.content,
      categoryId: taskData.selectedCategory.id,
      checked: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    resetForm();
    onClose();
  };

  // Reset form fields
  const resetForm = () => {
    setTaskData({
      title: "",
      content: "",
      selectedDate: new Date(),
      selectedCategory: categories[0],
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className="add-task-modal"
      style={{ "--highlight-color": taskData.selectedCategory.color }}
    >
      {/* Header */}
      <header className="header">
        <button onClick={onClose} className="close-button" aria-label="Close">
          X
        </button>
      </header>

      {/* Main Content */}
      <main className="body">
        {/* Title Section */}
        <section className="title-section" aria-label="Task Title Section">
          <div className="icon-container">
            <span className="icon" aria-hidden="true"></span>
          </div>
          <div className="task-title-wrapper">
            <input
              type="text"
              placeholder="할 일"
              value={taskData.title}
              onChange={(e) => handleTaskDataChange("title", e.target.value)}
              className="task-title-input"
            />
          </div>
          <div className="underline" aria-hidden="true"></div>
        </section>

        {/* Date Section */}
        <section className="date-section" aria-label="Date Picker Section">
          <button
            className="date-button"
            onClick={(e) => {
              const input = e.currentTarget.parentNode.querySelector(
                ".react-datepicker__input-container input"
              );
              if (input) input.focus();
            }}
            aria-label="Open Date Picker"
          >
            <span className="date-icon-text">📅</span>
          </button>
          <DatePicker
            selected={taskData.selectedDate}
            onChange={(date) => handleTaskDataChange("selectedDate", date)}
            dateFormat="MM.dd (eee)"
            locale={ko}
          />
        </section>

        {/* Content Section */}
        <section className="content-section" aria-label="Task Content Section">
          <textarea
            className="content-input"
            placeholder="할 일 세부 사항"
            value={taskData.content}
            onChange={(e) => handleTaskDataChange("content", e.target.value)}
          ></textarea>
        </section>

        {/* Category Section */}
        <section className="category-section" aria-label="Category Selection">
          <div className="category-header">
            <span className="category-title">카테고리 선택</span>
            <button
              className="category-edit-button"
              aria-label="Edit Categories"
              onClick={() => openCategoryModal("isViewOpen")}
            >
              편집
            </button>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-item ${
                  taskData.selectedCategory?.id === category.id ? "selected" : ""
                }`}
                onClick={() => handleTaskDataChange("selectedCategory", category)}
                style={{ color: category.color }}
                aria-label={`Select ${category.name}`}
              >
                <span
                  className="category-circle"
                  style={{ backgroundColor: category.color }}
                ></span>
                {category.name}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <button className="add" onClick={handleSubmit} aria-label="Add Task">
          추가
        </button>
      </footer>
    </div>
  );
};

export default AddTaskModal;
