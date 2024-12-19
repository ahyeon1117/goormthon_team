import React, { useState, useEffect } from "react";
import "../assets/css/add-tasks-modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

const ModifyTaskModal = ({
  isVisible,
  onClose,
  categories,
  openCategoryModal,
  tasks,
  setTasks,
  selectedTask,
}) => {
  const [taskData, setTaskData] = useState({
    title: "",
    content: "",
    date: new Date(),
    categoryId: categories[0]?.id || 0,
    checked:false,
  });

  useEffect(() => {
    if (selectedTask) {
      setTaskData({
        title: selectedTask.title || "",
        content: selectedTask.contents || "",
        date: new Date(selectedTask.date || new Date()),
        categoryId: selectedTask.categoryId || categories[0]?.id,
        checked:selectedTask.checked || false,
      });
    }
  }, [selectedTask, categories]);

  const handleInputChange = (field, value) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      alert("할 일을 입력해주세요.");
      return;
    }

    const modifiedTask = {
      ...selectedTask,
      title: taskData.title,
      date: format(taskData.date, "yyyy-MM-dd"),
      contents: taskData.content,
      categoryId: taskData.categoryId,
      checked:taskData.checked, 
    };

    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id ? modifiedTask : task
    );

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    const updatedTasks = tasks.filter((task) => task.id !== selectedTask.id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTaskData({
      title: "",
      content: "",
      date: new Date(),
      categoryId: categories[0]?.id || 0,
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className="add-task-modal"
      style={{
        "--highlight-color":
          categories.find((cat) => cat.id === taskData.categoryId)?.color ||
          "#d1d5db",
      }}
    >
      {/* Header */}
      <header className="header">
        <button onClick={onClose} className="close-button" aria-label="Close">
          X
        </button>
      </header>

      {/* Main Content */}
      <main className="body">
        {/* 제목 섹션 */}
        <section className="title-section" aria-label="Task Title Section">
          <div className="icon-container">
            <span className="icon" aria-hidden="true"></span>
          </div>
          <div className="task-title-wrapper">
            <input
              type="text"
              placeholder="할 일"
              value={taskData.title}
              onChange={(e) =>
                handleInputChange("title", e.target.value)
              }
              className="task-title-input"
            />
          </div>
          <div className="underline" aria-hidden="true"></div>
        </section>

        {/* 날짜 선택 섹션 */}
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
            selected={taskData.date}
            onChange={(date) => handleInputChange("date", date)}
            dateFormat="MM.dd (eee)"
            locale={ko}
          />
        </section>

        {/* 할 일 내용 섹션 */}
        <section className="content-section" aria-label="Task Content Section">
          <textarea
            className="content-input"
            placeholder="할 일 세부 사항"
            value={taskData.content}
            onChange={(e) =>
              handleInputChange("content", e.target.value)
            }
          ></textarea>
        </section>

        {/* 카테고리 선택 섹션 */}
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
                  taskData.categoryId === category.id ? "selected" : ""
                }`}
                onClick={() =>
                  handleInputChange("categoryId", category.id)
                }
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
        <button className="cancel" onClick={handleDelete} aria-label="Delete Task">
          삭제
        </button>
        <button
          className="modify"
          onClick={handleSubmit}
          aria-label="Modify Task"
        >
          수정
        </button>
      </footer>
    </div>
  );
};

export default ModifyTaskModal;
