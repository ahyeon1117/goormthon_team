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
  onToggleCheck: (bookId: string) => void;
  onProductClick?: (bookId: string) => void;
  onAddToCart?: (bookId: string, isChecked: boolean) => void;
  onPurchase?: (bookId: string, isChecked: boolean) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  book,
  onToggleFavorite,
  onToggleCheck,
  onProductClick,
  onAddToCart,
  onPurchase
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (onAddToCart) {
      // 체크 상태를 전달하여 어떤 동작을 할지 결정
      onAddToCart(book.id, book.isChecked || false);
    } else {
      // 기존 장바구니 추가 로직 (fallback)
      console.log('장바구니에 추가:', book.id);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (onPurchase) {
      // 체크 상태를 전달하여 어떤 동작을 할지 결정
      onPurchase(book.id, book.isChecked || false);
    } else {
      // 기존 바로구매 로직 (fallback)
      console.log('바로구매:', book.id);
    }
  };

  const handleCheckToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (onToggleCheck) {
      onToggleCheck(book.id);
    }
  };

  const handleProductClick = (e: React.MouseEvent) => {
    if (onProductClick) {
      e.preventDefault();
      onProductClick(book.id);
    }
  };

  return (
    <ProductItemContainer>
      <CheckboxContainer onClick={handleCheckToggle}>
        <Checkbox data-checked={book.isChecked || false} />
      </CheckboxContainer>

      <ProductImage>
        <Link to={`/detail/${book.id}`} onClick={handleProductClick}>
          <img src={book.imageUrl || '/placeholder.jpg'} alt={book.title} />
          <div className="product-image-overlay">
            <button className="product-preview-button">미리보기</button>
          </div>
        </Link>
      </ProductImage>

      <ProductInfo>
        <Link to={`/detail/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleProductClick}>
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
            data-favored={book.isFavored || false}
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
