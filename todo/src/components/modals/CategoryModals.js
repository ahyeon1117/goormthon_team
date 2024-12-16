import React, { useContext } from 'react'
import { CategoryContext } from '../../context/CategoryContext';
import CategoryViewModal from './CategoryViewModal';

export default function CategoryModals() {
  const {categoryModals} = useContext(CategoryContext);

  return (
    <>
      {/* 카테고리 조회 모달 */}
      {categoryModals.isViewOpen && (
        <CategoryViewModal />
      )}
    </>
  )
}
