import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderSteps from "../OrderPage/components/Common/OrderSteps/OrderSteps";
import CartItemList from "./components/CartItemList/CartItemList";
import * as S from './CartPage.styled';
import { useAuth, useCart } from '../../hooks';

const CartPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarFixed, setIsSidebarFixed] = useState(false); // 사이드바 고정 여부
  const [checkedItems, setCheckedItems] = useState<string[]>([]); // 체크된 아이템의 carId 저장
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 첫 렌더링 여부 (상품이 삭제된 후에도 체크상태 유지를 위해 필요)
  const { isAuthenticated } = useAuth();
  const {
    books: cartBooks,
    totalCount,
    fetchCartItems,
    calculateTotalPrice,
    removeFromCart,
    clearCart
  } = useCart();
  // 전체 아이템 개수와 선택된 아이템 개수가 같을 때만 전체선택 체크
  const isAllChecked = checkedItems.length > 0 && checkedItems.length === cartBooks.length;

  // 다른 페이지에서 카트 페이지로 들어온 경우, 스크롤 최상단 처리
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 사이드바 고정 처리
  useEffect(() => {
    const handleScroll = () => {
      setIsSidebarFixed(window.scrollY > 170);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // 렌더링 시 최신 장바구니 데이터 가져오기
  useEffect(() => {
    if (isAuthenticated) {  
      fetchCartItems();
    }
  }, [isAuthenticated, fetchCartItems]);
  
  // 장바구니 데이터 업데이트 시 checkedItems도 업데이트
  useEffect(() => {
    if (isFirstLoad) { // 첫 렌더링 시 전체선택 되도록
      setCheckedItems(cartBooks.map(item => item.id));
      setIsFirstLoad(false);
    } else { // 이후 렌더링 시애는 체크상태 유지
      setCheckedItems(prev =>
        cartBooks
        .map(item => item.id)
        .filter(id => prev.includes(id))
      );
    }
  }, [cartBooks, isFirstLoad]);

  // 전체 선택 핸들러
  const handleAllCheck = () => {
    if (isAllChecked) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cartBooks.map(item => item.id));
    }
  }

  // 개별 선택 핸들러
  const handleItemCheck = (id: string) => {
    if (checkedItems.includes(id)) { // 이미 체크되어 있으면 해제
      setCheckedItems(prev => prev.filter(checkedId => checkedId !== id));
    } else { // 체크되어 있지 않으면 체크
      setCheckedItems(prev => [...prev, id]);
    }
  }

  // 개별 삭제 핸들러
  const handleDeleteItem = async (id: string) => {
    const isConfirmed = window.confirm('해당 상품을 삭제하시겠습니까?');

    if (isConfirmed) {
      await removeFromCart(id);  // 특정 상품 삭제

      setCheckedItems(prev => prev.filter(checkedId => checkedId !== id));
    }
  }

  // 선택된 아이템 삭제 핸들러
  const handleDeleteChecked = async () => {
    const isConfirmed = window.confirm('선택한 상품을 삭제하시겠습니까?');

    if (isConfirmed) {
      await removeFromCart(checkedItems); // 선택된 아이템 삭제
      // setCartItems(prev => prev.filter(item => !checkedItems.includes(item.cartId)));
      // removeFromCart();
      
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
        <div>장바구니 ({totalCount})</div>
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
            cartBooks={cartBooks}
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
                <span>{calculateTotalPrice().toLocaleString()} 원</span>
              </S.SummaryRow>
              <S.SummaryRow>
                <span>할인금액</span>
                <span>0 원</span>
              </S.SummaryRow>
            </S.OrderSummaryInfo>

            {/* 총 주문 금액 */}
            <S.TotalPrice>
              <span>총 주문 금액</span>
              <span>{calculateTotalPrice().toLocaleString()} 원</span>
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