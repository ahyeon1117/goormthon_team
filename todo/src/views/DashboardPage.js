import Calendar from "../components/Calendar";
import Tasks from "../components/Tasks";
import CategoryModals from "../components/modals/category/CategoryModals";
import { useState } from "react";
import { CategoryContext } from "../context/CategoryContext";

function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // [변경 필요] - 카테고리 임시 데이터
  // 카테고리 state
  const [categories, setCategories] = useState([
    { id: 1, name: "로켓 방정식", color: "#49D7B1" },
    { id: 2, name: "약속", color: "#F192A5" },
    { id: 3, name: "할 일", color: "#CEDDF2" },
    { id: 4, name: "중요", color: "#F9D877" },
    { id: 5, name: "기념일", color: "#E59EDD" },
    { id: 6, name: "기념일", color: "#E59EDD" },
    { id: 7, name: "기념일", color: "#E59EDD" },
    { id: 8, name: "기념일", color: "#E59EDD" },
    { id: 9, name: "기념일", color: "#E59EDD" },
    { id: 10, name: "기념일", color: "#E59EDD" },
    { id: 11, name: "긴 할 일 제목입니다. 긴 할 일 제목입니다. 긴 할 일 제목입니다.", color: "#E59EDD" },
  ]);

  // 카테고리 모달 state
  const [categoryModals, setCategoryModals] = useState({
    isViewOpen: true, // 카테고리 조회 모달
    isAddOpen: true, // 카테고리 추가 모달
    isEditOpen: false, // 카테고리 편집 모달
  });

  // 카테고리 모달 상태 변경
  const changeCategoryModal = (categoryModalState) => {
    setCategoryModals((prev) => ({
      ...prev,
      ...categoryModalState, // 전달된 변경 사항 덮어쓰기
    }));
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        setCategories,
        categoryModals,
        setCategoryModals,
        changeCategoryModal,
      }}
    >
      <div className="dashboard">
        <aside>
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </aside>
        <main>
          <Tasks selectedDate={selectedDate} />
        </main>

        {/* [변경 필요] - 할 일 모달에서 카테고리 모달로 이어지도록 */}
        <div>
          <button onClick={() => changeCategoryModal({ isViewOpen: true })}>카테고리 편집</button>
        </div>
        <CategoryModals />
      </div>
    </CategoryContext.Provider>
  );
}

export default DashboardPage;
