import React, { useState } from 'react'

function CategoryForm({ categories, setCategories, changeCategoryModal }) {

  // 새로 추가할 카테고리의 state
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름
  const [selectedColor, setSelectedColor] = useState(""); // 선택한 색상

  // 카테고리 색상 팔레트
  const colorPalette = [
    "#FFD1FF", "#FFBFCF", "#FEADCE", "#F092A5", "#EA5E76",
    "#FFCC99", "#F8B195", "#FFB89F",
    "#FFECB3", "#FBE7A1",  "#FDFD96", "#FDE293", "#FFEEAD",
    "#A8E6CF", "#B2F2BB", "#CDEACE", "#C5E1A5", "#49D7B1",
    "#C5EAF7", "#B3D8F2", "#A2DFF2", "#BFD7ED",
    "#E6E6FA", "#D8BFD8", "#C8A2C8", "#D1CFE2", "#E0B0FF",
  ];

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

    changeCategoryModal({ isAddOpen: false, isViewOpen: true }); // 카테고리 편집 모달로 돌아가기
  }


  return (
    <div className="form-add-category-container">
      <form onSubmit={handleCategorySubmit}>
        <input
          type="text"
          className="input-category-name"
          placeholder="카테고리 이름을 입력하세요"
          value={categoryName}
          onChange={handleCategoryName}
        />
        <div className="color-palette">
          {colorPalette.map((color) => (
            <div
              key={color}
              className="color-palette-item"
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
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "25px",
                    height: "25px",
                    fill: "white",
                  }}
                >
                  <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="btn-save-category">저장</button>
      </form>
    </div>
  )
}

export default CategoryForm;
