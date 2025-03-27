import styled from 'styled-components';

export const OrderItemList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 40px 20px 25px;

    &:first-child {
        border-top: 1px solid #D9D9D9;
    }

    &:not(:last-child) {
        border-bottom: 1px solid #D9D9D9;
    }
`;

export const ProductInfoWrapper = styled.div`
    display: flex;
    gap: 15px;
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
    width: 450px;

    > .product-tag {
        display: flex;
        justify-content: center;
        width: 60px;
        padding: 2px 0;
        background-color: #E896FF;
        color: #FFF;
        font-size: 12px;
        border-radius: 1px;
    }

    > .product-title {
        font-size: 15px;
        color: #000;
    }
`;

export const ProductPrice = styled.div`
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    color: #000;
`;