import React from 'react';
import { BookItem } from '../../../../types';
import {
  ProductItemContainer,
  ProductImage,
  ProductInfo,
  ProductTitle,
  ProductAuthor,
  ProductPrice,
  ProductRating,
  FavoriteButton,
  CartButton,
  BuyNowButton,
  ButtonsContainer,
  CheckboxContainer,
  Checkbox
} from './ProductList.styled';

interface ProductItemProps {
  book: BookItem;
  onToggleFavorite: (bookId: string) => void;
  onToggleCheck?: (bookId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  book,
  onToggleFavorite,
  onToggleCheck
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const handleAddToCart = () => {
    // 장바구니 추가 로직 구현
    console.log('장바구니에 추가:', book.id);
  };

  const handleBuyNow = () => {
    // 바로구매 로직 구현
    console.log('바로구매:', book.id);
  };

  const handleCheckToggle = () => {
    if (onToggleCheck) {
      onToggleCheck(book.id);
    }
  };

  return (
    <ProductItemContainer>
      <CheckboxContainer onClick={handleCheckToggle}>
        <Checkbox data-checked={book.isChecked} />
      </CheckboxContainer>

      <ProductImage>
        <img src={book.imageUrl || '/placeholder.jpg'} alt={book.title} />
        <div className="product-image-overlay">
          <button className="product-preview-button">미리보기</button>
        </div>
      </ProductImage>

      <ProductInfo>
        <ProductTitle>{book.title}</ProductTitle>
        <ProductAuthor>
          <span className="author">{book.author}</span>
          <span className="publisher">{book.publisher}</span>
          <span className="publish-date">{book.publishDate}</span>
        </ProductAuthor>
        <ProductPrice>{formatPrice(book.price)}</ProductPrice>
        <ProductRating>
          <span className="stars">★★★★★</span>
          <span className="rating">{book.rating}</span>
          <span className="review-count">({book.reviewCount})</span>
        </ProductRating>

        <ButtonsContainer>
          <FavoriteButton
            data-favored={book.isFavored}
            onClick={() => onToggleFavorite(book.id)}
            aria-label="찜하기"
          >
            {book.isFavored ? '❤️' : '🤍'}
          </FavoriteButton>

          <div className="product-action-buttons">
            <CartButton onClick={handleAddToCart}>
              장바구니
            </CartButton>
            <BuyNowButton onClick={handleBuyNow}>
              바로구매
            </BuyNowButton>
          </div>
        </ButtonsContainer>
      </ProductInfo>
    </ProductItemContainer>
  );
};

export default ProductItem;
