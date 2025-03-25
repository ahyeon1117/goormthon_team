import CartItem from "./CartItem";
import * as S from "./CartItemList.styled";

interface CartItemType {
    cartId: number;
    productId: number;
    title: string;
    imageUrl: string;
    price: number;
}

interface Props {
    cartItems: CartItemType[];
}

const CartItemList: React.FC<Props> = ({ cartItems }) => {
    return (
        <S.CartItemList>
        {cartItems.map((item) => (
          <CartItem 
            key={item.cartId}
            item={item}    // 각 CartItem 컴포넌트에 item 객체 전체 전달
          />
        ))}
      </S.CartItemList>
    )
}

export default CartItemList;