import React, { useContext } from 'react'
import { CategoryContext } from '../../../context/CategoryContext';
import "../../../assets/css/modals/category-modal.css";

function CategoryViewModal() {
  const { categories, changeCategoryModal } = useContext(CategoryContext);

  return (
    // 모달 최상위 컨테이너
    <div className="category-modal category-view-modal">
      {/* 모달 콘텐츠 영역 */}
      <div className="modal-content">
        {/* 모달 헤더 */}
        <header className="modal-header view-modal-header">
          <button className="btn-close-modal" onClick={() => changeCategoryModal({ isViewOpen: false })}>
            <svg className="svg-close-modal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </header>
        {/* 모달 바디 */}
        <div className="modal-body">
          <div className="modal-body__header">
            <div className="modal-title">카테고리 편집</div>
            <button className="btn-add-category" onClick={() => changeCategoryModal({ isViewOpen: false, isAddOpen: true })}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="#49D7B1" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
              </svg>
            </button>
          </div>
          <div className="modal-body__category-list">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-item"
                style={{ color: category.color }}
              >
                <div
                className="category-color"
                  style={{ backgroundColor: category.color }}
                >
                </div>
                <div className="category-name">{category.name}</div>
              </div>
            ))}
          </div>
        </div> {/* .modal-body */}
      </div> {/* .modal-content */}
    </div> // .category-view-modal
  );
}

export default CategoryViewModal;