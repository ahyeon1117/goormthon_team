import OrderItem from "./OrderItem";
import * as S from './OrderItemList.styled';
import { BookItem } from "../../../../types";

// interface OrderItemType {
//     orderId: number;
//     productId: number;
//     title: string;
//     imageUrl: string;
//     price: number;
//   }

interface OrderItemListProps {
    orderItems: BookItem[];
}

const OrderItemList: React.FC<OrderItemListProps> = ({ orderItems }) => {
    return (
        <S.OrderItemList>
            {orderItems.map((item) => (
                <OrderItem
                    key={item.id}
                    orderItem={item}
                />
            ))}
        </S.OrderItemList>
    )
}

export default OrderItemList;