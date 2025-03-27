import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderSteps from "../OrderPage/components/Common/OrderSteps/OrderSteps";
import CartItemList from "./components/CartItemList/CartItemList";
import * as S from './CartPage.styled';

interface CartItemType {
  cartId: number;
  productId: number;
  title: string;
  imageUrl: string;
  price: number;
}

// 임시 데이터
const cartItemsData: CartItemType[] = [
  {
    cartId: 1,
    productId: 1,
    title: "반항하는 인간1 반항하는 인간1 반항하는 인간1 반항하는 인간1 반항하는 인간1 반항하는 인간1",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 10000,
  },
  {
    cartId: 2,
    productId: 2,
    title: "반항하는 인간2",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 10000,
  },
  {
    cartId: 3,
    productId: 3,
    title: "반항하는 인간3",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 20000,
  },
  {
    cartId: 4,
    productId: 4,
    title: "반항하는 인간4",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 20000,
  },
  {
    cartId: 5,
    productId: 5,
    title: "반항하는 인간5",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 30000,
  },
  {
    cartId: 6,
    productId: 6,
    title: "반항하는 인간6",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    price: 30000,
  },
]

const CartPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarFixed, setIsSidebarFixed] = useState(false); // 사이드바 고정 여부
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]); // 체크된 아이템의 carId 저장
  const isAllChecked = checkedItems.length > 0 && checkedItems.length === cartItems.length; // 전체 아이템 개수와 선택된 아이템 개수가 같을 때만 전체선택 체크
  const totalPrice = () => {
    return cartItems
      .filter(item => checkedItems.includes(item.cartId))
      .reduce((sum, item) => sum + item.price, 0);
  }

  // 다른 페이지 -> 카트 페이지로 이동 시 스크롤 처리
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // 장바구니 데이터 초기화
    setCartItems(cartItemsData);
    setCheckedItems(cartItemsData.map(item => item.cartId));

    // 사이드바 고정 핸들러
    const handleScroll = () => {
      setIsSidebarFixed(window.scrollY > 170);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // 전체 선택 핸들러
  const handleAllCheck = () => {
    if (isAllChecked) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cartItems.map(item => item.cartId));
    }
  }

  // 개별 선택 핸들러
  const handleItemCheck = (cartId: number) => {
    if (checkedItems.includes(cartId)) { // 이미 체크되어 있으면 해제
      setCheckedItems(prev => prev.filter(id => id !== cartId));
    } else { // 체크되어 있지 않으면 체크
      setCheckedItems(prev => [...prev, cartId]);
    }
  }

  // 개별 삭제 핸들러
  const handleDeleteItem = (cartId: number) => {
    const isConfirmed = window.confirm('해당 상품을 삭제하시겠습니까?');

    if (isConfirmed) {
      setCartItems(prev => prev.filter(item => item.cartId !== cartId));
      setCheckedItems(prev => prev.filter(id => id !== cartId));
    }
  }

  // 선택된 아이템 삭제 핸들러
  const handleDeleteChecked = () => {
    const isConfirmed = window.confirm('선택한 상품을 삭제하시겠습니까?');

    if (isConfirmed) {
      setCartItems(prev => prev.filter(item => !checkedItems.includes(item.cartId)));
      setCheckedItems([]); // 선택된 아이템을 모두 지웠으므로 체크 목록 초기화
    }
  }

  // 주문하기 버튼 클릭 핸들러
  const handleOrderClick = () => {
    navigate('/order');
  }

  return (
    <S.CartContainer>
      {/* 1. 장바구니 헤더 */}
      <S.CartHeader>
        <div>장바구니</div>
        <OrderSteps step={'cart'} />
      </S.CartHeader>
      {/* 2. 장바구니 메인 */}
      <S.CartMain>
        {/* 2-1. 장바구니 상품 섹션 */}
        <S.CartItemsSection>

          {/* 장바구니 컨트롤 바 */}
          <S.CartControlsBar>
            <S.CheckAllCheckbox onClick={handleAllCheck}>
              {isAllChecked ? <S.CheckAllIcon /> : <S.UncheckAllIcon />}
              <span>전체 선택</span>
            </S.CheckAllCheckbox>
            <S.DeleteCheckedButton onClick={handleDeleteChecked}>
              <button>삭제</button>
            </S.DeleteCheckedButton>
          </S.CartControlsBar>

          {/* 장바구니 품목 리스트 - 데이터 전달 */}
          <CartItemList
            cartItems={cartItems}
            checkedItems={checkedItems}
            onItemCheck={handleItemCheck}
            onDelete={handleDeleteItem}
          />
        </S.CartItemsSection>

        {/* 2-2. 주문 정보 사이드바 컴포넌트 */}
        <S.CartSidebar className={isSidebarFixed ? 'fixed' : ''}>

          {/* 주문 합계 섹션 */}
          <S.OrderSummarySection>
            <div>주문 합계</div>

            {/* 주문 합계 정보 */}
            <S.OrderSummaryInfo>
              <S.SummaryRow>
                <span>상품금액</span>
                <span>{totalPrice().toLocaleString()} 원</span>
              </S.SummaryRow>
              <S.SummaryRow>
                <span>할인금액</span>
                <span>0 원</span>
              </S.SummaryRow>
            </S.OrderSummaryInfo>

            {/* 총 주문 금액 */}
            <S.TotalPrice>
              <span>총 주문 금액</span>
              <span>{totalPrice().toLocaleString()} 원</span>
            </S.TotalPrice>

            {/* 주문하기 버튼 */}
            <S.OrderButton onClick={handleOrderClick}>주문하기</S.OrderButton>
          </S.OrderSummarySection>
        </S.CartSidebar>

      </S.CartMain>

      {/* 배송지 변경 모달 - 현재 미사용*/}
      {/* {isModalOpen && <AddressModal onClose={handleCloseModal} isModalOpen={isModalOpen} />} */}
    </S.CartContainer>
  )
}

export default CartPage;