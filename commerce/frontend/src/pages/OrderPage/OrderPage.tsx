import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderSteps from './components/Common/OrderSteps/OrderSteps';
import OrderItemList from './components/OrderItemList/OrderItemList';
import * as S from './OrderPage.styled';

interface OrderItemType {
    orderId: number;
    productId: number;
    title: string;
    imageUrl: string;
    price: number;
}

// 임시 데이터
const orderItemsData: OrderItemType[] = [
    {
        orderId: 1,
        productId: 1,
        title: "반항하는 인간1 반항하는 인간1 반항하는 인간1 반항하는 인간1 반항하는 인간1 반항하는 인간1",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        price: 10000,
    },
    {
        orderId: 2,
        productId: 2,
        title: "반항하는 인간2",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        price: 10000,
    },
    {
        orderId: 3,
        productId: 3,
        title: "반항하는 인간3",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        price: 20000,
    },
    {
        orderId: 4,
        productId: 4,
        title: "반항하는 인간4",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        price: 20000,
    },
    {
        orderId: 5,
        productId: 5,
        title: "반항하는 인간5",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        price: 30000,
    },
    {
        orderId: 6,
        productId: 6,
        title: "반항하는 인간6",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        price: 30000,
    },
]

const OrderPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarFixed, setIsSidebarFixed] = useState(false); // 사이드바 고정 여부
    const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
    const [isItemOpen, setIsItemOpen] = useState(true); // 주문상품 섹션 펼치기 여부
    const [isPaymentOpen, setIsPaymentOpen] = useState(true); // 결제수단 섹션 펼치기 여부ㅓ
    const [paymentMethod, setPaymentMethod] = useState('rocket_pay'); // 결제수단

    // 다른 페이지 -> 주문 페이지로 이동 시 스크롤 처리
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        // 주문 데이터 초기화
        setOrderItems(orderItemsData);

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
    const handlePaymentClick = () => {
        // navigate('/payment');
    }

    // 서버에서 가져온 가격
    const totalPrice = 120000;

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
                                <span>{orderItems.length}</span>
                                <span>개</span>
                            </div>
                            <div onClick={() => handleToggleOpen('item')}>
                                {isItemOpen ? <S.ArrowUpIcon /> : <S.ArrowDownIcon />}
                            </div>
                        </S.ItemHeader>

                        {/* 주문 상품 리스트 */}
                        {isItemOpen && <OrderItemList orderItems={orderItems} />}
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
                                    selected={paymentMethod === 'rocket_pay'}
                                    onClick={() => setPaymentMethod('rocket_pay')}
                                >
                                    로켓페이
                                </S.PaymentMethod>
                                <S.PaymentMethod
                                    selected={paymentMethod === 'credit_card'}
                                    onClick={() => setPaymentMethod('credit_card')}
                                >
                                    신용카드
                                </S.PaymentMethod>
                                <S.PaymentMethod
                                    selected={paymentMethod === 'bank_transfer'}
                                    onClick={() => setPaymentMethod('bank_transfer')}
                                >
                                    무통장입금
                                </S.PaymentMethod>
                                <S.PaymentMethod
                                    selected={paymentMethod === 'account_transfer'}
                                    onClick={() => setPaymentMethod('account_transfer')}
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
                                <span>{totalPrice.toLocaleString()} 원</span>
                            </S.SummaryRow>
                            <S.SummaryRow>
                                <span>할인금액</span>
                                <span>0 원</span>
                            </S.SummaryRow>
                        </S.OrderSummaryInfo>

                        {/* 총 주문 금액 */}
                        <S.TotalPrice>
                            <span>총 주문 금액</span>
                            <span>{totalPrice.toLocaleString()} 원</span>
                        </S.TotalPrice>

                        {/* 주문하기 버튼 */}
                        <S.OrderButton onClick={handlePaymentClick}>결제하기</S.OrderButton>
                    </S.OrderSummarySection>
                </S.OrderSidebar>

            </S.OrderMain>
        </S.OrderPageContainer>
    )
}

export default OrderPage;