import styled from 'styled-components';
import { BsCheckCircleFill, BsCheckCircle } from 'react-icons/bs';

export const CartContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    margin-bottom: 100px;
`;

// 장바구니 헤더
export const CartHeader = styled.header`
    display: flex;
    justify-content: space-between;
    border-bottom: 1.5px solid #D9D9D9;
    padding: 20px 0px 15px 0;

    > div:first-child {
        font-size: 26px;
        font-weight: 700;
        color: #000;
    }
`;

// 장바구니 메인
export const CartMain = styled.main`
    display: flex;
    gap: 30px;
`; 

// 장바구니 품목 섹션
export const CartItemsSection = styled.section`
    display: flex;
    flex-direction: column;
    flex: 1; // 사이드바 고정 전 넓이
    
    // 노트북 크기 이상에서만 넓이 고정
    @media screen and (min-width: 1500px) {
        flex: none;
        width: 870px; // 1200(컨테이너) - 30(갭) - 300(사이드바)
    }
`;

// 장바구니 컨트롤 바
export const CartControlsBar = styled.div`
    display: flex;
    justify-content: space-between;
    height: 65px;
    border-bottom: 1px solid #D9D9D9;
`;

// 전체 선택 체크박스
export const CheckAllCheckbox = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;

    > span {
        font-size: 16px;
        color: #000;
    }
`;

// 전체 선택 아이콘
export const CheckAllIcon = styled(BsCheckCircleFill)`
    width: 24px;
    height: 24px;
    color: #E896FF;
    // color: #E078CA;
`;
export const UncheckAllIcon = styled(BsCheckCircle)`
    width: 24px;
    height: 24px;
    color: #D9D9D9;

    &:hover {
        color: #E896FF;
    }
`;

// 선택 품목 삭제 버튼
export const DeleteCheckedButton = styled.div`
    display: flex;
    align-items: center;

    > button {
        display: flex;
        align-items: center;
        border: 1px solid #D9D9D9;
        border-radius: 5px;
        background-color: #FFF;
        color: #000;
        font-size: 16px;
        height: 35px;

        &:hover {
            background-color: #F9F9F9;
        }

        &:focus {
            outline: none;
        }
    }
`;

export const CartSidebar = styled.aside`
    margin-top: 65px;
    transition: all 0.3s ease;
    width: 300px;

    // 사이드 바 고정 시
    &.fixed {
        // 노트북 화면
        @media screen and (min-width: 1500px) {
            position: fixed;
            top: 70px;
            right: calc((100% - 1215px) / 2);
        }

        // 큰 모니터
        @media screen and (min-width: 1520px) {
            position: fixed;
            top: 70px;
            right: calc((100% - 1200px) / 2);
        }
    }
`;

// 주문 합계 섹션
export const OrderSummarySection = styled.section`
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    padding: 25px;

    > div:first-child {
        font-size: 18px;
        font-weight: 700;
        color: #000;
        border-bottom: 1px solid #D9D9D9;
        padding-bottom: 15px;
    }
`;

// 주문 합계 정보
export const OrderSummaryInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 18px 0;
    border-bottom: 1px solid #D9D9D9;
    font-size: 14px;
`;

export const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span:first-child {
        color: #5F5F5F;
    }

    > span:last-child {
        color: #000;
    }
`;

// 총 주문 금액
export const TotalPrice = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 0;
    font-size: 14px;

    > span:first-child {
        color: #000;
        font-weight: 700;
        font-size: 15px;
    }

    > span:last-child {
        color: #E896FF;
        font-weight: 700;
        font-size: 18px;
    }
`;

// 주문 버튼
export const OrderButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 42px;
    background-color: #E896FF;
    color: #FFF;
    font-size: 16px;
    border-radius: 5px;
    border: none;

    &:hover {
        background-color: #D485E8;
    }

    &:focus {
        outline: none;
    }
`;