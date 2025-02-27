import React from 'react';
import { SortingBarStyled } from '../../SearchResultsPage.styled';
import { SortOption } from '../../../../types';

interface SortingBarProps {
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (sortId: string) => void;
  itemsPerPageOptions: { id: string; label: string }[];
  selectedItemsPerPage: string;
  onItemsPerPageChange: (count: string) => void;
}

const SortingBar: React.FC<SortingBarProps> = ({
  sortOptions,
  selectedSort,
  onSortChange,
  itemsPerPageOptions,
  selectedItemsPerPage,
  onItemsPerPageChange
}) => {
  return (
    <SortingBarStyled>
      <button className="product-wishlist-button">찜하기</button>
      <button className="product-cart-add-button">장바구니 담기</button>
      <select
        className="sort-select"
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map(option => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
      <select
        className="items-per-page-select"
        value={selectedItemsPerPage}
        onChange={(e) => onItemsPerPageChange(e.target.value)}
      >
        {itemsPerPageOptions.map(option => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </SortingBarStyled>
  );
};

export default SortingBar;
