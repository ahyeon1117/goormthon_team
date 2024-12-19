import React, { useState, useEffect } from 'react'
import colors from '../json/category/colors.json';

const CHECK_SVG_PATH = "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z";
const checkSVGStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "25px",
  height: "25px",
  fill: "white",
}
const categoryColors = colors.colors; // 카테고리 색상 코드

function CategoryForm({ isAddOpen, isEditOpen, editingCategory, categories, setCategories, openCategoryModal }) {

  // 추가 및 수정할 카테고리 정보
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름
  const [selectedColor, setSelectedColor] = useState(""); // 선택한 색상

  // 추가 및 수정 시 카테고리 정보 업데이트
  useEffect(() => {
    if (isAddOpen) { // 추가 모달인 경우
      setCategoryName("");
      setSelectedColor("");
    } else if (isEditOpen) { // 편집 모달인 경우
      setCategoryName(editingCategory.name);
      setSelectedColor(editingCategory.color);
    }
  }, [isEditOpen, isAddOpen, editingCategory]);

  // input 입력 시 카테고리명 상태 변경 핸들러
  const handleCategoryName = (e) => {
    setCategoryName(e.target.value);
  }

  // 폼 제출 핸들러 (추가 및 수정)
  const handleCategorySubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!categoryName.trim()) {
      alert("카테고리 이름을 입력해주세요.");
      return;
    }
    if (!selectedColor) {
      alert("카테고리 색상을 선택해주세요.");
      return;
    }

    let newCategoryData; // 추가 및 수정 카테고리 데이터

    if (isAddOpen) { // 카테고리 추가
      newCategoryData = {
        id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 0,
        name: categoryName,
        color: selectedColor,
      }

      setCategories(prev => [...prev, newCategoryData]); // 상태 업데이트
      localStorage.setItem("categories", JSON.stringify([...categories, newCategoryData])); // 로컬 스토리지 업데이트

    } else if (isEditOpen) { // 카테고리 수정
      newCategoryData = {
        id: editingCategory.id,
        name: categoryName,
        color: selectedColor,
      }

      // 해당 카테고리만 업데이트
      const updatedCategories = categories.map(category =>
        category.id === editingCategory.id ? newCategoryData : category
      );

      setCategories(updatedCategories); // 상태 업데이트
      localStorage.setItem("categories", JSON.stringify(updatedCategories)); // 로컬 스토리지 업데이트
    }

    setCategoryName(""); // 카테고리 input 초기화
    openCategoryModal('isViewOpen'); // 카테고리 조회 모달로 돌아가기
  }

  // 카테고리 삭제 핸들러
  const handleCategoryDelete = (e) => {
    e.preventDefault();

    if (window.confirm("정말로 삭제하시겠습니까?")) {
      // 해당 카테고리 삭제
      const updatedCategories = categories.filter(category => category.id !== editingCategory.id);

      setCategories(updatedCategories); // 상태 업데이트
      localStorage.setItem("categories", JSON.stringify(updatedCategories)); // 로컬 스토리지 업데이트

      openCategoryModal('isViewOpen'); // 카테고리 조회 모달로 돌아가기
    }
  }

  return (
    <section className="category-form-section">
      <form
        className="category-form"
        onSubmit={handleCategorySubmit}
      >
        <section className="category-input-section">
          <input
            type="text"
            className="input-category-name"
            placeholder="카테고리 이름을 입력하세요"
            value={categoryName}
            onChange={handleCategoryName}
            autoFocus={isEditOpen}
          />
        </section>
        <section className="category-color-section">
          {categoryColors.map((color) => (
            <div
              key={color}
              className="category-color-item"
              onClick={() => setSelectedColor(color)}
              style={{
                backgroundColor: color,
                position: "relative",
              }}
            >
              {selectedColor === color && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={checkSVGStyle}
                >
                  <path d={CHECK_SVG_PATH} />
                </svg>
              )}
            </div>
          ))}
        </section>
        <footer className="category-form-footer">
          <button
            type="submit"
            className="btn-save-category"
            onClick={handleCategorySubmit}
          >
            {isAddOpen ? "추가" : "수정"}
          </button>
          {isEditOpen && (
            <button
              className="btn-delete-category"
              onClick={handleCategoryDelete}
            >
              삭제
            </button>
          )}
        </footer>
      </form>
    </section>
  )
}

export default CategoryForm;
