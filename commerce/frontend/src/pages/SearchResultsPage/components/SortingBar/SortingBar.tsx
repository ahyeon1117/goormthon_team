import React from 'react';
import { SortingBarStyled, HeartIcon, CartIcon } from '../../SearchResultsPage.styled';
import { SortOption } from '../../../../types';

interface SortingBarProps {
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (sortId: string) => void;
  itemsPerPageOptions: { id: string; label: string }[];
  selectedItemsPerPage: string;
  onItemsPerPageChange: (count: string) => void;
  onAddToWishlist?: () => void;
  onAddToCart?: () => void;
  cartLoading?: boolean;
}

const SortingBar: React.FC<SortingBarProps> = ({
  sortOptions,
  selectedSort,
  onSortChange,
  itemsPerPageOptions,
  selectedItemsPerPage,
  onItemsPerPageChange,
  onAddToWishlist,
  onAddToCart,
  cartLoading = false
}) => {
  return (
    <SortingBarStyled>
      <button
        className="product-wishlist-button"
        onClick={onAddToWishlist}
      >
        <HeartIcon>
          <path d="M14.5 25.5C14.5 25.5 1 14.5 1 8.5C1 4.5 4 1 8.5 1C11.5 1 14.5 3 14.5 5.5C14.5 3 17.5 1 20.5 1C25 1 28 4.5 28 8.5C28 14.5 14.5 25.5 14.5 25.5Z" />
        </HeartIcon>
      </button>
      <button
        className="product-cart-add-button"
        onClick={onAddToCart}
        disabled={cartLoading}
        style={{ opacity: cartLoading ? 0.7 : 1 }}
      >
        <CartIcon />
        장바구니 담기
      </button>
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
