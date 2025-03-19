import styled from 'styled-components';

export const ProductListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProductItemContainer = styled.div`
  display: flex;
  padding: 20px 0px;
  border-bottom: 1px solid #eee;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: top;
  justify-content: center;
  width: 40px;
  margin-right: 10px;
`;

interface CheckboxProps {
  'data-checked'?: boolean;
}

export const Checkbox = styled.div<CheckboxProps>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${props => props['data-checked'] ? '#e896ff' : '#ddd'};
  background-color: ${props => props['data-checked'] ? '#e896ff' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:after {
    content: '';
    display: ${props => props['data-checked'] ? 'block' : 'none'};
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
  }

  &:hover {
    border-color: #e896ff;
  }
`;

export const ProductImage = styled.div`
  width: 120px;
  height: 170px;
  margin-right: 20px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid #eee;
  }

  .product-image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    padding: 5px;

    .product-preview-button {
      width: 100%;
      padding: 5px;
      background: transparent;
      color: white;
      border: 1px solid white;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  &:hover .product-image-overlay {
    display: block;
  }
`;

export const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;

  .actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
  }
`;

export const ProductTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

export const ProductAuthor = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;

  span {
    margin-right: 10px;

    &:after {
      content: '|';
      margin-left: 10px;
      color: #ddd;
    }

    &:last-child:after {
      content: '';
    }
  }
`;

export const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

export const ProductRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .stars {
    color: #FFD700;
    margin-right: 5px;
  }

  .rating {
    font-weight: bold;
    margin-right: 5px;
  }

  .review-count {
    color: #666;
  }
`;

export const ButtonsContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;

  .product-action-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 80px;
  }
`;

interface FavoriteButtonProps {
  'data-favored'?: boolean;
}

export const FavoriteButton = styled.button<FavoriteButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props['data-favored'] ? '#ffebee' : 'white'};
  border: 1px solid ${props => props['data-favored'] ? '#ff8a80' : '#ddd'};
  color: ${props => props['data-favored'] ? '#e53935' : '#666'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  align-self: flex-end;
  margin-bottom: 20px;

  &:hover {
    background: ${props => props['data-favored'] ? '#ffcdd2' : '#f5f5f5'};
  }
`;

export const CartButton = styled.button`
  padding: 8px 15px;
  border-radius: 4px;
  background: white;
  border: 1px solid #ddd;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  width: 100%;

  &:hover {
    background: #f5f5f5;
  }
`;

export const BuyNowButton = styled.button`
  padding: 8px 15px;
  border-radius: 4px;
  background: #e896ff;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 13px;
  width: 100%;

  &:hover {
    background: #d87ee9;
  }
`;
