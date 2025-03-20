import React from 'react';
import { Link } from 'react-router-dom';
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
  Checkbox,
  FavoredHeartIcon,
  UnfavoredHeartIcon
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
        <Link to={`/detail/${book.id}`}>
          <img src={book.imageUrl || '/placeholder.jpg'} alt={book.title} />
          <div className="product-image-overlay">
            <button className="product-preview-button">미리보기</button>
          </div>
        </Link>
      </ProductImage>

      <ProductInfo>
        <Link to={`/detail/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ProductTitle>{book.title}</ProductTitle>
        </Link>
        <ProductAuthor>
          <span className="author">{book.author}</span>
          <span className="publisher">{book.publisher}</span>
          <span className="publish-date">{book.publishDate}</span>
        </ProductAuthor>
        <ProductPrice>{formatPrice(book.price)}</ProductPrice>
        <ProductRating>
          <span className="stars">★</span>
          <span className="rating">{book.rating}</span>
          <span className="review-count">({book.reviewCount})</span>
        </ProductRating>

        <ButtonsContainer>
          <FavoriteButton
            data-favored={book.isFavored}
            onClick={() => onToggleFavorite(book.id)}
            aria-label="찜하기"
          >
            {book.isFavored ? (
              <FavoredHeartIcon>
                <path d="M14.5 25.5C14.5 25.5 1 14.5 1 8.5C1 4.5 4 1 8.5 1C11.5 1 14.5 3 14.5 5.5C14.5 3 17.5 1 20.5 1C25 1 28 4.5 28 8.5C28 14.5 14.5 25.5 14.5 25.5Z" />
              </FavoredHeartIcon>
            ) : (
              <UnfavoredHeartIcon>
                <path d="M14.5 25.5C14.5 25.5 1 14.5 1 8.5C1 4.5 4 1 8.5 1C11.5 1 14.5 3 14.5 5.5C14.5 3 17.5 1 20.5 1C25 1 28 4.5 28 8.5C28 14.5 14.5 25.5 14.5 25.5Z" />
              </UnfavoredHeartIcon>
            )}
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
