import React from 'react';
import { BookItem } from '../../../../types';
import ProductItem from './ProductItem.tsx';
import { ProductListContainer } from './ProductList.styled.ts';

interface ProductListProps {
  books: BookItem[];
  onToggleFavorite: (bookId: string) => void;
  onToggleCheck: (bookId: string) => void;
  onProductClick?: (bookId: string) => void;
  onAddToCart?: (bookId: string, isChecked: boolean) => void;
  onPurchase?: (bookId: string, isChecked: boolean) => void;
}

const ProductList: React.FC<ProductListProps> = ({ books, onToggleFavorite, onToggleCheck, onProductClick, onAddToCart, onPurchase }) => {
  return (
    <ProductListContainer>
      {books.map(book => (
        <ProductItem
          key={book.id}
          book={book}
          onToggleFavorite={onToggleFavorite}
          onToggleCheck={onToggleCheck}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onPurchase={onPurchase}
        />
      ))}
    </ProductListContainer>
  );
};

export default ProductList;
