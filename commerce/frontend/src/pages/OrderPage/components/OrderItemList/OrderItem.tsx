import * as S from './OrderItemList.styled';

interface OrderItemType {
    orderId: number;
    productId: number;
    title: string;
    imageUrl: string;
    price: number;
}

interface Props {
    orderItem: OrderItemType;
}

const OrderItem: React.FC<Props> = ({ orderItem }) => {
    return (
        <S.OrderItem>
            <S.ProductInfoWrapper>
                {/* 상품 이미지 */}
                <S.ProductImage>
                    <img src={orderItem.imageUrl} alt="" className="product-image" />
                </S.ProductImage>
                {/* 상품 정보 */}
                <S.ProductInfo className="product-info">
                    <div className="product-tag">소득공제</div>
                    <div className="product-title">{orderItem.title}</div>
                </S.ProductInfo>
            </S.ProductInfoWrapper>

            {/* 가격 정보 */}
            <S.ProductPrice>{orderItem.price.toLocaleString()}원</S.ProductPrice>
        </S.OrderItem>
    )
}

export default OrderItem;