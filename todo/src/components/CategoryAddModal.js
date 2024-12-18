import CategoryForm from "./CategoryForm";
import "../assets/css/category-modal.css";

function CategoryAddModal({ categories, setCategories, changeCategoryModal }) {

    return (
        // 모달 최상위 컨테이너
        <div className="category-modal category-add-modal">
            {/* 모달 콘텐츠 영역 */}
            <div className="modal-content">
                {/* 모달 헤더 */}
                <header className="modal-header add-modal-header">
                    <button className="btn-back-modal" onClick={() => changeCategoryModal({ isAddOpen: false, isViewOpen: true })}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="#ffffff" d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                        </svg>
                    </button>
                    <button className="btn-close-modal" onClick={() => changeCategoryModal({ isAddOpen: false })}>
                        <svg className="svg-close-modal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                        </svg>
                    </button>
                </header>
                {/* 모달 바디 */}
                <div className="modal-body">
                    <div className="modal-body__header">
                        <div className="modal-title">카테고리 추가</div>
                    </div>
                    <CategoryForm
                        categories={categories}
                        setCategories={setCategories}
                        changeCategoryModal={changeCategoryModal}
                    />
                </div> {/* .modal-body */}
            </div> {/* .modal-content */}
        </div> // .category-view-modal
    )
}

export default CategoryAddModal;
