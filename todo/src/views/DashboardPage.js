import Calendar from "../components/Calendar";
import Tasks from "../components/Tasks";
import { useState } from "react";
import CategoryViewModal from "../components/CategoryViewModal";
import CategoryAddModal from "../components/CategoryAddModal";
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
    isEditOpen: false, // 카테고리 편집 모달
  });
  
  // 카테고리 모달 상태 변경 (버튼 클릭 시 열고 닫힘)
  const changeCategoryModal = (categoryModalState) => {
    setCategoryModals((prev) => ({
      ...prev,
      ...categoryModalState, // 전달된 변경 사항 덮어쓰기
    }));
  };

  //할 일 추가 모달 상태 변경
  const handleAddTaskModal = () => {
    setAddTaskModal(false);
  };


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
      {isAddTaskModalOpen && (
        <AddTaskModal 
          isVisible={AddTaskModal} 
          onClose={handleAddTaskModal} 
          categories = {categories}
          setCategories={setCategories}
          prevSelectedDate = {selectedDate}
          changeCategoryModal={changeCategoryModal} 
          tasks={tasks}
          setTasks={setTasks}
          />
        )}
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
