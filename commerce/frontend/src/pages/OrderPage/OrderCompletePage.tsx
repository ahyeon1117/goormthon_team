import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import OrderSteps from './components/Common/OrderSteps/OrderSteps';
import OrderItemList from './components/OrderItemList/OrderItemList';
import * as S from './OrderCompletePage.styled';

const OrderCompletePage: React.FC = () => {
    const location = useLocation();
    const { items = [], totalPrice = 0, paymentMethod = 'rocketPay' } = location.state || {};
    const [isItemOpen, setIsItemOpen] = useState<boolean>(true); // 주문상품 섹션 펼치기 여부

    // 섹션 펼치기 아이콘 클릭 핸들러
    const handleToggleOpen = () => {
        setIsItemOpen(!isItemOpen);
    }

    return (
        <S.OrderPageContainer>
            {/* 헤더 */}
            <S.OrderPageHeader>
                <OrderSteps step={'complete'} />
            </S.OrderPageHeader>
            <S.PageTitle>주문완료</S.PageTitle>

            {/* 주문 정보 섹션 */}
            <S.OrderSection>
                <S.OrderInfo>
                    <div>
                        <span>주문상품</span>
                        <span>{items?.length || 0}개</span>
                    </div>
                    <div onClick={handleToggleOpen}>
                        {isItemOpen ? <S.ArrowUpIcon /> : <S.ArrowDownIcon />}
                    </div>
                </S.OrderInfo>
                {/* 주문 상품 리스트 */}
                {isItemOpen && items?.length > 0 && <OrderItemList orderItems={items} />}
            </S.OrderSection>
            <S.OrderSection>
                <S.OrderInfo>
                    <div>
                        <span>최종 결제 금액</span>
                        <span>{totalPrice.toLocaleString()}원</span>
                    </div>
                </S.OrderInfo>
            </S.OrderSection>
            <S.OrderSection>
                <S.OrderInfo>
                    <div>
                        <span>결제수단</span>
                        <span>{paymentMethod}</span>
                    </div>
                </S.OrderInfo>
            </S.OrderSection>

        </S.OrderPageContainer>
    );
};

export default OrderCompletePage;