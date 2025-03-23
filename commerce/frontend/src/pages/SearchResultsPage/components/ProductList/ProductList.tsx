import React from 'react';
import { BookItem } from '../../../../types';
import ProductItem from './ProductItem.tsx';
import { ProductListContainer } from './ProductList.styled.ts';

interface ProductListProps {
  books: BookItem[];
  onToggleFavorite: (bookId: string) => void;
  onToggleCheck: (bookId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ books, onToggleFavorite, onToggleCheck }) => {
  return (
    <ProductListContainer>
      {books.map(book => (
        <ProductItem
          key={book.id}
          book={book}
          onToggleFavorite={onToggleFavorite}
          onToggleCheck={onToggleCheck}
        />
      ))}
    </ProductListContainer>
  );
};

export default ProductList;
