import styled from 'styled-components';
import { BsCheckCircleFill, BsCheckCircle } from 'react-icons/bs';

export const CartContainer = styled.div`
    width: 1200px;
    margin: 0 auto;
    margin-bottom: 100px;
`;

// 1. 장바구니 헤더
export const CartHeader = styled.header`
    display: flex;
    justify-content: space-between;
    border-bottom: 1.5px solid #707070;
    padding: 20px 0px 15px 0;

    > div:first-child {
        font-size: 26px;
        font-weight: 700;
        color: #000;
    }
`;

// 2. 장바구니 메인
export const CartMain = styled.main`
    display: flex;
    gap: 30px;
`; 

// 2-1. 장바구니 품목 섹션
export const CartItemsSection = styled.section`
    display: flex;
    flex-direction: column;
    width: 835px;

    // 사이드바 고정 전 스타일
    // flex: 1;
    // width: calc((835 / 1200) * 100%);
`;

// 2-2. 장바구니 컨트롤 바
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

// 3. 주문 정보 사이드바
export const CartOrderInfo = styled.aside`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 65px;
    width: 335px;
    transition: all 0.3s ease;
    // 사이드바 고정 전 스타일
    // width: 28%;

    &.fixed {
        position: fixed;
        top: 70px;
        right: calc((100% - 1215px) / 2);
    }
`;

// 3-1. 배송지 섹션
export const AddressSection = styled.section`
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

// 배송지 컨트롤 바
export const AddressControlBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 0;
`;

// 기본 배송지 체크 박스
export const BaseAddressCheckbox = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    > span {
        font-size: 15px;
        color: #000;
    }
`;

// 기본 배송지 체크 아이콘
export const CheckAddressIcon = styled(BsCheckCircleFill)`
    width: 18px;
    height: 18px;
    color: #E896FF;
`;
export const UncheckAddressIcon = styled(BsCheckCircle)`
    width: 18px;
    height: 18px;
    color: #D9D9D9;

    &:hover {
        color: #E896FF;
    }
`;

// 배송지 변경 버튼
export const ChangeAddressButton = styled.button`
    display: flex;
    align-items: center;
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    background-color: #FFF;
    color: #000;
    font-size: 15px;
    height: 28px;
    padding: 0 12px;

    &:hover {
        background-color: #F9F9F9;
        border-color: #D9D9D9;
    }

    &:focus {
        outline: none;
    }
`;

// 배송지 정보
export const AddressInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    border: 1px solid #D9D9D9;
    border-radius: 8px;
    padding: 14px;
    color: #000;
    font-size: 14px;

    > div:first-child {
        font-weight: 700;
    }
`;

// 3-2. 주문 합계 섹션
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
    font-size: 18px;
    border-radius: 5px;
    border: none;

    &:hover {
        background-color: #D485E8;
    }

    &:focus {
        outline: none;
    }
`;
