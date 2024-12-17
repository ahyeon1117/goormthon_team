import React, { useContext } from 'react'
import { CategoryContext } from '../../../context/CategoryContext';
import CategoryViewModal from './CategoryViewModal';
import CategoryAddModal from './CategoryAddModal';


function CategoryModals() {
  const {categoryModals} = useContext(CategoryContext);

  return (
    <>
      {/* 카테고리 조회 모달 */}
      {categoryModals.isViewOpen && (
        <CategoryViewModal />
      )}

      {/* 카테고리 추가 모달 */}
      {categoryModals.isAddOpen && (
        <CategoryAddModal />
      )}
    </>
  )
}

export default CategoryModals;