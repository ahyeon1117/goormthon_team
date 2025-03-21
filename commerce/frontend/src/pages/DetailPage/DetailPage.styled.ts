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
  background-color: #e078ca;
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
`;

export const QuantityButton = styled.button`
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
`;

export const TotalPriceValue = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #e078ca;
`;

export const ButtonsSection = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 0px;
  margin-bottom: 0px;
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
`;

export const FavoredHeartIcon = styled.svg.attrs({
  width: "29",
  height: "27",
  viewBox: "0 0 29 27",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
})`
  path {
    fill: #EE0000;
    stroke: #EE0000;
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
`;

export const PurchaseButton = styled.button`
  flex: 1;
  padding: 15px;
  background: #e078ca;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;

  &:hover {
    background: #d066b9;
  }
`;

export const TabsSection = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  padding: 15px 25px;
  background: ${props => props.$active ? '#fff' : '#f4f4f4'};
  border: 1px solid #ddd;
  border-bottom: ${props => props.$active ? 'none' : '1px solid #ddd'};
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
  cursor: pointer;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  position: relative;
  bottom: -1px;

  &:hover {
    background: #fff;
  }
`;
