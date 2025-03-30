import OrderItem from "./OrderItem";
import * as S from './OrderItemList.styled';
import { BookItem, DirectOrderItemType } from "../../../../types";

interface OrderItemListProps {
    orderItems: (BookItem | DirectOrderItemType)[];
}

const OrderItemList: React.FC<OrderItemListProps> = ({ orderItems }) => {
    return (
        <S.OrderItemList>
            {orderItems.map((item) => (
                <OrderItem
                    key={'id' in item ? item.id : item.productId} // 장바구니 상품일 경우 id, 바로구매 상품일 경우 productId
                    orderItem={item}
                />
            ))}
        </S.OrderItemList>
    )
}

export default OrderItemList;