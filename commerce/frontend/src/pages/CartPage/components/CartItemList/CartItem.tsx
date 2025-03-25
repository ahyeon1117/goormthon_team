import { useState } from "react";
import * as S from "./CartItemList.styled";

// 임시 데이터
interface CartItemType {
    cartId: number;
    productId: number;
    title: string;
    imageUrl: string;
    price: number;
}

interface Props {
    item: CartItemType;
}

const CartItem: React.FC<Props> = ({ item }) => {
    const [isChecked, setIsChecked] = useState(true);

    return (
        <S.CartItem>
            <S.ProductInfoWrapper>
                {/* 체크박스 */}
                {isChecked ? <S.CheckedIcon /> : <S.UncheckedIcon />}
                {/* 상품 이미지 */}
                <S.ProductImage>
                    <img src={item.imageUrl} alt="" className="product-image" />
                </S.ProductImage>
                {/* 상품 정보 */}
                <S.ProductInfo>
                    <div className="product-tag">소득공제</div>
                    <div className="product-title">{item.title}</div>
                </S.ProductInfo>
            </S.ProductInfoWrapper>

            {/* 수량 조절 버튼 */}
            <S.QuantityControl>
                <div>
                    <S.QuantityButton>-</S.QuantityButton>
                    <S.QuantityInput type="number" value="1" min="1" />
                    <S.QuantityButton>+</S.QuantityButton>
                </div>
            </S.QuantityControl>
            {/* 가격 정보 */}
            <S.ProductPrice>{item.price.toLocaleString()}원</S.ProductPrice>
            {/* 상품 삭제 버튼 */}
            <S.DeleteButtonWrapper>
                <S.DeleteIcon />
            </S.DeleteButtonWrapper>

        </S.CartItem>
    )
}

export default CartItem;