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
  checkedItems: number[];
  onItemCheck: (cartId: number) => void;
  onDelete: (cartId: number) => void;
}

const CartItemList: React.FC<Props> = ({ cartItems, checkedItems, onItemCheck, onDelete }) => {

  return (
    <S.CartItemList>
      {cartItems.map((item) => (
        <CartItem
          key={item.cartId}
          cartItem={item}
          isChecked={checkedItems.includes(item.cartId)}
          onItemCheck={onItemCheck}
          onDelete={onDelete}
        />
      ))}
    </S.CartItemList>
  )
}

export default CartItemList;