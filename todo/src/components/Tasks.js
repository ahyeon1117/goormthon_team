import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import DetailTasksModal from "./DetailTasksModal";
import "../assets/css/tasks.css";
import DateUtils from "../utils/DateUtils";

function Tasks({ selectedDate }) {
  const dateUtils = new DateUtils();
  const tasks = [
    { id: 1, text: "밥 먹기", completed: true },
    { id: 2, text: "운동하기", completed: true },
    { id: 3, text: "책 읽기", completed: true },
    { id: 4, text: "청소하기", completed: false },
    { id: 5, text: "코딩하기", completed: true },
    { id: 6, text: "게임하기", completed: false },
  ];

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTaskId(null); // 모달을 닫을 때 선택된 taskId를 초기화
  };

  const filteredTasks = tasks.filter((task) => task.completed);

  return (
    <section className="tasks">
      <header>
        <h1>{dateUtils.formatDate(selectedDate, "day")}</h1>
        <div className="task-check-value">
          {filteredTasks.length}/{tasks.length}
        </div>
      </header>

      <section className="task-list">
        {filteredTasks.map((task) => (
          <button
            key={task.id}
            className="task-item"
            onClick={() => {
              setSelectedTaskId(task.id); // 클릭한 태스크의 ID 설정
              setModalVisible(true); // DetailTasksModal을 띄운다
            }}
          >
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
          </button>
        ))}
      </section>

      <section className="add-task-section">
        <button
          className="add-task-btn"
          onClick={() => {
            setSelectedTaskId(null); // 새 태스크 추가 시 선택된 taskId를 null로 설정
            setModalVisible(true); // AddTaskModal을 띄운다
          }}
        >
          추가
        </button>
        <AddTaskModal
          isVisible={isModalVisible && selectedTaskId === null}
          onClose={handleCloseModal}
        />
      </section>

      {selectedTaskId && (
        <DetailTasksModal
          isVisible={isModalVisible && selectedTaskId !== null}
          taskId={selectedTaskId}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}

export default Tasks;