import React, { useState, useEffect } from "react";
import "../assets/css/add-tasks-modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from 'date-fns';

const VALIDATION_MESSAGE = "할 일을 입력해주세요.";
const DATE_FORMAT = "MM.dd (eee)";
const BTN_MODIFY_LABEL = "수정";
const BTN_CANCEL_LABEL = "취소";
const TEXT_CATEGORY_SELECT = "카테고리 선택";
const BTN_CATEGORY_EDIT_LABEL = "편집";
const TEXT_TODO_TITLE = "할 일";
const TEXT_TODO_CONTENT = "할 일 세부 사항";

const ModifyTaskModal = ({ isVisible, onClose, categories, openCategoryModal,tasks,setTasks,selectedTask}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || "");
      setContent(selectedTask.contents || "");
      setSelectedDate(new Date(selectedTask.date || new Date()));
      setSelectedCategory(categories.find(category => category.id === selectedTask.categoryId) || categories[0]);
    }
  }, [selectedTask, categories]);

  // 날짜 변경 핸들러
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 할 일 추가 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert(VALIDATION_MESSAGE);
      return;
    }

    // 수정된 할 일 데이터
    let modifiedTask = {
      id: selectedTask.id,
      title: title,
      date : format(selectedDate, 'yyyy-MM-dd'),
      contents : content,
      categoryId: selectedCategory.id,
    };

   // tasks 배열에서 해당 task를 업데이트
   const updatedTasks = tasks.map(task =>
    task.id === selectedTask.id ? modifiedTask : task
  );

  // 상태 업데이트
  setTasks(updatedTasks);

  // 로컬 스토리지 업데이트
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    resetForm();
    onClose();
  };

  // 폼 초기화 
  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedCategory(categories[0]);
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
              placeholder={TEXT_TODO_TITLE}
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
            dateFormat={DATE_FORMAT}
            locale={ko}
          />
        </section>

        {/* 할 일 내용 섹션 */}
        <section className="content-section" aria-label="Task Content Section">
          <textarea
            className="content-input"
            placeholder={TEXT_TODO_CONTENT}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </section>

        {/* 카테고리 선택 섹션 */}
        <section className="category-section" aria-label="Category Selection">
          <div className="category-header">
            <span className="category-title">{TEXT_CATEGORY_SELECT}</span>
            <button className="category-edit-button" aria-label="Edit Categories"
              onClick={() => openCategoryModal('isViewOpen')}>
              {BTN_CATEGORY_EDIT_LABEL}
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
          {BTN_CANCEL_LABEL}
        </button>
        <button className="modify" onClick={handleSubmit} aria-label="Modify Task">
          {BTN_MODIFY_LABEL}
        </button>
      </footer>
      
    </div>
  );
};

export default ModifyTaskModal;
