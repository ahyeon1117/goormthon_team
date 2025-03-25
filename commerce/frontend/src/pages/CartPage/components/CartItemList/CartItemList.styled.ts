import styled from 'styled-components';
import { BsCheckCircle, BsCheckCircleFill } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';

export const CartItemList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const CartItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    border-bottom: 1px solid #D9D9D9;
`;

export const ProductInfoWrapper = styled.div`
    display: flex;
    gap: 15px;
`;

// 상품 선택 아이콘
export const CheckedIcon = styled(BsCheckCircleFill)`
    width: 24px;
    height: 24px;
    color: #E896FF;
    cursor: pointer;
`;
export const UncheckedIcon = styled(BsCheckCircle)`
    width: 24px;
    height: 24px;
    color: #D9D9D9;
    cursor: pointer;

    &:hover {
        color: #E896FF;
    }
`;

export const ProductImage = styled.div`
    width: 90px;
    height: 130px;
    border: 1px solid #D9D9D9;
    cursor: pointer;

    > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;

    > .product-tag {
        display: flex;
        justify-content: center;
        width: 60px;
        padding: 4px 0;
        background-color: #E896FF;
        color: #FFF;
        font-size: 12px;
        border-radius: 1px;
    }

    > .product-title {
        font-size: 16px;
        color: #000;
    }
`;

export const QuantityControl = styled.div`
    display: flex;
    align-items: center;

    > div {
        display: flex;
        align-items: center; 
    }
`;

export const QuantityButton = styled.button`
    width: 30px;
    height: 30px;
    background-color: #F4F4F4;
    border: 1px solid #DDD;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;

    &:hover {
        border: 1px solid #DDD;
        background-color: #E9E9E9;
    }
    
    &:focus {
        outline: none;
    }
`;

export const QuantityInput = styled.input`
    width: 40px;
    height: 30px;
    border: 1px solid #DDD;
    text-align: center;
    margin: 0 5px;

    // 화살표 숨기기
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;

    &:focus {
        outline: none;
    }
`;

export const ProductPrice = styled.div`
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    color: #000;
`;

export const DeleteButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 8px;
`;

export const DeleteIcon = styled(IoCloseOutline)`
    width: 30px;
    height: 30px;
    color: #D9D9D9;
    cursor: pointer;

    &:hover {
        color: #707070;
    }
`;