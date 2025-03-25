import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import OrderSteps from "./components/OrderSteps/OrderSteps";
import CartItemList from "./components/CartItemList/CartItemList";
import AddressModal from "./components/AddressModal/AddressModal";
import * as S from './CartPage.styled';


// 임시 가격
const price = "50,400";

// 임시 데이터
interface CartItemType {
  cartId: number;
  productId: number;
  title: string;
  imageUrl: string;
  price: number;
}

const cartItems: CartItemType[] = [
  {
    cartId: 1,
    productId: 1,
    title: "반항하는 인간",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 25200,
  },
  {
    cartId: 2,
    productId: 2,
    title: "반항하는 인간",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 25200,
  },
  {
    cartId: 3,
    productId: 3,
    title: "반항하는 인간",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 25200,
  },
  {
    cartId: 4,
    productId: 4,
    title: "반항하는 인간",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 25200,
  },
  {
    cartId: 5,
    productId: 5,
    title: "반항하는 인간",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 25200,
  },
  {
    cartId: 6,
    productId: 6,
    title: "반항하는 인간",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 25200,
  },
]

const CartPage: React.FC = () => {
  const location = useLocation();
  const [isAllChecked, setIsAllChecked] = useState(true); // 전체 선택 체크박스
  const [isBaseAddressChecked, setIsBaseAddressChecked] = useState(true); // 기본 배송지 체크박스
  const [isSidebarFixed, setIsSidebarFixed] = useState(false); // 사이드바 고정 여부
  const [isModalOpen, setIsModalOpen] = useState(false); // 주소 변경 모달

  // 다른 페이지 -> 카트 페이지로 이동 시 스크롤 처리
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 스크롤 시 사이드바 고정
  useEffect(() => {
    const handleScroll = () => {
      setIsSidebarFixed(window.scrollY > 190);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 주소 변경 모달 열기  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  // 주소 변경 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <>
      <S.CartContainer>
        {/* 1. 장바구니 헤더 */}
        <S.CartHeader>
          <div>장바구니</div>
          <OrderSteps />
        </S.CartHeader>

        {/* 2. 장바구니 메인 */}
        <S.CartMain>
          {/* 2-1. 장바구니 상품 섹션 */}
          <S.CartItemsSection>

            {/* 장바구니 컨트롤 바 */}
            <S.CartControlsBar>
              <S.CheckAllCheckbox>
                {isAllChecked ? <S.CheckAllIcon /> : <S.UncheckAllIcon />}
                <span>전체 선택</span>
              </S.CheckAllCheckbox>
              <S.DeleteCheckedButton>
                <button>삭제</button>
              </S.DeleteCheckedButton>
            </S.CartControlsBar>

            {/* 장바구니 품목 리스트 - 데이터 전달 */}
            <CartItemList cartItems={cartItems} />
          </S.CartItemsSection>

          {/* 2-2. 주문 정보 사이드바 */}
          <S.CartOrderInfo className={isSidebarFixed ? 'fixed' : ''}>
            {/* 배송지 섹션 */}
            <S.AddressSection>
              <div>배송지</div>

              {/* 배송지 컨트롤 바 */}
              <S.AddressControlBar>
                <S.BaseAddressCheckbox>
                  {isBaseAddressChecked ? <S.CheckAddressIcon /> : <S.UncheckAddressIcon />}
                  <span>기본 배송지 선택</span>
                </S.BaseAddressCheckbox>
                <S.ChangeAddressButton onClick={handleOpenModal}>변경</S.ChangeAddressButton>
              </S.AddressControlBar>

              {/* 배송지 정보 */}
              <S.AddressInfo>
                <div>이구름</div>
                <div>서울특별시 종로구 이화동 123</div>
              </S.AddressInfo>
            </S.AddressSection>

            {/* 주문 합계 섹션 */}
            <S.OrderSummarySection>
              <div>주문 합계</div>

              {/* 주문 합계 정보 */}
              <S.OrderSummaryInfo>
                <S.SummaryRow>
                  <span>상품금액</span>
                  <span>{price} 원</span>
                </S.SummaryRow>
                <S.SummaryRow>
                  <span>할인금액</span>
                  <span>0 원</span>
                </S.SummaryRow>
                <S.SummaryRow>
                  <span>배송비</span>
                  <span>0 원</span>
                </S.SummaryRow>
              </S.OrderSummaryInfo>

              {/* 총 주문 금액 */}
              <S.TotalPrice>
                <span>총 주문 금액</span>
                <span>{price} 원</span>
              </S.TotalPrice>

              <S.OrderButton>주문하기</S.OrderButton>
            </S.OrderSummarySection>
          </S.CartOrderInfo>
        </S.CartMain>
      </S.CartContainer>

      {/* 주소 변경 모달 */}
      {isModalOpen && <AddressModal onClose={handleCloseModal} isModalOpen={isModalOpen} />}
    </>
  )
}

export default CartPage;