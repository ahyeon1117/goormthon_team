import Calendar from "../components/Calendar";
import Tasks from "../components/Tasks";
import CategoryViewModal from "../components/CategoryViewModal";
import CategoryEditModal from "../components/CategoryEditModal";
import { useState } from "react";

// 카테고리 초기 데이터 설정
const initialCategories = localStorage.getItem("categories")
  ? JSON.parse(localStorage.getItem("categories"))
  : [];

function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [categories, setCategories] = useState(initialCategories); // 카테고리 상태
  const [categoryModals, setCategoryModals] = useState({ // 카테고리 모달 상태
    isViewOpen: false, // 카테고리 조회 모달
    isAddOpen: false, // 카테고리 추가 모달
    isEditOpen: false,
  });

  // 특정 카테고리 모달 열기
  const openCategoryModal = (modalType) => {
    setCategoryModals(prev => ({
      isViewOpen: false,
      isAddOpen: false,
      isEditOpen: false,
      [modalType]: true
    }))
  }

  // 모든 카테고리 모달 닫기
  const closeCategoryModals = () => {
    setCategoryModals({
      isViewOpen: false,
      isAddOpen: false,
      isEditOpen: false
    })
  }

  return (
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

      {/* [임시 버튼] - 태스크 모달에서 카테고리 모달로 이어지도록 */}
      <div>
        <button onClick={() => openCategoryModal('isViewOpen')}>카테고리 편집</button>
      </div>

      {/* 카테고리 조회 모달 */}
      {categoryModals.isViewOpen && (
        <CategoryViewModal
          categories={categories}
          openCategoryModal={openCategoryModal}
          closeCategoryModals={closeCategoryModals}
        />
      )}

      {/* 카테고리 편집 모달 (추가, 수정 기능) */}
      {(categoryModals.isAddOpen || categoryModals.isEditOpen) && (
        <CategoryEditModal
          isAddOpen={categoryModals.isAddOpen}
          isEditOpen={categoryModals.isEditOpen}
          categories={categories}
          setCategories={setCategories}
          openCategoryModal={openCategoryModal}
          closeCategoryModals={closeCategoryModals}
        />
      )}
    </div>
  );
}

export default DashboardPage;
