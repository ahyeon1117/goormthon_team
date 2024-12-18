import React, { useState } from "react";
import "../assets/css/add-tasks-modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

const AddTaskModal = ({ isVisible, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const categories = [
    { id: 1, name: "None", color: "#d1d5db" },
    { id: 2, name: "Temp#1", color: "#f87171" },
    { id: 3, name: "Temp#2", color: "#93c5fd" },
    { id: 4, name: "Temp#3", color: "#fde047" },
    { id: 5, name: "Temp#4", color: "#34d399" },
    { id: 6, name: "Temp#6", color: "#DCB4FF" },
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    console.log({ title, content, selectedDate });
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className="add-task-modal"
      style={{ "--highlight-color": selectedCategory.color }}
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
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM.dd (eee)"
            locale={ko}
          />
        </section>

        {/* 할 일 내용 섹션 */}
        <section className="content-section" aria-label="Task Content Section">
          <textarea
            className="content-input"
            placeholder="Task Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </section>

        {/* 카테고리 선택 섹션 */}
        <section className="category-section" aria-label="Category Selection">
          <div className="category-header">
            <span className="category-title">Select Category</span>
            <button className="category-edit-button" aria-label="Edit Categories">
              Edit
            </button>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-item ${
                  selectedCategory?.id === category.id ? "selected" : ""
                }`}
                onClick={() =>
                  setSelectedCategory({ id: category.id, color: category.color })
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
        <button className="cancel" onClick={onClose} aria-label="Cancel">
          Cancel
        </button>
        <button className="add" onClick={handleSubmit} aria-label="Add Task">
          Add
        </button>
      </footer>
    </div>
  );
};

export default AddTaskModal;
