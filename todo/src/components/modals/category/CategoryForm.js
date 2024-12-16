import React, { useState } from 'react'

// @@@@ [해야 할 일] @@@
// 카테고리 색상 더 추가

function CategoryForm() {
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름
  const [selectedColor, setSelectedColor] = useState(""); // 선택한 색상

  // 카테고리 색상 팔레트
  const colors = ["#49D7B1", "#F192A5", "#CEDDF2", "#F9D877", "#E59EDD"];

  return (
    <div className="form-add-category-container">
      {/* <form onSubmit={handleSubmit}> */}
      <form className="form-add-category">
        <input
          type="text"
          className="input-category-name"
          placeholder="카테고리 이름을 입력하세요"
        // value={}
        // onChange={handleCategoryChange}
        />
        <div className="color-palette">
          {colors.map((color) => (
            <div
              key={color}
              className="color-palette-item"
              style={{ backgroundColor: color }}
            >
            </div>
          ))}
        </div>
        <div>
          <button className="btn-save-category">저장</button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm;
