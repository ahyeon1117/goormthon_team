import OrderItem from "./OrderItem";
import * as S from './OrderItemList.styled';

interface OrderItemType {
    orderId: number;
    productId: number;
    title: string;
    imageUrl: string;
    price: number;
  }

interface Props {
    orderItems: OrderItemType[];
}

const OrderItemList: React.FC<Props> = ({ orderItems }) => {
    return (
        <S.OrderItemList>
            {orderItems.map((item) => (
                <OrderItem
                    key={item.orderId}
                    orderItem={item}
                />
            ))}
        </S.OrderItemList>
    )
}

export default OrderItemList;