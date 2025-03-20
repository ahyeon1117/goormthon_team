import styled from 'styled-components';

export const DetailPageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const ProductInfoSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;

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
`;

export const ProductTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const ProductAuthor = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 5px;
`;

export const ProductPublisher = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

export const ProductRating = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`;

export const PriceSection = styled.div`
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

export const Price = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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

export const ButtonsSection = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const CartButton = styled.button`
  flex: 1;
  padding: 15px;
  background: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 16px;

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

  &:hover {
    background: #d066b9;
  }
`;

export const TabsSection = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
`;

export const TabButton = styled.button<{ active?: boolean }>`
  padding: 15px 25px;
  background: ${props => props.active ? '#fff' : '#f4f4f4'};
  border: 1px solid #ddd;
  border-bottom: ${props => props.active ? 'none' : '1px solid #ddd'};
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  position: relative;
  bottom: -1px;

  &:hover {
    background: #fff;
  }
`;
