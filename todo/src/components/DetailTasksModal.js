import React from "react";
import "../assets/css/detail-tasks-modal.css";


function DetailTasks({ taskId, onClose }) {
  // 하드코딩된 tasks 배열
  const tasks = [
    { id: 1, title: "밥 먹기", contents: "점심 밥 먹기", date: "2024-12-20", categoryId: 1, checked: true },
    { id: 2, title: "운동하기", contents: "헬스장에서 운동하기", date: "2024-12-21", categoryId: 2, checked: false },
    { id: 3, title: "책 읽기", contents: "도서관에서 책 읽기", date: "2024-12-22", categoryId: 3, checked: true },
    { id: 4, title: "청소하기", contents: "방 청소하기", date: "2024-12-23", categoryId: 4, checked: false },
    { id: 5, title: "코딩하기", contents: "프로그래밍 연습하기", date: "2024-12-24", categoryId: 5, checked: true },
    { id: 6, title: "게임하기", contents: "게임 할 시간", date: "2024-12-25", categoryId: 6, checked: false },
  ];

  // taskId에 맞는 task 찾기
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return <div>일정을 찾을 수 없습니다</div>;
  }

  const getCategoryColor = (categoryId) => {
    switch (categoryId) {
      case 1:
        return "#FF5733"; // 빨강
      case 2:
        return "#33FF57"; // 초록
      case 3:
        return "#3357FF"; // 파랑
      case 4:
        return "#FFC300"; // 노랑
      default:
        return "#CCCCCC"; // 기본 회색
    }
  };

  return (
    <div className="detail-task-container">
      <div className="header">
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>

      <div className="body">

      {/* 제목 */}
        <div className="title-section">
          <div className="icon-container">
            <div className="icon"
            style={{ backgroundColor: getCategoryColor(task.categoryId),
              width: "300px",   // 예시로 크기를 40px로 설정
              height: "20px",  // 예시로 크기를 40px로 설정
             }}></div>
          </div>
          <div className="task-title-wrapper">
            <textarea
              className="task-title-input"
              defaultValue={task.title}
              readOnly
            />
          </div>
          <div className="underline"></div>
        </div>

        {/* 날짜 */}
        <div className="date-container">
          <p>{task.date}</p>
        </div>

        <div className="content-container">
          <textarea
            className="content-input"
            defaultValue={task.contents}
            readOnly
          />
        </div>
      </div>
      <div className="footer">
        <button className="cancel" onClick={onClose}>
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default DetailTasks;

