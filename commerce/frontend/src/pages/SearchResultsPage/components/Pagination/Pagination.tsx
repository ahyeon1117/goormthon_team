import React from 'react';
import { PaginationContainer } from './Pagination.styled';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (pageNumber: number) => void;
  pageRangeDisplayed?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  pageRangeDisplayed = 5
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pages = [];

  // 시작 페이지와 끝 페이지 계산
  let startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
  const endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1);

  // 시작 페이지 조정
  if (endPage - startPage + 1 < pageRangeDisplayed) {
    startPage = Math.max(1, endPage - pageRangeDisplayed + 1);
  }

  // 이전 페이지 버튼
  if (currentPage > 1) {
    pages.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        className="pagination-button prev"
      >
        이전
      </button>
    );
  }

  // 첫 페이지 버튼
  if (startPage > 1) {
    pages.push(
      <button
        key="first"
        onClick={() => onPageChange(1)}
        className="pagination-button"
      >
        1
      </button>
    );

    if (startPage > 2) {
      pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
    }
  }

  // 페이지 번호 버튼
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`pagination-button ${currentPage === i ? 'active' : ''}`}
      >
        {i}
      </button>
    );
  }

  // 마지막 페이지 버튼
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
    }

    pages.push(
      <button
        key="last"
        onClick={() => onPageChange(totalPages)}
        className="pagination-button"
      >
        {totalPages}
      </button>
    );
  }

  // 다음 페이지 버튼
  if (currentPage < totalPages) {
    pages.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        className="pagination-button next"
      >
        다음
      </button>
    );
  }

  return (
    <PaginationContainer>
      {pages}
    </PaginationContainer>
  );
};

export default Pagination;
