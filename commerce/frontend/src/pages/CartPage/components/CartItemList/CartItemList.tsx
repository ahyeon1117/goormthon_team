import { BookItem } from "../../../../types";
import CartItem from "./CartItem";
import * as S from "./CartItemList.styled";

interface Props {
  cartBooks: BookItem[];
  checkedItems: string[];
  onItemCheck: (bookId: string) => void;
  onDelete: (bookId: string) => void;
}

const CartItemList: React.FC<Props> = ({ cartBooks, checkedItems, onItemCheck, onDelete }) => {

  return (
    <S.CartItemList>
      {cartBooks.map((book) => (
        <CartItem
          key={book.id}
          cartItem={book}
          isChecked={checkedItems.includes(book.id)}
          onItemCheck={onItemCheck}
          onDelete={onDelete}
        />
      ))}
    </S.CartItemList>
  )
}

export default CartItemList;