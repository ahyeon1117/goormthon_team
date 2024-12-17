import React, { useState } from "react";
import "../assets/css/add-tasks-modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

const AddTaskModal = ({ isVisible, onClose }) => {
  // 상태 관리
  const [title, setTitle] = useState(""); // 할 일 제목
  const [content, setContent] = useState(""); // 할 일 내용
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
  const categories = [
    { id: 1, name: "None", color: "#d1d5db" },
    { id: 2, name: "Temp#1", color: "#f87171" },
    { id: 3, name: "Temp#2", color: "#93c5fd" },
    { id: 4, name: "Temp#3", color: "#fde047" },
    { id: 5, name: "Temp#4", color: "#34d399" },
    { id: 6, name: "Temp#6", color: "#DCB4FF" },
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // 선택된 카테고리

  // 날짜 변경 핸들러
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 모달 제출 시 실행되는 함수
  const handleSubmit = () => {
    console.log({ title, content, selectedDate });
    onClose();
  };

  // 모달이 비활성화 상태면 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <div
      className="add-task-modal"
      style={{ "--highlight-color": selectedCategory.color }}
    >
      {/* Header */}
      <header className="header">
        <button onClick={onClose} className="close-button">
          X
        </button>
      </header>

      {/* Body */}
      <div className="body">
        {/* 제목 섹션 */}
        <div className="title-section">
          <div className="icon-container">
            <span className="icon"></span>
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
          <div className="underline"></div>
        </div>

        {/* 날짜 선택 섹션 */}
        <div className="date-section">
          <button
            className="date-button"
            onClick={(e) => {
              const input = e.currentTarget.parentNode.querySelector(
                ".react-datepicker__input-container input"
              );
              if (input) input.focus(); // DatePicker 입력 필드에 포커스
            }}
          >
            <span className="date-icon-text">📅</span>
          </button>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM.dd (eee)" // 월.일 (요일) 표시
            locale={ko} // 한글 요일 적용
          />
        </div>

        {/* 할 일 내용 섹션 */}
        <div className="content-section">
          <textarea
            className="content-input"
            placeholder="Task Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* 카테고리 선택 섹션 */}
        <div className="category-section">
          <div className="category-header">
            <span className="category-title">Select Category</span>
            <button className="category-edit-button">Edit</button>
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
              >
                <span
                  className="category-circle"
                  style={{ backgroundColor: category.color }}
                ></span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <button className="cancel" onClick={onClose}>
          Cancel
        </button>
        <button className="add" onClick={handleSubmit}>
          Add
        </button>
      </footer>
    </div>
  );
};

export default AddTaskModal;
