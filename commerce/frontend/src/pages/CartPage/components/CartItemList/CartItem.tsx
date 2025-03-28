import * as S from "./CartItemList.styled";
import { BookItem } from "../../../../types";

interface Props {
    cartItem: BookItem;
    isChecked: boolean;
    onItemCheck: (id: string) => void;
    onDelete: (id: string) => void;
}

const CartItem: React.FC<Props> = ({ cartItem, isChecked, onItemCheck, onDelete }) => {

    return (
        <S.CartItem>
            <S.ProductInfoWrapper>
                {/* 체크박스 */}
                <div onClick={() => onItemCheck(cartItem.id)}>
                    {isChecked ? <S.CheckedIcon /> : <S.UncheckedIcon />}
                </div>
                {/* 상품 이미지 */}
                <S.ProductImage>
                    <img src={cartItem.imageUrl} alt="" className="product-image" />
                </S.ProductImage>
                {/* 상품 정보 */}
                <S.ProductInfo className="product-info">
                    <div className="product-tag">소득공제</div>
                    <div className="product-title">{cartItem.title}</div>
                </S.ProductInfo>
            </S.ProductInfoWrapper>

            {/* 가격 정보 */}
            <S.ProductPrice>{cartItem.price.toLocaleString()}원</S.ProductPrice>
            {/* 상품 삭제 버튼 */}
            <S.DeleteButtonWrapper>
                <S.DeleteIcon onClick={() => onDelete(cartItem.id)}/>
            </S.DeleteButtonWrapper>

        </S.CartItem>
    )
}

export default CartItem;