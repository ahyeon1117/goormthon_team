import { Link } from 'react-router-dom';
import { BookItem, DirectOrderItemType } from '../../../../types';
import * as S from './OrderItemList.styled';


interface OrderItemProps {
    orderItem: BookItem | DirectOrderItemType;
}

const OrderItem: React.FC<OrderItemProps> = ({ orderItem }) => {
    return (
        <S.OrderItem>
            <S.ProductInfoWrapper>
                {/* 상품 이미지 */}
                <Link to={`/detail/${'id' in orderItem ? orderItem.id : orderItem.productId}`}>
                    <S.ProductImage>
                        <img
                            src={'id' in orderItem ? orderItem.imageUrl : orderItem.image} // 장바구니 상품일 경우 imageUrl, 바로구매 상품일 경우 image
                            alt={orderItem.title}
                            className="product-image"
                        />
                    </S.ProductImage>
                </Link>
                {/* 상품 정보 */}
                <S.ProductInfo className="product-info">
                    <div className="product-tag">소득공제</div>
                    <div className="product-title">{orderItem.title}</div>
                </S.ProductInfo>
            </S.ProductInfoWrapper>

            {/* 가격 정보 */}
            <S.ProductPrice>{'id' in orderItem ? orderItem.price.toLocaleString() : orderItem.discount.toLocaleString()}원</S.ProductPrice>
        </S.OrderItem>
    )
}

export default OrderItem;