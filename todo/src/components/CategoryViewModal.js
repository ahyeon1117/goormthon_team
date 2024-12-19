import "../assets/css/category-modal.css";

// 버튼 SVG 경로
const CLOSE_SVG_PATH = "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z";
const ADD_SVG_PATH = "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z";

function CategoryViewModal({ categories, setEditingCategory, openCategoryModal, closeCategoryModals }) {

  // 특정 카테고리 클릭 시 편집 모달 열기
  const handleCategoryClick = (editingCategory) => {
    setEditingCategory(editingCategory);
    openCategoryModal('isEditOpen');
  }

  return (
    <section className="category-modal category-view-modal">
      {/* 모달 헤더 */}
      <header className="modal-header view-modal-header">
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
      <div className="modal-body">
        <section className="modal-body__title-section">
          <div className="modal-title">카테고리 편집</div>
          <button
            className="btn-add-category"
            onClick={() => openCategoryModal('isAddOpen')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="#49D7B1" d={ADD_SVG_PATH} />
            </svg>
          </button>
        </section>
        <section className="modal-body__category-section">
          {categories.map((category) => (
            <div
              key={category.id}
              className="view-modal-category-item"
              style={{ color: category.color }}
              onClick={() => category.id !== 0 && handleCategoryClick(category)} /* 미지정 카테고리 클릭 불가 */
            >
              <div
                className="category-color"
                style={{ backgroundColor: category.color }}
              >
              </div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </section>
      </div> {/* .modal-body */}
    </section> // .category-modal
  );
}

export default CategoryViewModal;