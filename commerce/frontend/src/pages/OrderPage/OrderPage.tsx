import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderSteps from './components/Common/OrderSteps/OrderSteps';
import OrderItemList from './components/OrderItemList/OrderItemList';
import * as S from './OrderPage.styled';
import { useCart } from '../../hooks';
import { createOrder } from '../../api/orderApi';
import { BookItem } from '../../types';
const OrderPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarFixed, setIsSidebarFixed] = useState<boolean>(false); // 사이드바 고정 여부
    const [isItemOpen, setIsItemOpen] = useState<boolean>(true); // 주문상품 섹션 펼치기 여부
    const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(true); // 결제수단 섹션 펼치기 여부
    const [paymentMethod, setPaymentMethod] = useState<string>('rocketPay'); // 결제수단
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);
    const { totalCount, fetchCartItems } = useCart();
    const { items, isDirectPurchase, totalPrice } = location.state || {};

    // 다른 페이지 -> 주문 페이지로 이동 시 스크롤 처리
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        console.log('주문 페이지 렌더링', { items, isDirectPurchase, totalPrice });

        // 사이드바 고정 핸들러
        const handleScroll = () => {
            setIsSidebarFixed(window.scrollY > 170);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    // 섹션 펼치기 아이콘 클릭 핸들러
    const handleToggleOpen = (section: 'item' | 'payment') => {
        if (section === 'item') {
            setIsItemOpen(!isItemOpen);
        } else {
            setIsPaymentOpen(!isPaymentOpen);
        }
    }

    // 결제하기 버튼 클릭 핸들러
    const handlePaymentClick = async () => {
        try {
            setIsLoading(true);
            // setError(null);

            // 상품 주문 API 호출
            const array = isDirectPurchase 
                ? [items[0].productId] // 바로구매인 경우
                : items.map((item: BookItem) => Number(item.id)); // 장바구니 구매인 경우

            const response = await createOrder(paymentMethod, array);

            if (response) {
                console.log('장바구니 상품 주문 성공:', response);
                
                await fetchCartItems(); // 장바구니 데이터 갱신
                alert('주문이 완료되었습니다!');
                navigate('/'); // 임시
                // navigate(`/payment/${response.id}`);
            }
        } catch (error) {
            console.error('주문 처리 중 오류 발생:', error);
            // setError('주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <S.OrderPageContainer>
            {/* 헤더 */}
            <S.OrderPageHeader>
                <div>주문/결제</div>
                <OrderSteps step={'order'} />
            </S.OrderPageHeader>

            {/* 메인 */}
            <S.OrderMain>
                {/* 주문 정보 섹션 */}
                <S.OrderSection>
                    {/* 주문 상품 섹션 */}
                    <S.ItemSection>
                        <S.ItemHeader>
                            <div>
                                <span>주문상품</span>
                                <span>{items.length}개</span>
                            </div>
                            <div onClick={() => handleToggleOpen('item')}>
                                {isItemOpen ? <S.ArrowUpIcon /> : <S.ArrowDownIcon />}
                            </div>
                        </S.ItemHeader>

                        {/* 주문 상품 리스트 */}
                        {isItemOpen && <OrderItemList orderItems={items} />}
                    </S.ItemSection>

                    {/* 결제수단 섹션 */}
                    <S.PaymentMethodSection>
                        <S.PaymentHeader>
                            <div>결제수단</div>
                            <div onClick={() => handleToggleOpen('payment')}>
                                {isPaymentOpen ? <S.ArrowUpIcon /> : <S.ArrowDownIcon />}
                            </div>
                        </S.PaymentHeader>
                        {isPaymentOpen && (
                            <S.PaymentMethods>
                                <S.PaymentMethod
                                    selected={paymentMethod === 'rocketPay'}
                                    onClick={() => setPaymentMethod('rocketPay')}
                                >
                                    로켓페이
                                </S.PaymentMethod>
                                <S.PaymentMethod
                                    selected={paymentMethod === 'creditCard'}
                                    onClick={() => setPaymentMethod('creditCard')}
                                >
                                    신용카드
                                </S.PaymentMethod>
                                <S.PaymentMethod
                                    selected={paymentMethod === 'bankTransfer'}
                                    onClick={() => setPaymentMethod('bankTransfer')}
                                >
                                    무통장입금
                                </S.PaymentMethod>
                                <S.PaymentMethod
                                    selected={paymentMethod === 'accountTransfer'}
                                    onClick={() => setPaymentMethod('accountTransfer')}
                                >
                                    계좌이체
                                </S.PaymentMethod>
                            </S.PaymentMethods>
                        )}
                    </S.PaymentMethodSection>
                </S.OrderSection>

                {/* 주문 정보 사이드바 컴포넌트 */}
                <S.OrderSidebar className={isSidebarFixed ? 'fixed' : ''}>
                    {/* 주문 합계 섹션 */}
                    <S.OrderSummarySection>
                        <div>주문 합계</div>

                        {/* 주문 합계 정보 */}
                        <S.OrderSummaryInfo>
                            <S.SummaryRow>
                                <span>상품금액</span>
                                <span>{isDirectPurchase ? items[0].discount.toLocaleString() : totalPrice.toLocaleString()} 원</span>
                            </S.SummaryRow>
                            <S.SummaryRow>
                                <span>할인금액</span>
                                <span>0 원</span>
                            </S.SummaryRow>
                        </S.OrderSummaryInfo>

                        {/* 총 주문 금액 */}
                        <S.TotalPrice>
                            <span>총 주문 금액</span>
                            <span>{isDirectPurchase ? items[0].discount.toLocaleString() : totalPrice.toLocaleString()} 원</span>
                        </S.TotalPrice>

                        {/* 주문하기 버튼 */}
                        <S.OrderButton
                            onClick={handlePaymentClick}
                            disabled={isLoading || totalCount === 0}
                        >
                            {isLoading ? '처리 중...' : '결제하기'}
                        </S.OrderButton>
                    </S.OrderSummarySection>
                </S.OrderSidebar>

            </S.OrderMain>
        </S.OrderPageContainer>
    )
}

export default OrderPage;