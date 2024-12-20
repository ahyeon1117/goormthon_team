import CategoryForm from "./CategoryForm";
import "../assets/css/category-modal.css";

// 버튼 SVG 경로
const BACK_SVG_PATH = "M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z";
const CLOSE_SVG_PATH = "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z";

function CategoryAddmModal({ isAddOpen, isEditOpen, editingCategory, categories, setCategories, openCategoryModal, closeCategoryModals }) {
  return (
    <section className="category-modal category-edit-modal">
      {/* 모달 헤더 */}
      <header className="modal-header edit-modal-header">
        <button
          className="btn-back-modal"
          onClick={() => openCategoryModal('isViewOpen')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path fill="#ffffff" d={BACK_SVG_PATH} />
          </svg>
        </button>
        <button
          className="btn-close-modal"
          onClick={closeCategoryModals}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path fill="#ffffff" d={CLOSE_SVG_PATH} />
          </svg>
        </button>
      </header>
      {/* 모달 바디 */}
      <section className="modal-body">
        <CategoryForm
          isAddOpen={isAddOpen}
          isEditOpen={isEditOpen}
          editingCategory={editingCategory}
          categories={categories}
          setCategories={setCategories}
          openCategoryModal={openCategoryModal}
        />
      </section>
    </section>
  )
}

export default CategoryAddmModal;