import Calendar from "../components/Calendar";
import Tasks from "../components/Tasks";
import CategoryViewModal from "../components/CategoryViewModal";
import CategoryAddModal from "../components/CategoryAddModal";
import { useState } from "react";

// 카테고리 초기 데이터 설정
const initialCategories = localStorage.getItem("categories")
  ? JSON.parse(localStorage.getItem("categories"))
  : [];

function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categories, setCategories] = useState(initialCategories); // 카테고리 상태

  // 카테고리 모달 상태
  const [categoryModals, setCategoryModals] = useState({
    isViewOpen: false, // 카테고리 조회 모달
    isAddOpen: false, // 카테고리 추가 모달
    isEditOpen: false, // 카테고리 편집 모달
  });

  // 카테고리 모달 상태 변경 (버튼 클릭 시 열고 닫힘)
  const changeCategoryModal = (categoryModalState) => {
    setCategoryModals((prev) => ({
      ...prev,
      ...categoryModalState, // 전달된 변경 사항 덮어쓰기
    }));
  };

  return (
    <div className="dashboard">
      <aside>
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </aside>
      <main>
        <Tasks
          selectedDate={selectedDate}
          changeCategoryModal={changeCategoryModal}
        />
      </main>

      {/* 카테고리 조회 모달 */}
      {categoryModals.isViewOpen && (
        <CategoryViewModal
          categories={categories}
          changeCategoryModal={changeCategoryModal}
        />
      )}

      {/* 카테고리 추가 모달 */}
      {categoryModals.isAddOpen && (
        <CategoryAddModal
          categories={categories}
          setCategories={setCategories}
          changeCategoryModal={changeCategoryModal}
        />
      )}
    </div>
  );
}

export default DashboardPage;
