import Calendar from "../components/Calendar";
import Tasks from "../components/Tasks";
import { useState } from "react";
import CategoryViewModal from "../components/CategoryViewModal";
import CategoryEditModal from "../components/CategoryEditModal";
import AddTaskModal from "../components/AddTaskModal";


const TEXT_CATEGORY_UNSPECIFIED = "미지정";
const COLOR_CATEGORY_UNSPECIFIED = "59E7C1"
// 카테고리 초기 데이터 설정
let defaultCategory = { id: 0, name: TEXT_CATEGORY_UNSPECIFIED, color: COLOR_CATEGORY_UNSPECIFIED,};
if(!localStorage.getItem("categories")){
  localStorage.setItem("categories", JSON.stringify([defaultCategory]));
}
const initialCategories = JSON.parse(localStorage.getItem("categories"));

// 할 일 초기 데이터 설정
const initialTasks = localStorage.getItem("tasks")
? JSON.parse(localStorage.getItem("tasks"))
: [];

function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categories, setCategories] = useState(initialCategories); // 카테고리 상태
  const [tasks, setTasks] = useState(initialTasks); // 할 일 상태
  const [isAddTaskModalOpen, setAddTaskModal] = useState(false); // 할 일 추가 모달 
  const [categoryModals, setCategoryModals] = useState({
    isViewOpen: false, // 카테고리 조회 모달
    isAddOpen: false, // 카테고리 추가 모달
    isEditOpen: false,
  });

  //할 일 추가 모달 상태 변경
  const handleAddTaskModal = () => {
    setAddTaskModal(false);
  };

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
          tasks={tasks}
        />
      </aside>
      <main>
        <Tasks 
          selectedDate={selectedDate} 
          categories={categories}
          tasks={tasks}
          setTasks={setTasks}
          setAddTaskModal={setAddTaskModal}
          />
      </main>
      {/* 할 일 추가 모달 */}
      <AddTaskModal 
        isVisible={AddTaskModal} 
        onClose={handleAddTaskModal} 
        categories = {categories}
        setCategories={setCategories}
        prevSelectedDate = {selectedDate}
        openCategoryModal={openCategoryModal}
        tasks={tasks}
        setTasks={setTasks}
        />
      
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
