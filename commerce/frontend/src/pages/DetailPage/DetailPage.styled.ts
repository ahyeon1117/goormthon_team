import styled from 'styled-components';

export const DetailPageWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

export const DetailContainer = styled.div`
  display: flex;
  gap: 60px;
  margin-bottom: 100px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ProductImage = styled.img`
  width: 350px;
  height: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }
`;

export const ProductDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const ProductInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const BookTypeTag = styled.span`
  align-self: flex-start;
  background-color: #E896FF;
  color: white;
  padding: 4px 8px;
  border-radius: 1px;
  font-size: 12px;
  margin-bottom: 0px;
`;

export const ProductTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const ProductAuthor = styled.p`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  margin-bottom: 0px;
`;

export const ProductPublisher = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  margin-bottom: 0px;
`;

export const ProductRating = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 0px;

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

export const PriceSection = styled.div`
  margin-top: 0px;
  margin-bottom: 20px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

export const Price = styled.p`
  margin: 20px 0px;
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

export const ShippingInfoSection = styled.div`
  margin-bottom: 10px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 15px;
  color: #333;
`;

export const ShippingInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-right: 20px;

  span:last-child {
    display: flex;
    align-items: center;
  }
`;

export const QuantityAndPriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  &:focus, &:focus-visible {
    outline: none;
  }
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0px 20px;

  > div {
    display: flex;
    align-items: center;
  }

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
  }
`;

export const QuantityButton = styled.button.attrs<{ tabIndex: number }>({
  tabIndex: -1,  // number 타입으로 명시
})`
  width: 30px;
  height: 30px;
  background: #f4f4f4;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: #e9e9e9;
  }

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    box-shadow: none;
    border: 1px solid transparent; /* 포커스 시 테두리 제거 */
  }
  
`;

export const QuantityInput = styled.input`
  width: 40px;
  height: 30px;
  border: 1px solid #ddd;
  text-align: center;
  margin: 0 5px;

  // 화살표 숨기기
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  &:focus, &:focus-visible {
    outline: none;
  }
`;

export const TotalPriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0px 20px;
  
`;

export const TotalPriceLabel = styled.span`
  font-size: 16px;
  font-weight: bold;

  &:focus {
    outline: none;
  }
`;

export const TotalPriceValue = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #E896FF;

  &:focus {
    outline: none;
  }
`;

export const ButtonsSection = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 0px;
  margin-bottom: 0px;

  &:focus {
    outline: none;
  }
`;

export const WishlistButton = styled.button`
  flex: 1;
  height: 50px;
  background: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: #f9f9f9;
  }

  &:focus {
    outline: none;
  }
`;

export const FavoredHeartIcon = styled.svg.attrs({
  width: "29",
  height: "27",
  viewBox: "0 0 29 27",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
})`
  path {
    fill: #e896ff;
    stroke: #e896ff;
  }

  &:focus {
    outline: none;
  }
`;

export const UnfavoredHeartIcon = styled.svg.attrs({
  width: "29",
  height: "27",
  viewBox: "0 0 29 27",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
})`
  path {
    stroke: #CCCCCC;
  }

  &:focus {
    outline: none;
  }
`;

export const CartButton = styled.button`
  flex: 1;
  padding: 15px;
  background: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;

  &:hover {
    background: #f9f9f9;
  }
  &:focus,
  &:focus-visible {
    outline: none; /* 기본 파란색 테두리 제거 */
  }
`;

export const PurchaseButton = styled.button`
  flex: 1;
  padding: 15px;
  background: #E896FF;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;

  &:hover {
    background: #d95cfb;
  }
  &:focus {
    outline: none;
  }
`;

export const TabsSection = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
  
  &:focus {
    outline: none;
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 15px 20px;
  background: transparent;
  color: ${({ $active }) => ($active ? "#333" : "#999")};
  border: none;
  border-bottom: ${({ $active }) => ($active ? "2px solid #333" : "none")};
  cursor: pointer;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  border-radius: 0;
  outline: none;

  &:hover {
    background: transparent;
    color: #333;
  }

  &:focus {
    outline: none;
  }
  
`;

export const TabContent = styled.div`
  padding: 20px 0;
`;

export const BookDescriptionSection = styled.div`
  margin-bottom: 50px;
`;

export const BookDescriptionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

export const BookDescriptionText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  white-space: pre-line;
  margin-bottom: 20px;
`;

export const BookInfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const BookInfoRow = styled.tr`
  border-bottom: none;
  padding: 5px 0;
`;

export const BookInfoLabel = styled.td`
  padding: 10px 0;
  width: 120px;
  color: #666;
`;

export const BookInfoValue = styled.td`
  padding: 10px 0;
`;

// 리뷰 작성 폼 스타일
export const ReviewForm = styled.div`
  margin-bottom: 30px;
`;

export const ReviewTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

export const ReviewInput = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #9a9a9a;
  }
`;

export const ReviewButton = styled.button`
  padding: 10px 15px;
  background-color: #E896FF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d95cfb;
  }

  &:focus, &:focus-visible {
    outline: none;
  }
`;

// 리뷰 목록 스타일
export const ReviewList = styled.div`
  margin-top: 30px;
`;

export const ReviewItem = styled.div`
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const ReviewAuthor = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

export const ReviewText = styled.p`
  font-size: 14px;
  color: #555;
`;

