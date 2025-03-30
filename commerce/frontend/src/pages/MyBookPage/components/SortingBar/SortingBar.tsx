import React from 'react';
import { SortingBarStyled, HeartIcon, CartIcon } from '../../MyBookPage.styled';

interface SortingBarProps {
  sortOptions: { value: string; label: string }[];
  selectedSort: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  itemsPerPageOptions: { value: number; label: string }[];
  selectedItemsPerPage: number;
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddToWishlist?: () => void;
  onAddToCart?: () => void;
}

const SortingBar: React.FC<SortingBarProps> = ({
  sortOptions,
  selectedSort,
  onSortChange,
  itemsPerPageOptions,
  selectedItemsPerPage,
  onItemsPerPageChange,
  onAddToWishlist,
  onAddToCart
}) => {
  return (
    <SortingBarStyled>
      {onAddToWishlist && (
        <button
          className="product-wishlist-button"
          onClick={onAddToWishlist}
        >
          <HeartIcon>
            <path d="M14.5 25.5C14.5 25.5 1 14.5 1 8.5C1 4.5 4 1 8.5 1C11.5 1 14.5 3 14.5 5.5C14.5 3 17.5 1 20.5 1C25 1 28 4.5 28 8.5C28 14.5 14.5 25.5 14.5 25.5Z" />
          </HeartIcon>
        </button>
      )}

      {onAddToCart && (
        <button
          className="product-cart-add-button"
          onClick={onAddToCart}
        >
          <CartIcon />
          장바구니 담기
        </button>
      )}

      <select
        className="sort-select"
        value={selectedSort}
        onChange={onSortChange}
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <select
        className="items-per-page-select"
        value={selectedItemsPerPage}
        onChange={onItemsPerPageChange}
      >
        {itemsPerPageOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </SortingBarStyled>
  );
};

export default SortingBar;
