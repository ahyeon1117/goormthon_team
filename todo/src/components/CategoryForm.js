import React, { useState } from 'react'
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

function CategoryForm({ isAddOpen, isEditOpen, categories, setCategories, openCategoryModal }) {

  // 새로 추가할 카테고리의 state
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름
  const [selectedColor, setSelectedColor] = useState(""); // 선택한 색상

  // 카테고리 색상 팔레트
  const categoryColors = colors.colors;

  // 카테고리 이름 상태 변경
  const handleCategoryName = (e) => {
    setCategoryName(e.target.value);
  }

  // 폼 제출 핸들러
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

    // 새로운 카테고리 데이터
    let newCategory = {
      id: Date.now(),
      name: categoryName,
      color: selectedColor,
    };

    // 새로운 카테고리 추가
    setCategories(prev => [...prev, newCategory]);
    localStorage.setItem("categories", JSON.stringify([...categories, newCategory]));

    setCategoryName(""); // 카테고리 input 초기화

    openCategoryModal('isViewOpen'); // 카테고리 편집 모달로 돌아가기
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
          <button type="submit" className="btn-save-category">저장</button>
        </footer>
      </form>
    </section>
  )
}

export default CategoryForm;
